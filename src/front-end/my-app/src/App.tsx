import './App.css'
import './pdfCss.css'
import Header from './components/header'
import Bar from './components/bar'
import Table from './components/table'
import Stats from './components/stats'
import MapaVale from './components/mapaVale'
import { anoSelecionado, buscarPericiacoesPorMunicipio, buscarRanking, periodoDoAno, puxarLineChart } from './api'
import { useDados, useFiltros } from './hooks'
import Comparison from './components/comparison'
import Filtro from './components/filtro'
import FiltrosAtivos from './components/filtrosAtivos'
import ComparacaoCidades from './components/comparacaoCidades'

function App() {
  const { entrada, aplicados, alterar, alterarMunicipios, alternarMunicipio, definirPeriodo, limpar } = useFiltros()
  const ranking = useDados(
    (signal) => buscarRanking(aplicados, signal),
    `ranking:${JSON.stringify(aplicados)}`,
  )

  const compara = useDados(
    (sinal) => puxarLineChart(aplicados, sinal), `bombas/por-ano:${JSON.stringify(aplicados)}`
  )

  // O filtro do município selecionado não deve esconder as contagens dos demais
  // municípios; datas, resultado e outros filtros continuam valendo no mapa.
  const filtrosMapa = { ...aplicados, municipio: '', municipios: [] }
  const mapa = useDados(
    (signal) => buscarPericiacoesPorMunicipio(filtrosMapa, signal),
    `periciacoes/por-municipio:${JSON.stringify(filtrosMapa)}`,
  )

  // Clicar num ano do gráfico de linhas filtra o painel por aquele ano inteiro.
  const selecionarAno = (ano: number | null) => {
    if (ano == null) return definirPeriodo('', '')
    const { inicio, fim } = periodoDoAno(ano)
    definirPeriodo(inicio, fim)
  }

  const municipiosSelecionados = entrada.municipios.length
    ? entrada.municipios
    : entrada.municipio.trim() ? [entrada.municipio.trim()] : []

  return <>
    <div className="min-h-screen bg-[#ffffff]">
      <Header
        filtros={aplicados}
        ranking={ranking.dados?.itens ?? []}
        alvo={ranking.dados?.alvo}
        rankingCarregando={ranking.carregando}
        rankingErro={ranking.erro}
      />
      <div className="container mx-auto xl:px-30 md:w-full sm:w-full">
        <FiltrosAtivos
          filtros={entrada}
          alterar={alterar}
          alternarMunicipio={alternarMunicipio}
          definirPeriodo={definirPeriodo}
          limpar={limpar}
        />
        <Table filtros={aplicados} />
        <Stats filtros={aplicados} alterar={alterar} selecionado={entrada.resultado} />
        <div className="grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-2">
          <Bar
            dados={ranking.dados?.itens ?? []}
            alvo={ranking.dados?.alvo}
            carregando={ranking.carregando}
            erro={ranking.erro}
            selecionados={municipiosSelecionados}
            aoClicar={alternarMunicipio}
          />
          <ComparacaoCidades filtros={aplicados} />
        </div>
        <Comparison
          dados={compara.dados}
          carregando={compara.carregando}
          erro={compara.erro}
          anoAtivo={anoSelecionado(entrada)}
          aoSelecionarAno={selecionarAno}
        />
        <section className="flex min-w-0 flex-col overflow-hidden rounded border border-gray-300 bg-white mt-5 mb-2">
          <div className="bg-[#094780] p-2 text-center font-bold text-white">
            Mapa do Vale do Paraíba
          </div>
          <MapaVale
            municipios={municipiosSelecionados}
            dados={mapa.dados ?? []}
            carregando={mapa.carregando}
            erro={mapa.erro}
            aoAlterar={alterarMunicipios}
          />
        </section>
      </div>
    </div>
    <Filtro entrada={entrada} alterar={alterar} limpar={limpar} />
  </>
}

export default App
