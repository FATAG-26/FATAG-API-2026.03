import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import Header from './components/header'
import Bar from './components/bar'
import Table from './components/table'
import Stats from './components/stats'
import type { Bomba, Filtros } from './components/table'

const POR_PAGINA = 50

// Monta a rota com os filtros preenchidos + a página pedida
function montarRota(filtros: Filtros, offset: number) {
  const params = new URLSearchParams({ limite: String(POR_PAGINA), offset: String(offset) })
  if (filtros.municipio.trim()) params.set('municipio', filtros.municipio)
  if (filtros.bairro.trim()) params.set('bairro', filtros.bairro)
  if (filtros.dataInicio || filtros.dataFim) {
    params.set('modo', 'I') // intervalo (a mesma data nos dois campos = um dia só)
    if (filtros.dataInicio) params.set('data_inicio', filtros.dataInicio)
    if (filtros.dataFim) params.set('data_fim', filtros.dataFim)
  }
  return `/api/bombas?${params}`
}

function App() {

  const [bombas, setBombas] = useState<Bomba[]>([])
  const [filtros, setFiltros] = useState<Filtros>({
    municipio: '',
    bairro: '',
    dataInicio: '',
    dataFim: '',
  })

  // total de registros que batem com os filtros 
  const [total, setTotal] = useState(0)
  // filtros usados nos dados que estão na tela, e a busca da próxima página em andamento
  const filtrosDosDados = useRef(filtros)
  const buscandoMais = useRef<AbortController | null>(null)

    // Mudou um filtro: volta para a 1ª página
  useEffect(() => {
    const controller = new AbortController()

    const timer = setTimeout(() => {
      buscandoMais.current?.abort() // descarta a "próxima página" do filtro antigo
      buscandoMais.current = null

      fetch(montarRota(filtros, 0), { signal: controller.signal })
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          return res.json()
        })
        .then(data => {
          filtrosDosDados.current = filtros
          setBombas(data.registros)
          setTotal(data.total)
        })
        .catch(erro => {
          if (!controller.signal.aborted) console.error(erro)
        })
    }, 300)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [filtros])

    // Chegou perto do fim do scroll: busca a próxima página e acrescenta
  const carregarMais = () => {
    if (buscandoMais.current) return // já tem uma em andamento
    if (bombas.length >= total) return // não tem mais nada
    if (filtros !== filtrosDosDados.current) return // filtro mudou, a 1ª página está a caminho

    const controller = new AbortController()
    buscandoMais.current = controller
    const offset = bombas.length

    fetch(montarRota(filtrosDosDados.current, offset), { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(data => {
        // só acrescenta se a lista ainda termina onde pedimos (evita duplicar página)
        setBombas(atual => (atual.length === offset ? [...atual, ...data.registros] : atual))
      })
      .catch(erro => {
        if (!controller.signal.aborted) console.error(erro)
      })
      .finally(() => {
        if (buscandoMais.current === controller) buscandoMais.current = null
      })
  }

  const ranking = useMemo(() => {
  const contagem: Record<string, number> = {}

    bombas.forEach((bomba) => {
      if (bomba.RESULTADO === 'Aprovado') {
        contagem[bomba.MUNICIPIO] = (contagem[bomba.MUNICIPIO] || 0) + 1
      }
    })

    return Object.entries(contagem)
      .map(([municipio, valor]) => ({ municipio, valor }))
      .sort((a, b) => b.valor - a.valor)
  }, [])


  return (
    <div className="min-h-screen bg-[#ADB9CA]">
      <Header />
             <Table
         dados={bombas}
        total={total}
         filtros={filtros}
        onCarregarMais={carregarMais}
         onFiltrosChange={(parcial) => setFiltros((atual) => ({ ...atual, ...parcial }))}
       />
      <Stats />
      <Bar dados={ranking} />
    </div>
  )
}

export default App