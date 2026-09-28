import { useMemo } from 'react'
import './App.css'
import Header from './components/header'
import Bar from './components/bar'
import Table from './components/table'
import Stats from './components/stats'
import { bombas } from './components/table'

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
    </div>
  )
}

export default App