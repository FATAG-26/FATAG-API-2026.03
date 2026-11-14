import { useState } from 'react'
import { Chart } from 'react-google-charts'
import { buscarResumo, listarMunicipios, normalizarNome, type Filtros, type Resumo } from '../api'
import { useDados } from '../hooks'

type Props = {
    /** Filtros aplicados na tela. Município e resultado são ignorados: quem escolhe as cidades é este painel. */
    filtros: Filtros
}

// Categorias comparadas (mesmas chaves do gráfico de periciados em stats.tsx).
const CATEGORIAS = [
    { chave: 'Aprovado', rotulo: 'Aprovados' },
    { chave: 'Reprovado', rotulo: 'Reprovados' },
    { chave: 'Interditado', rotulo: 'Interditados' },
] as const

const COR_A = '#094780'
const COR_B = '#07c064'

const formatar = (n: number) => n.toLocaleString('pt-BR')
const formatarPct = (n: number) =>
    `${n.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`

const escapar = (t: string) =>
    t.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c)

type Linha = { cidade: string; cor: string; resumo?: Resumo }

function dica(rotulo: string, chave: string, linhas: Linha[]) {
    const itens = linhas
        .map(({ cidade, cor, resumo }) => {
            const total = resumo?.total ?? 0
            const qtd = resumo?.porResultado[chave] ?? 0
            const pct = total ? (qtd / total) * 100 : 0
            return `<div style="display:flex;align-items:center;gap:6px;margin-top:3px">
                <span style="width:10px;height:10px;border-radius:50%;background:${cor};flex:none"></span>
                <span><b>${escapar(cidade)}</b>: ${formatarPct(pct)} (${formatar(qtd)} de ${formatar(total)})</span>
            </div>`
        })
        .join('')
    return `<div style="padding:8px 10px;font:13px system-ui,sans-serif;white-space:nowrap">
        <div style="font-weight:700">${rotulo}</div>${itens}
    </div>`
}

type CampoProps = {
    cor: string
    rotulo: string
    cidade: string 
    opcoes: string[]
    idLista: string
    total?: number
    aoEscolher: (cidade: string) => void
}

function CampoCidade({ cor, rotulo, cidade, opcoes, idLista, total, aoEscolher }: CampoProps) {
    // Enquanto digita, o texto é livre; só vira cidade quando bate com um nome da lista.
    const [texto, setTexto] = useState<string | null>(null)

    const digitar = (valor: string) => {
        setTexto(valor)
        const alvo = normalizarNome(valor)
        const achada = opcoes.find((m) => normalizarNome(m) === alvo)
        if (achada) aoEscolher(achada)
    }

    return (
        <label className="flex min-w-0 flex-col gap-1 text-left font-medium">
            {rotulo}
            <span className="flex items-center gap-2">
                <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: cor }} aria-hidden="true" />
                <input
                    type="text"
                    list={idLista}
                    value={texto ?? cidade}
                    onChange={(e) => digitar(e.target.value)}
                    onFocus={(e) => e.target.select()}
                    onBlur={() => setTexto(null)} // nome inválido: volta para a última cidade válida
                    className="w-full min-w-0 rounded border border-gray-300 bg-white px-3 py-2 font-normal"
                />
            </span>
            <datalist id={idLista}>
                {opcoes.map((m) => <option key={m} value={m} />)}
            </datalist>
            <span className="pl-5 text-xs font-normal text-gray-500">
                {total == null ? '…' : `${formatar(total)} bombas periciadas`}
            </span>
        </label>
    )
}

function ComparacaoCidades({ filtros }: Props) {
    const municipios = useDados((signal) => listarMunicipios(signal), 'municipios')
    const lista = municipios.dados ?? []

    // Enquanto a pessoa não escolhe, usa as duas primeiras cidades da lista.
    const [escolhaA, setEscolhaA] = useState<string | null>(null)
    const [escolhaB, setEscolhaB] = useState<string | null>(null)
    const cidadeA = escolhaA ?? lista[0] ?? ''
    const cidadeB = escolhaB ?? lista[1] ?? ''

    const base: Filtros = { ...filtros, resultado: '', municipio: '', municipios: [] }
    const chaveBase = JSON.stringify(base)

    const a = useDados(
        (signal) => cidadeA ? buscarResumo({ ...base, municipio: cidadeA }, signal) : Promise.resolve(undefined),
        `comparacao-a:${cidadeA}:${chaveBase}`,
    )
    const b = useDados(
        (signal) => cidadeB ? buscarResumo({ ...base, municipio: cidadeB }, signal) : Promise.resolve(undefined),
        `comparacao-b:${cidadeB}:${chaveBase}`,
    )

    const carregando = municipios.carregando || a.carregando || b.carregando
    const erro = municipios.erro ?? a.erro ?? b.erro
    const temDados = Boolean(a.dados || b.dados)

    const pct = (r: Resumo | undefined, chave: string) => (r?.total ? ((r.porResultado[chave] ?? 0) / r.total) * 100 : 0)

    const linhas: Linha[] = [
        { cidade: cidadeA, cor: COR_A, resumo: a.dados },
        { cidade: cidadeB, cor: COR_B, resumo: b.dados },
    ]

    const tooltip = { role: 'tooltip', type: 'string', p: { html: true } }
    const data = [
        ['Resultado', cidadeA || 'Cidade 1', tooltip, cidadeB || 'Cidade 2', tooltip],
        ...CATEGORIAS.map((c) => {
            const html = dica(c.rotulo, c.chave, linhas)
            return [c.rotulo, pct(a.dados, c.chave), html, pct(b.dados, c.chave), html]
        }),
    ]

    const options = {
        colors: [COR_A, COR_B],
        legend: { position: 'none' }, 
        chartArea: { left: 50, right: 20, top: 15, bottom: 35 },
        vAxis: { title: '% das bombas', format: "#'%'", minValue: 0 },
        bar: { groupWidth: '70%' },
        tooltip: { isHtml: true, trigger: 'focus' },
        animation: { duration: 0 },
    }

    return (
        <div className="flex min-w-0 flex-col overflow-hidden rounded border border-gray-300 bg-[#FBFBFB]">
            <div className="bg-[#094780] p-2 text-center font-bold text-white">Comparação entre Cidades</div>

            <div className="p-4">
                <p className="mb-3 text-left text-xs text-gray-500">
                    % de bombas aprovadas, reprovadas e interditadas em cada cidade
                    {' · '}passe o mouse numa coluna para ver as duas cidades
                </p>

                <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <CampoCidade
                        cor={COR_A}
                        rotulo="Município 1:"
                        cidade={cidadeA}
                        opcoes={lista.filter((m) => m !== cidadeB)}
                        idLista="lista-comparacao-a"
                        total={a.dados?.total}
                        aoEscolher={setEscolhaA}
                    />
                    <CampoCidade
                        cor={COR_B}
                        rotulo="Município 2:"
                        cidade={cidadeB}
                        opcoes={lista.filter((m) => m !== cidadeA)}
                        idLista="lista-comparacao-b"
                        total={b.dados?.total}
                        aoEscolher={setEscolhaB}
                    />
                </div>

                {erro && <p className="mb-2 text-sm text-[#900603]">Não foi possível carregar a comparação: {erro}</p>}

                {!erro && !carregando && !temDados ? (
                    <p className="p-6 text-center text-sm text-gray-500">Sem verificações para os filtros atuais.</p>
                ) : (
                    <div className={`transition-opacity ${carregando && temDados ? 'opacity-50' : ''}`}>
                        <Chart
                            chartType="ColumnChart"
                            width="100%"
                            height="240px"
                            data={data}
                            options={options}
                            chartLanguage="pt-BR"
                            loader={<p className="p-6 text-center text-sm text-gray-500">Carregando gráfico…</p>}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default ComparacaoCidades