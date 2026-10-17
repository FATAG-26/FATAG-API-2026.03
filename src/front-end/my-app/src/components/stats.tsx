import { buscarResumo, type Filtros } from '../api'
import { useDados } from '../hooks'

type StatsProps = {
    filtros: Filtros // mesmos filtros da tabela; sem filtros = dados gerais
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

function Stats({ filtros }: StatsProps) {
    const { dados: resumo, carregando, erro } = useDados(
        (signal) => buscarResumo(filtros, signal),
        `resumo:${JSON.stringify(filtros)}`,
    )

    const contagem = (chave: string) => resumo?.porResultado[chave] ?? 0
    const total = resumo?.total ?? 0
    const raio = 40
    const circunferencia = 2 * Math.PI * raio

    // Cada fatia começa onde a anterior terminou.
    const tamanhos = CATEGORIAS.map((c) => (total ? (contagem(c.chave) / total) * circunferencia : 0))
    const fatias = CATEGORIAS.map((c, i) => ({
        ...c,
        dash: tamanhos[i],
        deslocamento: -tamanhos.slice(0, i).reduce((soma, t) => soma + t, 0),
    }))

    const valor = (n: number | undefined) => (resumo ? formatar(n ?? 0) : '…')
    const opaco = carregando && resumo ? 'opacity-50' : ''

    return (
        <div className={`mt-4 mb-4 grid w-full min-w-0 grid-cols-1 gap-3 transition-opacity md:grid-cols-2 xl:grid-cols-3 ${opaco}`}>
            {erro && (
                <p className="col-span-full text-center text-sm text-[#900603]">
                    Não foi possível carregar os indicadores: {erro}
                </p>
            )}

            {/* Gráfico de periciados */}
            <div className="flex min-w-0 flex-col overflow-hidden rounded border border-gray-300 bg-white">
                <div className="bg-[#1E1E1E] p-2 text-center font-bold text-white">Periciados</div>

                <div className="flex flex-1 flex-col items-center justify-center p-3">
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <svg
                            width="120"
                            height="120"
                            viewBox="0 0 100 100"
                            className="shrink-0 -rotate-90"
                            role="img"
                            aria-label={`Gráfico donut com ${formatar(total)} bombas periciadas`}
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
                                    strokeWidth="15"
                                    strokeDasharray={`${f.dash} ${circunferencia}`}
                                    strokeDashoffset={f.deslocamento}
                                />
                            ))}
                        </svg>

                        <div className="flex flex-col gap-2 text-left text-sm">
                            {CATEGORIAS.map((c) => (
                                <div key={c.chave} className="flex items-center gap-2">
                                    <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: c.cor }} />
                                    <span>
                                        {c.rotulo}: {valor(contagem(c.chave))}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-3 text-center font-bold">Total Periciado: {valor(total)}</div>
                </div>
            </div>

            {/* Indicadores de conformidade e autuações */}
            <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-1">
                {/* Total em conformidade = bombas aprovadas */}
                <div className="flex min-w-0 flex-col overflow-hidden rounded border border-gray-300 bg-white">
                    <div className="bg-[#1E1E1E] p-2 text-center font-bold text-white">Total em Conformidade</div>
                    <div className="flex flex-1 items-center justify-center p-6">
                        <p className="text-3xl font-bold sm:text-4xl">Nº: {valor(contagem('Aprovado'))}</p>
                    </div>
                </div>

                {/* Total de autuações = bombas reprovadas (igual ao notebook) */}
                <div className="flex min-w-0 flex-col overflow-hidden rounded border border-gray-300 bg-white">
                    <div className="bg-[#1E1E1E] p-2 text-center font-bold text-white">Total de Autuações</div>
                    <div className="flex flex-1 flex-col items-center justify-center p-6">
                        <p className="text-3xl font-bold sm:text-4xl">Nº: {valor(contagem('Reprovado'))}</p>
                        <p className="text-xs text-gray-500">bombas reprovadas</p>
                    </div>
                </div>
            </div>

            {/* Percentual de bombas */}
            <div className="flex min-w-0 flex-col overflow-hidden rounded border border-gray-300 bg-white">
                <div className="bg-[#1E1E1E] p-2 text-center font-bold text-white">% de Bombas</div>

                <div className="flex flex-1 flex-col items-center justify-center gap-2 p-4">
                    <p className="text-lg font-bold text-[#00b040]">
                        Aprovadas: {resumo ? formatarPct(resumo.percentuais.aprovado) : '…'}
                    </p>
                    <p className="text-lg font-bold text-[#b00000]">
                        Reprovadas: {resumo ? formatarPct(resumo.percentuais.reprovado) : '…'}
                    </p>
                    <p className="text-lg font-bold text-[#dcab00]">
                        Interditadas: {resumo ? formatarPct(resumo.percentuais.interditado) : '…'}
                    </p>
                    <p className="text-center text-xs text-gray-500">sobre o total periciado</p>
                </div>
            </div>
        </div>
    )
}

export default Stats
