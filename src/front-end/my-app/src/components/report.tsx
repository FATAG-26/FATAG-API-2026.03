import type { CampoFiltroTexto, Filtros, ItemRanking } from '../api'
import Stats from './stats'
import Bar from './bar'

type ReportProps = {
  filtros: Filtros
  ranking: ItemRanking[]
  alvo?: string
  rankingCarregando: boolean
  rankingErro?: string
}

const nomes: [CampoFiltroTexto, string][] = [
  ['municipio', 'Município'], ['bairro', 'Bairro'], ['proprietario', 'Proprietário'], ['resultado', 'Resultado'],
]
const dataBR = (data: string) => data ? data.split('-').reverse().join('/') : ''

function Report({ filtros, ranking, alvo, rankingCarregando, rankingErro }: ReportProps) {
  const ativos = nomes.filter(([campo]) => filtros[campo].trim()).map(([campo, rotulo]) => `${rotulo}: ${filtros[campo].trim()}`)
  if (filtros.municipios.length) ativos.unshift(`Municípios: ${filtros.municipios.join(', ')}`)
  if (filtros.dataInicio || filtros.dataFim) ativos.push(`Período: ${filtros.dataInicio ? dataBR(filtros.dataInicio) : 'início'} a ${filtros.dataFim ? dataBR(filtros.dataFim) : 'hoje'}`)

  return (
    <article className="report-document">
      <header className="report-heading">
        <p className="report-kicker">Relatório de fiscalização</p>
        <h1>Verificações de bombas</h1>
        <p>Emitido em {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date())}</p>
      </header>

      <section className="report-filters">
        <h2>Critérios da consulta</h2>
        {ativos.length ? <ul>{ativos.map((filtro) => <li key={filtro}>{filtro}</li>)}</ul> : <p>Sem filtros — todos os registros.</p>}
      </section>

      <section className="report-section">
        <h2>Resumo dos resultados</h2>
        <Stats filtros={filtros} />
      </section>

      <section className="report-section">
        <h2>Ranking por município</h2>
        <p className="report-note">Percentual de “{alvo || 'Aprovado'}” entre municípios com pelo menos 20 bombas.</p>
        <Bar dados={ranking} alvo={alvo} carregando={rankingCarregando} erro={rankingErro} />
      </section>

    </article>
  )
}

export default Report
