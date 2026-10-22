// Camada de acesso à API (backend-node). O Vite encaminha /api -> backend:8000
// (ver vite.config.ts), então aqui só usamos caminhos relativos.

export type Filtros = {
  municipio: string
  bairro: string
  proprietario: string
  resultado: string
  dataInicio: string // aaaa-mm-dd (vem do <input type="date">)
  dataFim: string
}

export const FILTROS_VAZIOS: Filtros = {
  municipio: '',
  bairro: '',
  proprietario: '',
  resultado: '',
  dataInicio: '',
  dataFim: '',
}

export type Bomba = {
  MUNICIPIO: string | null
  BAIRRO: string | null
  PROPRIETARIO: string | null
  DESCRICAO: string | null
  NUMERO_INMETRO: string | null
  NUMERO_SERIE: string | null
  DATA_VERIFICACAO: string | null // dd/mm/aaaa
  RESULTADO: string | null
}

export type PaginaBombas = { total: number; itens: Bomba[] }

export type Resumo = {
  total: number
  porResultado: Record<string, number>
  percentuais: { aprovado: number; reprovado: number; interditado: number }
}

export type ItemRanking = { municipio: string; valor: number }
export type Ranking = { tipo: 'percentual' | 'absoluto'; alvo: string; itens: ItemRanking[] }

/** Só envia os filtros preenchidos; datas sempre em modo intervalo ('I'). */
function montarQuery(f: Filtros, extra: Record<string, string | number> = {}) {
  const p = new URLSearchParams()
  const texto: [string, string][] = [
    ['municipio', f.municipio],
    ['bairro', f.bairro],
    ['proprietario', f.proprietario],
    ['resultado', f.resultado],
  ]
  for (const [nome, valor] of texto) if (valor.trim()) p.set(nome, valor.trim())
  if (f.dataInicio || f.dataFim) {
    if (f.dataInicio) p.set('data_inicio', f.dataInicio)
    if (f.dataFim) p.set('data_fim', f.dataFim)
    p.set('modo', 'I')
  }
  for (const [nome, valor] of Object.entries(extra)) p.set(nome, String(valor))
  return p.toString()
}

async function pegar<T>(caminho: string, query: string, signal?: AbortSignal): Promise<T> {
  const resposta = await fetch(`/api/${caminho}${query ? `?${query}` : ''}`, { signal })
  if (!resposta.ok) {
    const corpo = await resposta.json().catch(() => null)
    throw new Error(corpo?.erro ?? `Erro ${resposta.status} ao consultar a API`)
  }
  return resposta.json() as Promise<T>
}

export const TAMANHO_PAGINA = 50

export const buscarBombas = (f: Filtros, offset: number, signal?: AbortSignal) =>
  pegar<PaginaBombas>('bombas', montarQuery(f, { limit: TAMANHO_PAGINA, offset }), signal)

export const buscarResumo = (f: Filtros, signal?: AbortSignal) =>
  pegar<Resumo>('resumo', montarQuery(f), signal)

/** Ranking por município (gerarGrafico(df, resultado, "percentual")). */
export const buscarRanking = (f: Filtros, signal?: AbortSignal) =>
  pegar<Ranking>(
    'ranking',
    montarQuery(f, { tipo: 'percentual', alvo: f.resultado.trim() || 'Aprovado', limite: 5 }),
    signal,
  )

export type Percentuais = Resumo['percentuais']

/** Percentuais gerais (aprovado/reprovado/interditado), ignorando o filtro de resultado, para não confundir */
export const buscarPercentuais = (f: Filtros, signal?: AbortSignal) =>
  pegar<Percentuais>(
    'percentuais/aprovado-reprovado',
    montarQuery({ ...f, resultado: '' }),
    signal,
  )

export const listarMunicipios = (signal?: AbortSignal) => pegar<string[]>('municipios', '', signal)

export const listarBairros = (municipio: string, signal?: AbortSignal) =>
  municipio.trim()
    ? pegar<string[]>('bairros', new URLSearchParams({ municipio }).toString(), signal)
    : Promise.resolve([] as string[])
