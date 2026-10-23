import { useMemo } from 'react'
import './App.css'
import Header from './components/header'
import Bar from './components/bar'
import Table from './components/table'
import Stats from './components/stats'
import { bombas } from './components/table'
import MapaVale from './components/mapaVale'
import Comparison from './components/comparison'

function App() {

  const ranking = useMemo(() => {
    const contagem: Record<string, number> = {}

    bombas.forEach((bomba) => {
      if (bomba.resultado === 'APROVADO') {
        contagem[bomba.municipio] = (contagem[bomba.municipio] || 0) + 1
      }
    })

    return Object.entries(contagem)
      .map(([municipio, valor]) => ({ municipio, valor }))
      .sort((a, b) => b.valor - a.valor)
  }, [])

  return (
    <div className="min-h-screen bg-[#ADB9CA]">
      <Header />
      <Table />
      <Stats />
      <Bar dados={ranking} />
      <Comparison />
        <div style={{ minHeight: 500, padding: 10, margin:18, background: "#fff" }}>
          <h2>Mapa do Vale do Paraíba</h2>
          <MapaVale />
        </div>
    </div>
  )
}

export default App