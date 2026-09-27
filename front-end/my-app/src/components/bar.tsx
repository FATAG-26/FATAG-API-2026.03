// bar.tsx
type RankingItem = {
  municipio: string
  valor: number
}

type BarProps = {
  dados: RankingItem[]
}

function Bar({ dados }: BarProps) {
    /* calculo matematico mirabolante */
  const maior = Math.max(...dados.map((item) => item.valor), 1)

  return (
    <div className="painel p-4">
      <div className="border border-white painel-titulo bg-[#1E1E1E] text-white px-4 py-1 font-semibold">
        Ranking por Município/Região
      </div>

      <div className="painel-conteudo bg-white p-4">
        {dados.map((item) => {
          const largura = (item.valor / maior) * 100

          return (
            <div key={item.municipio} className="flex items-center mb-2">
              <div className="w-40 text-xs pr-2 truncate">
                {item.municipio}
              </div>
              <div className="flex-1 bg-gray-100 h-5 relative">
                <div
                  className="bg-[#1E3A5F] h-5"
                  style={{ width: `${largura}%` }}
                />
              </div>
            </div>
          )
        })}

        {/* Escala de 0% a 100% */}
        <div className="flex justify-between text-xs text-gray-500 mt-2 pl-40">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  )
}

export default Bar