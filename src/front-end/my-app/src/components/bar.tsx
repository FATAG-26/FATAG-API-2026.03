import type { ItemRanking } from '../api'

type BarProps = {
  dados: ItemRanking[] // valor = % de bombas aprovadas no município (0–100)
  carregando?: boolean
  erro?: string
}

function Bar({ dados, carregando = false, erro }: BarProps) {
  return (
    <div className="painel pt-4 pb-4">
      <div className="border-t border-b border-white rounded painel-titulo bg-[#1E1E1E] text-white px-4 py-1 font-semibold">
        Ranking por Município/Região
      </div>

      <div className={`painel-conteudo bg-white p-4 transition-opacity ${carregando && dados.length > 0 ? 'opacity-50' : ''}`}>
        <p className="mb-3 text-left text-xs text-gray-500">
          % de bombas aprovadas por município (mínimo de 20 bombas)
        </p>

        {erro && <p className="mb-2 text-sm text-[#900603]">Não foi possível carregar o ranking: {erro}</p>}

        {!erro && !carregando && dados.length === 0 && (
          <p className="mb-2 text-sm text-gray-500">
            Nenhum município com 20 bombas ou mais para os filtros atuais.
          </p>
        )}

        {dados.map((item) => {
          // A escala vai de 0% a 100%, então a largura é o próprio percentual.
          const largura = Math.min(Math.max(item.valor, 0), 100)

          return (
            <div key={item.municipio} className="flex items-center mb-2">
              <div className="w-40 text-xs pr-2 truncate" title={item.municipio}>
                {item.municipio}
              </div>
              <div className="flex-1 bg-gray-100 h-5 relative">
                <div className="bg-[#1E3A5F] h-5" style={{ width: `${largura}%` }} />
              </div>
              <div className="w-14 pl-2 text-xs text-right">
                {item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%
              </div>
            </div>
          )
        })}

        {/* Escala de 0% a 100% */}
        <div className="flex justify-between text-xs text-gray-500 mt-2 pl-40 pr-14">
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
