import { useMemo, useState } from 'react'
import './App.css'

const bombas = [
  {
    municipio: 'VOLTA REDONDA',
    bairro: 'CONFORTO',
    proprietario: 'POSTO CONFORMO DE V.R. LTDA',
    inmetro: '40028922',
    verificado: '06/07/25',
    resultado: 'APROVADO',
  },
  {
    municipio: 'BOM JESUS DO ITANHAEM',
    bairro: 'CENTRO',
    proprietario: 'POSTO CURSOS ONLINE LTDA',
    inmetro: '1234512',
    verificado: '06/07/25',
    resultado: 'APROVADO',
  },
  {
    municipio: 'PIRAÍ',
    bairro: 'CASA AMARELA',
    proprietario: 'POSTO COMBUSTIVEL PIRAÍ LTDA',
    inmetro: '657849',
    verificado: '06/07/25',
    resultado: 'NEGADO',
  },
  {
    municipio: 'SÃO GONÇALO',
    bairro: 'NEVES',
    proprietario: 'CARREFOUR COMERCIO E INDUSTRIA',
    inmetro: '67686768',
    verificado: '06/07/25',
    resultado: 'INTERDITADO',
  },
]

function App() {
  const [municipio, setMunicipio] = useState('')
  const [bairro, setBairro] = useState('')
  const [data, setData] = useState('')

  const bombasFiltradas = useMemo(() => {
    return bombas.filter((bomba) => {
      return (
        bomba.municipio.toLowerCase().includes(municipio.toLowerCase()) &&
        bomba.bairro.toLowerCase().includes(bairro.toLowerCase()) &&
        bomba.verificado.includes(data)
      )
    })
  }, [municipio, bairro, data])

  return (
    <div className="grid-cols-4">
      <h2 className="!text-[#1E1E1E]">
        Tabela de Bombas em SP (com as cidades do Rio)
      </h2>

      <div className="flex justify-center">
        <div className="w-[1100px]">
          <table className="w-full table-fixed border-collapse border border-white">
            <thead>
              <tr>
                <th className="border border-white bg-[#1E1E1E] px-4 py-2 text-white">
                  Município
                </th>
                <th className="border border-white bg-[#1E1E1E] px-4 py-2 text-white">
                  Bairro
                </th>
                <th className="border border-white bg-[#1E1E1E] px-4 py-2 text-white">
                  Proprietário
                </th>
                <th className="border border-white bg-[#1E1E1E] px-4 py-2 text-white">
                  Inmetro
                </th>
                <th className="border border-white bg-[#1E1E1E] px-4 py-2 text-white">
                  Verificado
                </th>
                <th className="border border-white bg-[#1E1E1E] px-4 py-2 text-white">
                  Resultado
                </th>
              </tr>
            </thead>

            <tbody>
              {bombasFiltradas.map((bomba) => (
                <tr key={bomba.inmetro}>
                  <td className="border border-white px-4 py-2">
                    {bomba.municipio}
                  </td>
                  <td className="border border-white px-4 py-2">
                    {bomba.bairro}
                  </td>
                  <td className="border border-white px-4 py-2">
                    {bomba.proprietario}
                  </td>
                  <td className="border border-white px-4 py-2">
                    {bomba.inmetro}
                  </td>
                  <td className="border border-white px-4 py-2">
                    {bomba.verificado}
                  </td>
                  <td
                    className={`border border-white px-4 py-2 ${bomba.resultado === 'APROVADO'
                        ? 'text-[#008000]'
                        : bomba.resultado === 'NEGADO'
                          ? 'text-[#900603]'
                          : 'text-[#FDED00]'
                      }`}
                  >
                    {bomba.resultado}
                  </td>
                </tr>
              ))}

              {bombasFiltradas.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="border border-white px-4 py-2 text-center"
                  >
                    Nenhum resultado encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex flex-wrap gap-3 border border-t-0 border-white bg-[#1E1E1E] px-4 py-3">
            <input
              type="text"
              value={municipio}
              onChange={(event) => setMunicipio(event.target.value)}
              placeholder="Buscar por município"
              className="border border-white bg-transparent px-3 py-2 text-white/80 placeholder:text-white/60 focus:outline-none"
            />

            <input
              type="text"
              value={bairro}
              onChange={(event) => setBairro(event.target.value)}
              placeholder="Buscar por bairro"
              className="border border-white bg-transparent px-3 py-2 text-white/80 placeholder:text-white/60 focus:outline-none"
            />

            <input
              type="text"
              value={data}
              onChange={(event) => setData(event.target.value)}
              placeholder="Buscar por data: 06/07/25"
              className="border border-white bg-transparent px-3 py-2 text-white/80 placeholder:text-white/60 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App