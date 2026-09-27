import './App.css'
import Header from './components/header'
import Table from './components/table'
import Stats from './components/stats'

function App() {

  return (

    <div className="min-h-screen bg-[#ADB9CA]">
      <Header />
      <Table />
      <Stats/>
    </div>
  )
}

export default App