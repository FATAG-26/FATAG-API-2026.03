import { useState } from 'react'
import { buscarResumo, type CampoFiltroTexto, type Filtros } from '../api'
import { useDados } from '../hooks'

type StatsProps = {
    filtros: Filtros // mesmos filtros da tabela; sem filtros = dados gerais
    /** Sem `alterar` (ex.: no relatório em PDF) o gráfico fica só para leitura. */
    alterar?: (campo: CampoFiltroTexto, valor: string) => void
    /** Resultado escolhido agora (antes da pausa dos filtros), para o destaque responder na hora. */
    selecionado?: string
}

// Categorias do gráfico (as mesmas do gráfico de pizza do notebook).
const CATEGORIAS = [
    { chave: 'Aprovado', rotulo: 'Nº Aprovados', cor: '#00b040' },
    { chave: 'Reprovado', rotulo: 'Nº Reprovados', cor: '#b00000' },
    { chave: 'Interditado', rotulo: 'Nº Interditados', cor: '#dcab00' },
    { chave: 'Excluído', rotulo: 'Nº Excluídos', cor: '#6b7280' },
    { chave: 'Sem Verificação', rotulo: 'Nº Sem Verificação', cor: '#c4c9d2' },
]

const formatar = (n: number) => n.toLocaleString('pt-BR')
const formatarPct = (n: number) => `${n.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`

function Stats({ filtros, alterar, selecionado: selecionadoAgora }: StatsProps) {
    const [emFoco, setEmFoco] = useState<string | null>(null)

    // O gráfico e os cards usam os dados sem o filtro de resultado: assim o gráfico
    // continua mostrando todas as fatias e destaca a escolhida, em vez de virar 100%.
    const filtrosGerais = { ...filtros, resultado: '' }
    const { dados: geral, carregando, erro } = useDados(
        (signal) => buscarResumo(filtrosGerais, signal),
        `resumo-geral:${JSON.stringify(filtrosGerais)}`,
    )

    const selecionado = (selecionadoAgora ?? filtros.resultado).trim()
    const interativo = Boolean(alterar)
    const contagem = (chave: string) => geral?.porResultado[chave] ?? 0
    const total = geral?.total ?? 0
    const pct = (chave: string) => (total ? (contagem(chave) / total) * 100 : 0)
    const raio = 40
    const circunferencia = 2 * Math.PI * raio

    // Cada fatia começa onde a anterior terminou.
    const tamanhos = CATEGORIAS.map((c) => (total ? (contagem(c.chave) / total) * circunferencia : 0))
    const fatias = CATEGORIAS.map((c, i) => ({
        ...c,
        dash: tamanhos[i],
        deslocamento: -tamanhos.slice(0, i).reduce((soma, t) => soma + t, 0),
    }))

    // Clicar de novo na fatia já selecionada remove o filtro.
    const alternar = (chave: string) => alterar?.('resultado', selecionado === chave ? '' : chave)
    const destaque = emFoco ?? (selecionado || null)
    const categoriaDestaque = CATEGORIAS.find((c) => c.chave === destaque)
    const apagada = (chave: string) => Boolean(destaque) && destaque !== chave

    const valor = (n: number | undefined) => (geral ? formatar(n ?? 0) : '…')
    const opaco = carregando && geral ? 'opacity-50' : ''

    return (
        <div className={`mt-4 mb-4 grid w-full min-w-0 grid-cols-1 gap-3 transition-opacity md:grid-cols-2 xl:grid-cols-3 ${opaco}`}>
            {erro && (
                <p className="col-span-full text-center text-sm text-[#900603]">
                    Não foi possível carregar os indicadores: {erro}
                </p>
            )}

            {/* Gráfico de periciados */}
            <div className="flex min-w-0 flex-col overflow-hidden rounded border border-gray-300 bg-[#FBFBFB]">
                <div className="bg-[#094780] p-2 text-center font-bold text-white">Periciados</div>

                <div className="flex flex-1 flex-col items-center justify-center p-3">
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <div className="relative shrink-0">
                            <svg
                                width="140"
                                height="140"
                                viewBox="0 0 100 100"
                                className="-rotate-90"
                                role="img"
                                aria-label={`Gráfico de rosca com ${formatar(total)} bombas periciadas`}
                            >
                                {/* Anel de fundo: aparece quando não há dados */}
                                <circle cx="50" cy="50" r={raio} fill="none" stroke="#e5e7eb" strokeWidth="15" />
                                {fatias.map((f) => (
                                    <circle
                                        key={f.chave}
                                        cx="50"
                                        cy="50"
                                        r={raio}
                                        fill="none"
                                        stroke={f.cor}
                                        strokeWidth={destaque === f.chave ? 19 : 15}
                                        strokeDasharray={`${f.dash} ${circunferencia}`}
                                        strokeDashoffset={f.deslocamento}
                                        opacity={apagada(f.chave) ? 0.3 : 1}
                                        className={`transition-all duration-150 ${interativo ? 'cursor-pointer' : ''}`}
                                        onMouseEnter={() => setEmFoco(f.chave)}
                                        onMouseLeave={() => setEmFoco(null)}
                                        onClick={() => alternar(f.chave)}
                                    >
                                        <title>{`${f.rotulo}: ${formatar(contagem(f.chave))} (${formatarPct(pct(f.chave))})`}</title>
                                    </circle>
                                ))}
                            </svg>

                            {/* Centro do gráfico: total ou a fatia em destaque */}
                            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center leading-tight">
                                {categoriaDestaque ? (
                                    <>
                                        <span className="text-lg font-bold" style={{ color: categoriaDestaque.cor }}>
                                            {formatarPct(pct(categoriaDestaque.chave))}
                                        </span>
                                        <span className="text-[10px] text-gray-600">{categoriaDestaque.chave}</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-lg font-bold">{valor(total)}</span>
                                        <span className="text-[10px] text-gray-600">bombas</span>
                                    </>
                                )}
                            </div>
                        </div>

                        <ul className="flex flex-col gap-1 text-left text-sm">
                            {CATEGORIAS.map((c) => {
                                const conteudo = (
                                    <>
                                        <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: c.cor }} />
                                        <span>
                                            {c.rotulo}: {valor(contagem(c.chave))}
                                        </span>
                                    </>
                                )
                                return (
                                    <li key={c.chave} className={`transition-opacity ${apagada(c.chave) ? 'opacity-40' : ''}`}>
                                        {interativo ? (
                                            <button
                                                type="button"
                                                aria-pressed={selecionado === c.chave}
                                                title={selecionado === c.chave ? 'Clique para remover o filtro' : `Filtrar por ${c.chave}`}
                                                onClick={() => alternar(c.chave)}
                                                onMouseEnter={() => setEmFoco(c.chave)}
                                                onMouseLeave={() => setEmFoco(null)}
                                                onFocus={() => setEmFoco(c.chave)}
                                                onBlur={() => setEmFoco(null)}
                                                className={`flex w-full items-center gap-2 rounded px-1 py-0.5 text-left hover:bg-gray-200 ${selecionado === c.chave ? 'bg-gray-200 font-semibold' : ''}`}
                                            >
                                                {conteudo}
                                            </button>
                                        ) : (
                                            <div className="flex items-center gap-2 px-1 py-0.5">{conteudo}</div>
                                        )}
                                    </li>
                                )
                            })}
                        </ul>
                    </div>

                    <div className="mt-3 text-center font-bold">Total Periciado: {valor(total)}</div>
                    {interativo && (
                        <p className="mt-1 text-center text-xs text-gray-500">
                            {selecionado
                                ? `Filtrando por "${selecionado}". Clique de novo para remover.`
                                : 'Clique numa fatia ou na legenda para filtrar o painel.'}
                        </p>
                    )}
                </div>
            </div>

            {/* Indicadores de conformidade e autuações */}
            <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-1">
                {/* Total em conformidade = bombas aprovadas */}
                <div className="flex min-w-0 flex-col overflow-hidden rounded border border-gray-300 bg-[#FBFBFB]">
                    <div className="bg-[#094780] p-2 text-center font-bold text-white">Total em Conformidade</div>
                    <div className="flex flex-1 items-center justify-center p-6">
                        <p className="text-3xl font-bold sm:text-4xl">Nº: {valor(contagem('Aprovado'))}</p>
                    </div>
                </div>

                {/* Total de autuações = bombas reprovadas (igual ao notebook) */}
                <div className="flex min-w-0 flex-col overflow-hidden rounded border border-gray-300 bg-[#FBFBFB]">
                    <div className="bg-[#094780] p-2 text-center font-bold text-white">Total de Autuações</div>
                    <div className="flex flex-1 flex-col items-center justify-center p-6">
                        <p className="text-3xl font-bold sm:text-4xl">Nº: {valor(contagem('Reprovado'))}</p>
                        <p className="text-xs text-gray-500">bombas reprovadas</p>
                    </div>
                </div>
            </div>

            {/* Percentual de bombas */}
            <div className="flex min-w-0 flex-col overflow-hidden rounded border border-gray-300 bg-[#FBFBFB]">
                <div className="bg-[#094780] p-2 text-center font-bold text-white">% de Bombas</div>

                <div className="flex flex-1 flex-col items-center justify-center gap-2 p-4">
                    <p className="text-lg font-bold text-[#00b040]">
                        Aprovadas: {geral ? formatarPct(geral.percentuais.aprovado) : '…'}
                    </p>
                    <p className="text-lg font-bold text-[#b00000]">
                        Reprovadas: {geral ? formatarPct(geral.percentuais.reprovado) : '…'}
                    </p>
                    <p className="text-lg font-bold text-[#dcab00]">
                        Interditadas: {geral ? formatarPct(geral.percentuais.interditado) : '…'}
                    </p>
                    <p className="text-center text-xs text-gray-500">sobre o total periciado</p>
                </div>
            </div>
        </div>
    )
}

export default Stats
