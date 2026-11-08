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
  const { entrada, aplicados, alterar, limpar } = useFiltros()
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
      <div style={{ minHeight: 500, padding: 10, margin: 18, background: "#fff" }}>
        <h2>Mapa do Vale do Paraíba</h2>
        <MapaVale />
      </div>
    </div>
    <div ref={pdfRef} className="pdfOnly">
      <Report filtros={aplicados} ranking={ranking.dados?.itens ?? []} alvo={ranking.dados?.alvo} rankingCarregando={ranking.carregando} rankingErro={ranking.erro} />
    </div>
  </>
}

export default App
