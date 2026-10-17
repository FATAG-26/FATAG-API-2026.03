import './App.css'
import Header from './components/header'
import Bar from './components/bar'
import Table from './components/table'
import Stats from './components/stats'
import { buscarRanking } from './api'
import { useDados, useFiltros } from './hooks'

function App() {
  // Um único conjunto de filtros alimenta a tabela, os gráficos e o ranking.
  // Sem filtros preenchidos, todos mostram os dados gerais.
  const { entrada, aplicados, alterar, limpar } = useFiltros()

  const ranking = useDados(
    (signal) => buscarRanking(aplicados, signal),
    `ranking:${JSON.stringify(aplicados)}`,
  )

  return (
    <div className="min-h-screen bg-[#ADB9CA]">
      <Header />
      <Table entrada={entrada} filtros={aplicados} alterar={alterar} limpar={limpar} />
      <Stats filtros={aplicados} />
      <Bar dados={ranking.dados?.itens ?? []} carregando={ranking.carregando} erro={ranking.erro} />
    </div>
  )
}

export default App
