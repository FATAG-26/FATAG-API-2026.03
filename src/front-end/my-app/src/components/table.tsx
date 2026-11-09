import { useRef, useState, type UIEvent } from 'react'
import { buscarBombas, type Bomba, type Filtros } from '../api'
import { useDados } from '../hooks'

type TableProps = {
    filtros: Filtros // o que já foi aplicado (depois da pausa na digitação)
}

function corResultado(resultado: string | null) {
    switch (resultado) {
        case 'Aprovado':
            return 'text-[#008000]'
        case 'Reprovado':
            return 'text-[#900603]'
        case 'Interditado':
            return 'text-[#dcab00]'
        default:
            return 'text-gray-500'
    }
}

const formatar = (n: number) => n.toLocaleString('pt-BR')

const cabecalho = 'sticky top-0 z-10 bg-[#094780] px-4 py-2 text-white'
const celula = 'border border-gray-300 bg-white px-4 py-2'
function Table({ filtros }: TableProps) {
    const chave = JSON.stringify(filtros)

    // Primeira página: recarrega sempre que os filtros aplicados mudam.
    const primeira = useDados((signal) => buscarBombas(filtros, 0, signal), `bombas:${chave}`)

    // Páginas seguintes (scroll infinito). Ficam atreladas à chave dos filtros em que
    // foram buscadas; se os filtros mudarem, as páginas antigas deixam de ser exibidas.
    const [extras, setExtras] = useState<{ chave: string; itens: Bomba[] } | null>(null)
    const [carregandoMais, setCarregandoMais] = useState(false)
    const [erroMais, setErroMais] = useState<string>()
    const buscando = useRef(false)

    const itens = [
        ...(primeira.dados?.itens ?? []),
        ...(extras?.chave === chave ? extras.itens : []),
    ]
    const total = primeira.dados?.total ?? 0

    async function carregarMais() {
        if (buscando.current || primeira.carregando || itens.length >= total) return
        buscando.current = true
        setCarregandoMais(true)
        setErroMais(undefined)
        try {
            const pagina = await buscarBombas(filtros, itens.length)
            setExtras((anterior) => ({
                chave,
                itens: anterior?.chave === chave ? [...anterior.itens, ...pagina.itens] : pagina.itens,
            }))
        } catch (e) {
            setErroMais(e instanceof Error ? e.message : 'Erro ao carregar mais registros')
        } finally {
            buscando.current = false
            setCarregandoMais(false)
        }
    }

    function aoRolar(evento: UIEvent<HTMLDivElement>) {
        const el = evento.currentTarget
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 300) void carregarMais()
    }

    const semDadosAinda = primeira.dados === undefined

    return (
        <div className="grid-cols-4">
            <h2 className="mx-auto max-w-full px-3 text-center !text-[#1E1E1E] text-xl leading-tight sm:text-2xl">
                Tabela de Bombas em SP
            </h2>

            <div className="w-full min-w-0 overflow-hidden rounded-xl border border-gray-300">
                <div className="w-full min-w-0">
                    {/* key={chave}: ao mudar os filtros a rolagem volta para o topo */}
                    <div
                        key={chave}
                        onScroll={aoRolar}
                        className={`max-h-[60vh] w-full overflow-auto transition-opacity ${primeira.carregando && !semDadosAinda ? 'opacity-50' : ''}`}
                    >
                        <table className="w-full min-w-[900px] table-fixed border-collapse">
                            <thead>
                                <tr>
                                    <th className={cabecalho}>Município</th>
                                    <th className={cabecalho}>Bairro</th>
                                    <th className={cabecalho}>Proprietário</th>
                                    <th className={cabecalho}>Inmetro</th>
                                    <th className={cabecalho}>Verificado</th>
                                    <th className={cabecalho}>Resultado</th>
                                </tr>
                            </thead>

                            <tbody>
                                {itens.map((bomba, i) => (
                                    // O nº do Inmetro se repete nos dados reais, por isso a chave é a posição.
                                    <tr key={i}>
                                        <td className={celula}>{bomba.MUNICIPIO ?? '—'}</td>
                                        <td className={celula}>{bomba.BAIRRO ?? '—'}</td>
                                        <td className={celula}>{bomba.PROPRIETARIO ?? '—'}</td>
                                        <td className={celula}>{bomba.NUMERO_INMETRO ?? '—'}</td>
                                        <td className={celula}>{bomba.DATA_VERIFICACAO ?? '—'}</td>
                                        <td className={`${celula} font-semibold uppercase ${corResultado(bomba.RESULTADO)}`}>
                                            {bomba.RESULTADO ?? '—'}
                                        </td>
                                    </tr>
                                ))}

                                {(semDadosAinda || primeira.erro || (!primeira.carregando && itens.length === 0)) && (
                                    <tr>
                                        <td colSpan={6} className="border border-white px-4 py-2 text-center">
                                            {primeira.erro
                                                ? `Não foi possível carregar os dados: ${primeira.erro}`
                                                : semDadosAinda
                                                    ? 'Carregando…'
                                                    : 'Nenhum resultado encontrado.'}
                                        </td>
                                    </tr>
                                )}

                                {(carregandoMais || erroMais) && (
                                    <tr>
                                        <td colSpan={6} className="border border-white px-4 py-2 text-center">
                                            {erroMais ? `Erro ao carregar mais: ${erroMais}` : 'Carregando mais…'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Table
