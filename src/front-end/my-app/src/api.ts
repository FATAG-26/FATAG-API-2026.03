// Camada de acesso à API (backend-node). O Vite encaminha /api -> backend:8000
// (ver vite.config.ts), então aqui só usamos caminhos relativos.

export type Filtros = {
  municipio: string
  municipios: string[]
  bairro: string
  proprietario: string
  resultado: string
  dataInicio: string // aaaa-mm-dd (valor do <input type="date">)
  dataFim: string
}

/** Compara nomes sem diferenciar maiúsculas e acentos ("São José" = "SAO JOSE"). */
export const normalizarNome = (valor: string) =>
  valor.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLocaleUpperCase('pt-BR')

export type CampoFiltroTexto = Exclude<keyof Filtros, 'municipios'>

export const FILTROS_VAZIOS: Filtros = {
  municipio: '',
  municipios: [],
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
  DATA_VERIFICACAO: string | null // dd-mm-aaaa (formatado no backend)
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
    ['bairro', f.bairro],
    ['proprietario', f.proprietario],
    ['resultado', f.resultado],
  ]
  const municipios = f.municipios.length ? f.municipios : f.municipio.trim() ? [f.municipio.trim()] : []
  for (const municipio of municipios) p.append('municipio', municipio)
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


export async function buscarTodasBombas(f: Filtros): Promise<Bomba[]> {
    const primeiraPagina = await buscarBombas(f, 0)
    const todas = [...primeiraPagina.itens]
    const total = primeiraPagina.total
    for (
        let offset = todas.length;
        offset < total;
        offset += TAMANHO_PAGINA
    ) {
        const pagina = await buscarBombas(f, offset)

        if (pagina.itens.length === 0) break
        todas.push(...pagina.itens)
    }
    return todas
}


export const buscarResumo = (f: Filtros, signal?: AbortSignal) =>
  pegar<Resumo>('resumo', montarQuery(f), signal)

/** Ranking por município (gerarGrafico(df, resultado, "percentual")). */
export const buscarRanking = (f: Filtros, signal?: AbortSignal) =>
  pegar<Ranking>(
    'ranking',
    montarQuery(f, { tipo: 'percentual', alvo: f.resultado.trim() || 'Aprovado', limite: 5 }),
    signal,
  )

export const listarMunicipios = (signal?: AbortSignal) => pegar<string[]>('municipios', '', signal)

export const listarBairros = (municipio: string, signal?: AbortSignal) =>
  municipio.trim()
    ? pegar<string[]>('bairros', new URLSearchParams({ municipio }).toString(), signal)
    : Promise.resolve([] as string[])


export type InfoLine = { ano: number; total: number; aprovados: number; reprovados: number; interditados: number }

/**
 * Contagem por ano com os mesmos filtros da tela. O filtro de resultado é ignorado,
 * porque o gráfico já mostra aprovados, reprovados e interditados lado a lado.
 * Quando o período é um ano escolhido no próprio gráfico, ele também é ignorado,
 * para o gráfico continuar mostrando todos os anos (senão sobraria um ponto só).
 */
export const puxarLineChart = (f: Filtros, signal?: AbortSignal) => {
  const semAno = anoSelecionado(f) != null ? { dataInicio: '', dataFim: '' } : {}
  return pegar<InfoLine[]>('bombas/por-ano', montarQuery({ ...f, resultado: '', ...semAno }), signal)
}

/** Período que cobre o ano inteiro, no formato dos campos de data (aaaa-mm-dd). */
export const periodoDoAno = (ano: number) => ({ inicio: `${ano}-01-01`, fim: `${ano}-12-31` })

/** Ano selecionado quando o período dos filtros é exatamente um ano inteiro. */
export function anoSelecionado(f: Filtros): number | null {
  const ano = Number(f.dataInicio.slice(0, 4))
  if (!ano) return null
  const { inicio, fim } = periodoDoAno(ano)
  return f.dataInicio === inicio && f.dataFim === fim ? ano : null
}