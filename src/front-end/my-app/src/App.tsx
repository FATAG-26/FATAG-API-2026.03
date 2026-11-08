import './App.css'
import './pdfCss.css'
import Header from './components/header'
import Bar from './components/bar'
import Table from './components/table'
import Stats from './components/stats'
import MapaVale from './components/mapaVale'
import { buscarRanking, puxarLineChart } from './api'
import { useDados, useFiltros } from './hooks'
import { useRef } from 'react'
import Comparison from './components/comparison'
import PDFCreator from './components/pdfCreator'
import Report from './components/report'

function App() {
  const { entrada, aplicados, alterar, alterarMunicipios, limpar } = useFiltros()
  const ranking = useDados(
    (signal) => buscarRanking(aplicados, signal),
    `ranking:${JSON.stringify(aplicados)}`,
  )

  const compara = useDados(
    (sinal) => puxarLineChart(aplicados,sinal),`bombas/por-ano:${JSON.stringify(aplicados)}`
  )

  const pdfRef = useRef<HTMLDivElement>(null)

  return <>
    <div className="min-h-screen bg-[#ADB9CA]">
      <Header acao={<PDFCreator pdfRef={pdfRef} disabled={ranking.carregando} />} />
      <Table entrada={entrada} filtros={aplicados} alterar={alterar} limpar={limpar} />
      <Stats filtros={aplicados} />
      <Bar dados={ranking.dados?.itens ?? []} alvo={ranking.dados?.alvo} carregando={ranking.carregando} erro={ranking.erro} />
      <Comparison dados={compara.dados} />
      <section className="mx-4 my-5 rounded-lg bg-white p-4 shadow-sm sm:mx-6 sm:p-5">
        <h2 className="mb-2 text-center text-lg font-semibold text-[#1E1E1E] sm:text-xl">
          Mapa do Vale do Paraíba
        </h2>
        <MapaVale municipios={entrada.municipios} aoAlterar={alterarMunicipios} />
      </section>
    </div>
    <div ref={pdfRef} className="pdfOnly">
      <Report filtros={aplicados} ranking={ranking.dados?.itens ?? []} alvo={ranking.dados?.alvo} rankingCarregando={ranking.carregando} rankingErro={ranking.erro} />
    </div>
  </>
}

export default App
