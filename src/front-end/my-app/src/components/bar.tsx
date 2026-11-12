import { normalizarNome, type ItemRanking } from '../api'

type BarProps = {
  dados: ItemRanking[] // valor = % de bombas com o resultado `alvo` no município (0–100)
  alvo?: string
  carregando?: boolean
  erro?: string
  /** Municípios selecionados no painel (os mesmos do mapa). */
  selecionados?: string[]
  /** Sem `aoClicar` (ex.: no relatório em PDF) o ranking fica só para leitura. */
  aoClicar?: (municipio: string) => void
}

const formatarPct = (n: number) =>
  `${n.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`

function Bar({ dados, alvo = 'Aprovado', carregando = false, erro, selecionados = [], aoClicar }: BarProps) {
  const rotulo = alvo.toLowerCase()
  const marcados = new Set(selecionados.map(normalizarNome))
  const algumMarcado = dados.some((item) => marcados.has(normalizarNome(item.municipio)))

  return (
    <div className="flex min-w-0 flex-col overflow-hidden rounded border border-gray-300 bg-[#FBFBFB]">
      <div className="bg-[#094780] p-2 text-center font-bold text-white">
        Ranking por Município
      </div>

      <div className={`painel-conteudo bg-[#FBFBFB] p-4 transition-opacity ${carregando && dados.length > 0 ? 'opacity-50' : ''}`}>
        <p className="mb-3 text-left text-xs text-gray-500">
          % de bombas com resultado "{rotulo}" por município (mínimo de 20 bombas)
          {aoClicar && ' · clique numa barra para filtrar pelo município'}
        </p>

        {erro && <p className="mb-2 text-sm text-[#900603]">Não foi possível carregar o ranking: {erro}</p>}

        {!erro && !carregando && dados.length === 0 && (
          <p className="mb-2 text-sm text-gray-500">
            Nenhum município com 20 bombas ou mais para os filtros atuais.
          </p>
        )}

        {dados.map((item, posicao) => {
          // A escala vai de 0% a 100%, então a largura é o próprio percentual.
          const largura = Math.min(Math.max(item.valor, 0), 100)
          const marcado = marcados.has(normalizarNome(item.municipio))
          const dica = `${posicao + 1}º ${item.municipio}: ${formatarPct(item.valor)} de bombas com resultado "${rotulo}"`

          const linha = (
            <>
              <div className="w-40 truncate pr-2 text-xs" title={item.municipio}>
                {posicao + 1}º {item.municipio}
              </div>
              <div className="relative h-5 flex-1 bg-gray-100">
                <div
                  className={`h-5 transition-[width,background-color] duration-300 ${marcado ? 'bg-[#FFC61A]' : 'bg-[#1E3A5F] group-hover:bg-[#2f5a8f]'}`}
                  style={{ width: `${largura}%` }}
                />
              </div>
              <div className="w-14 pl-2 text-right text-xs">{formatarPct(item.valor)}</div>
            </>
          )

          return aoClicar ? (
            <button
              key={item.municipio}
              type="button"
              title={`${dica}. ${marcado ? 'Clique para remover o filtro.' : 'Clique para filtrar.'}`}
              aria-pressed={marcado}
              onClick={() => aoClicar(item.municipio)}
              className={`group mb-2 flex w-full items-center rounded text-left transition-opacity hover:bg-gray-200 ${algumMarcado && !marcado ? 'opacity-50' : ''} ${marcado ? 'font-semibold' : ''}`}
            >
              {linha}
            </button>
          ) : (
            <div key={item.municipio} className="mb-2 flex items-center" title={dica}>
              {linha}
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
