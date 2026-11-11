
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
                        CSV
                    </button>

                    <button
                        type="button"
                        role="menuitem"
                        disabled={exportando}
                        onClick={exportarJSON}
                        className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-white px-4 py-2 font-semibold text-[#00275a] shadow hover:bg-blue-50 disabled:opacity-50"
                    >
                        JSON
                    </button>
                </div>
            )}
        </div>
    )
}

export default Dropdown
