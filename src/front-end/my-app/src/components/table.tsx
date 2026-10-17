export type Filtros = {
  municipio: string
  bairro: string
  dataInicio: string 
  dataFim: string
}

export type Bomba = {
  MUNICIPIO: string
  BAIRRO: string | null
  PROPRIETARIO: string
  NUMERO_INMETRO: string
  DATA_VERIFICACAO: string
  RESULTADO: string
}


function Table({
  dados,
  filtros,
  onFiltrosChange
}: {
  dados: Bomba[]
  filtros: Filtros
  onFiltrosChange: (parcial: Partial<Filtros>) => void
}) {

    return (



        <div className="grid-cols-4">
            <h2 className="mx-auto max-w-full px-3 text-center !text-[#1E1E1E] text-xl leading-tight sm:text-2xl">
                Tabela de Bombas em SP 
            </h2>

            <div className="w-full min-w-0">
                <div className="w-full overflow-x-auto">
                    <table className="w-full min-w-[900px] table-fixed border-collapse border border-white">
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
                            {dados.slice(0, 20).map((bomba, index) => (
                                    <tr key={`${bomba.NUMERO_INMETRO}-${index}`}>
                                    <td className="border border-gray-300 bg-white px-4 py-2">
                                        {bomba.MUNICIPIO}
                                    </td>
                                    <td className="border border-gray-300 bg-white px-4 py-2">
                                        {bomba.BAIRRO}
                                    </td>
                                    <td className="border border-gray-300 bg-white px-4 py-2">
                                        {bomba.PROPRIETARIO}
                                    </td>
                                    <td className="border border-gray-300 bg-white px-4 py-2">
                                        {bomba.NUMERO_INMETRO}
                                    </td>
                                    <td className="border border-gray-300 bg-white px-4 py-2">
                                        {bomba.DATA_VERIFICACAO?.slice(0, 10).split('-').reverse().join('/')}
                                    </td>
                                    <td
                                        className={`border border-gray-300 bg-white px-4 py-2 ${bomba.RESULTADO === 'Aprovado'
                                            ? 'text-[#008000]'
                                            : bomba.RESULTADO === 'Reprovado'
                                                ? 'text-[#900603]'
                                                : 'text-[#FDED00]'
                                            }`}
                                    >
                                        {bomba.RESULTADO}
                                    </td>
                                </tr>
                            ))}

                            {dados.length === 0 && (
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
                </div> 
                
                    <div className="flex flex-wrap gap-3 border border-t-0 border-white bg-[#333333] px-4 py-3">
                                                <input
                            type="text"
                            value={filtros.municipio}
                            onChange={(e) => onFiltrosChange({ municipio: e.target.value })}
                            placeholder="Buscar por município"
                            className="border border-white bg-transparent px-3 py-2 text-white/80 placeholder:text-white/60 focus:outline-none"
                        />

                        <input
                            type="text"
                            value={filtros.bairro}
                            onChange={(e) => onFiltrosChange({ bairro: e.target.value })}
                            placeholder="Buscar por bairro"
                            className="border border-white bg-transparent px-3 py-2 text-white/80 placeholder:text-white/60 focus:outline-none"
                        />

                        <label className="flex items-center gap-2 text-white/80">
                            De
                            <input
                                type="date"
                                value={filtros.dataInicio}
                                onChange={(e) => onFiltrosChange({ dataInicio: e.target.value })}
                                className="border border-white bg-transparent px-3 py-2 text-white/80 [color-scheme:dark] focus:outline-none"
                            />
                        </label>

                        <label className="flex items-center gap-2 text-white/80">
                            Até
                            <input
                                type="date"
                                value={filtros.dataFim}
                                onChange={(e) => onFiltrosChange({ dataFim: e.target.value })}
                                className="border border-white bg-transparent px-3 py-2 text-white/80 [color-scheme:dark] focus:outline-none"
                            />
                        </label>
                    </div>
                </div>
            </div>
    )
}

export default Table