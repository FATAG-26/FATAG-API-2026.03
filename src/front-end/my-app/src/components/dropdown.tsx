
import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { buscarTodasBombas, type Filtros } from '../api'

type DropdownProps = {
    acao: ReactNode
    filtros: Filtros
}

function baixarArquivo(conteudo: string, nome: string, tipo: string) {
    const arquivo = new Blob([conteudo], { type: tipo })
    const url = URL.createObjectURL(arquivo)

    const link = document.createElement('a')
    link.href = url
    link.download = nome

    document.body.appendChild(link)
    link.click()
    link.remove()

    URL.revokeObjectURL(url)
}

function Dropdown({ acao, filtros }: DropdownProps) {
    const [aberto, setAberto] = useState(false)
    const [exportando, setExportando] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!aberto) return

        function fecharAoInteragirFora(evento: PointerEvent) {
            if (!dropdownRef.current?.contains(evento.target as Node)) {
                setAberto(false)
            }
        }

        function fecharComEscape(evento: KeyboardEvent) {
            if (evento.key === 'Escape') setAberto(false)
        }

        document.addEventListener('pointerdown', fecharAoInteragirFora)
        document.addEventListener('keydown', fecharComEscape)

        return () => {
            document.removeEventListener('pointerdown', fecharAoInteragirFora)
            document.removeEventListener('keydown', fecharComEscape)
        }
    }, [aberto])

    async function obterDados() {
        if (exportando) return

        setExportando(true)

        try {
            const dados = await buscarTodasBombas(filtros)
            return dados
        } catch (erro) {
            console.error('Erro ao buscar dados para exportação:', erro)
            alert('Não foi possível buscar os dados para exportação.')
            return null
        } finally {
            setExportando(false)
        }
    }

    async function exportarCSV() {
        const dados = await obterDados()
        if (!dados) return

        const colunas = [
            'MUNICIPIO',
            'BAIRRO',
            'PROPRIETARIO',
            'DESCRICAO',
            'NUMERO_INMETRO',
            'NUMERO_SERIE',
            'DATA_VERIFICACAO',
            'RESULTADO',
        ] as const

        function escaparCSV(valor: string | null) {
            const texto = valor ?? ''
            return `"${texto.replace(/"/g, '""')}"`
        }

        const cabecalho = colunas.join(';')

        const linhas = dados.map((item) =>
            colunas.map((coluna) => escaparCSV(item[coluna])).join(';')
        )

        const csv = '\uFEFF' + [cabecalho, ...linhas].join('\r\n')

        baixarArquivo(
            csv,
            `relatorio_bombas_${new Date().toISOString().slice(0, 10)}.csv`,
            'text/csv;charset=utf-8;'
        )
    }

    async function exportarJSON() {
        const dados = await obterDados()
        if (!dados) return

        const json = JSON.stringify(dados, null, 2)

        baixarArquivo(
            json,
            `relatorio_bombas_${new Date().toISOString().slice(0, 10)}.json`,
            'application/json;charset=utf-8;'
        )
    }

    return (
        <div ref={dropdownRef} className="relative inline-block">
            <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={aberto}
                onClick={() => setAberto((valor) => !valor)}
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-white hover:bg-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00275a]"
            >
                Relatórios

                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    aria-hidden="true"
                    className="size-5 shrink-0"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m19.5 8.25-7.5 7.5-7.5-7.5"
                    />
                </svg>
            </button>

            {aberto && (
                <div
                    role="menu"
                    className="absolute right-0 z-50 mt-2 flex w-max flex-col items-stretch gap-2 whitespace-nowrap rounded-lg border border-gray-200 bg-white p-2 text-gray-900 shadow-lg [&>button]:inline-flex [&>button]:items-center [&>button]:gap-2"
                    onClick={() => setAberto(false)}
                >
                    {acao}

                    <button
                        type="button"
                        role="menuitem"
                        disabled={exportando}
                        onClick={exportarCSV}
                        className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-white px-4 py-2 font-semibold text-[#00275a] shadow hover:bg-blue-50 disabled:opacity-50"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5" />
                        </svg>
                        CSV
                    </button>

                    <button
                        type="button"
                        role="menuitem"
                        disabled={exportando}
                        onClick={exportarJSON}
                        className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-white px-4 py-2 font-semibold text-[#00275a] shadow hover:bg-blue-50 disabled:opacity-50"
                    >
                       {`{ } JSON`}
                    </button>
                </div>
            )}
        </div>
    )
}

export default Dropdown
