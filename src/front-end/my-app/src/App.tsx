import './App.css'
import './pdfCss.css'
import Header from './components/header'
import Bar from './components/bar'
import Table from './components/table'
import Stats from './components/stats'
import MapaVale from './components/mapaVale'
import { buscarRanking, puxarLineChart } from './api'
import { useDados, useFiltros } from './hooks'
import Comparison from './components/comparison'

function App() {
  const { entrada, aplicados, alterar, alterarMunicipios, limpar } = useFiltros()
  const ranking = useDados(
    (signal) => buscarRanking(aplicados, signal),
    `ranking:${JSON.stringify(aplicados)}`,
  )

  const compara = useDados(
    (sinal) => puxarLineChart(aplicados, sinal), `bombas/por-ano:${JSON.stringify(aplicados)}`
  )

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
        <Table entrada={entrada} filtros={aplicados} alterar={alterar} limpar={limpar} />
        <Stats filtros={aplicados} />
        <Bar dados={ranking.dados?.itens ?? []} alvo={ranking.dados?.alvo} carregando={ranking.carregando} erro={ranking.erro} />
        <Comparison dados={compara.dados} />
        <section className="flex min-w-0 flex-col overflow-hidden rounded border border-gray-300 bg-white mt-5 mb-2">
          <div className="bg-[#094780] p-2 text-center font-bold text-white">
            Mapa do Vale do Paraíba
          </div>
          <MapaVale municipios={entrada.municipios} aoAlterar={alterarMunicipios} />
        </section>
      </div>
    </div>
  </>
}

export default App
