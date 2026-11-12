import { Chart, type ReactGoogleChartEvent } from "react-google-charts";
import type { InfoLine } from "../api";

type Props = {
    dados?: InfoLine[] // estrutura em InfoLine (api.ts)
    carregando?: boolean
    erro?: string
    /** Ano que está filtrando o painel (período de 01/01 a 31/12). */
    anoAtivo?: number | null
    /** Clicar num ano chama aoSelecionarAno(ano); clicar de novo no mesmo ano chama com null. */
    aoSelecionarAno?: (ano: number | null) => void
}

const SERIES = [
    { campo: "aprovados", rotulo: "Aprovados", cor: "#00b040" },
    { campo: "reprovados", rotulo: "Reprovados", cor: "#b00000" },
    { campo: "interditados", rotulo: "Interditados", cor: "#dcab00" },
] as const

const formatar = (n: number) => n.toLocaleString("pt-BR")
const formatarPct = (n: number) => `${n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`

/** Texto do tooltip de um ponto: quantidade e percentual sobre o total do ano. */
function dica(item: InfoLine, rotulo: string, valor: number) {
    const pct = item.total ? (valor / item.total) * 100 : 0
    return `${item.ano}\n${rotulo}: ${formatar(valor)} (${formatarPct(pct)} de ${formatar(item.total)} periciadas)`
}

function Comparison({ dados = [], carregando = false, erro, anoAtivo = null, aoSelecionarAno }: Props) {
    const anos = dados.map((item) => item.ano)
    const titulo = anos.length ? `Evolução por ano (${anos[0]} – ${anos[anos.length - 1]})` : "Evolução por ano"

    // Cada série tem uma coluna de tooltip logo depois do valor.
    // A coluna de anotação logo depois do ano desenha uma linha vertical no ano ativo.
    const cabecalho = [
        "Ano",
        { role: "annotation", type: "string" },
        ...SERIES.flatMap((s) => [s.rotulo, { role: "tooltip", type: "string" }]),
    ]
    const data = [
        cabecalho,
        ...dados.map((item) => [
            String(item.ano), // eixo discreto: um rótulo por ano, sem casas decimais
            item.ano === anoAtivo ? "Filtrado" : null,
            ...SERIES.flatMap((s) => [item[s.campo], dica(item, s.rotulo, item[s.campo])]),
        ]),
    ]

    const options = {
        curveType: "none",
        legend: { position: "bottom" },
        colors: SERIES.map((s) => s.cor),
        pointSize: 6,
        lineWidth: 2,
        chartArea: { left: 60, right: 20, top: 20, bottom: 60 },
        vAxis: { title: "Bombas", format: "#,###", minValue: 0 },
        hAxis: { title: "Ano" },
        tooltip: { trigger: "focus" },
        annotations: { style: "line", stem: { color: "#FFC61A" }, textStyle: { color: "#094780", bold: true } },
        crosshair: { trigger: "both", orientation: "vertical", color: "#9ca3af" },
    }

    const eventos: ReactGoogleChartEvent[] = [
        {
            eventName: "select",
            callback: ({ chartWrapper }) => {
                const grafico = chartWrapper?.getChart()
                const [selecao] = grafico?.getSelection() ?? []
                // não deixa o ponto preso como selecionado (setSelection existe, mas falta na tipagem da lib)
                ;(grafico as unknown as { setSelection?: (s: unknown[]) => void } | undefined)?.setSelection?.([])
                if (!aoSelecionarAno || selecao?.row == null) return // clique na legenda: só liga/desliga a série
                const ano = dados[selecao.row]?.ano
                if (ano != null) aoSelecionarAno(ano === anoAtivo ? null : ano)
            },
        },
    ]

    return (
        <div className="mt-5 flex min-w-0 flex-col overflow-hidden rounded border border-gray-300 bg-[#FBFBFB]">
            <div className="bg-[#094780] p-2 text-center font-bold text-white">{titulo}</div>

            <div className="flex flex-wrap items-center justify-between gap-2 px-4 pt-3 text-xs text-gray-500">
                <span>
                    {aoSelecionarAno
                        ? "Clique num ponto para filtrar o painel pelo ano · clique na legenda para mostrar ou esconder uma linha"
                        : "Clique na legenda para mostrar ou esconder uma linha"}
                </span>
                {anoAtivo != null && aoSelecionarAno && (
                    <button
                        type="button"
                        onClick={() => aoSelecionarAno(null)}
                        className="rounded-full bg-[#FFC61A] px-3 py-1 font-semibold text-black hover:bg-[#e6b217]"
                    >
                        Ano {anoAtivo} ✕
                    </button>
                )}
            </div>

            {erro && <p className="px-4 pt-2 text-sm text-[#900603]">Não foi possível carregar a evolução por ano: {erro}</p>}

            {!erro && !carregando && dados.length === 0 ? (
                <p className="p-6 text-center text-sm text-gray-500">Sem verificações para os filtros atuais.</p>
            ) : (
                <div className={`transition-opacity ${carregando && dados.length ? "opacity-50" : ""}`}>
                    <Chart
                        chartType="LineChart"
                        width="100%"
                        height="360px"
                        data={data}
                        options={options}
                        chartEvents={eventos}
                        legendToggle
                        chartLanguage="pt-BR"
                        loader={<p className="p-6 text-center text-sm text-gray-500">Carregando gráfico…</p>}
                    />
                </div>
            )}
        </div>
    )
}

export default Comparison;
