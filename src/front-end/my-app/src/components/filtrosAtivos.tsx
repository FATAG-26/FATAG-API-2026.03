import { anoSelecionado, type CampoFiltroTexto, type Filtros } from '../api'

type FiltrosAtivosProps = {
    filtros: Filtros
    alterar: (campo: CampoFiltroTexto, valor: string) => void
    alternarMunicipio: (municipio: string) => void
    definirPeriodo: (dataInicio: string, dataFim: string) => void
    limpar: () => void
}

const dataBR = (data: string) => data.split('-').reverse().join('/')

/**
 * Mostra, acima do painel, os filtros aplicados (inclusive os que vieram de cliques
 * nos gráficos e no mapa), cada um com um botão para removê-lo.
 */
function FiltrosAtivos({ filtros, alterar, alternarMunicipio, definirPeriodo, limpar }: FiltrosAtivosProps) {
    const itens: { chave: string; rotulo: string; remover: () => void }[] = []

    const municipios = filtros.municipios.length ? filtros.municipios : filtros.municipio.trim() ? [filtros.municipio.trim()] : []
    for (const municipio of municipios) {
        itens.push({
            chave: `municipio:${municipio}`,
            rotulo: `Município: ${municipio}`,
            remover: () => (filtros.municipios.length ? alternarMunicipio(municipio) : alterar('municipio', '')),
        })
    }

    const textos: [CampoFiltroTexto, string][] = [['bairro', 'Bairro'], ['proprietario', 'Proprietário'], ['resultado', 'Resultado']]
    for (const [campo, nome] of textos) {
        const valor = filtros[campo].trim()
        if (valor) itens.push({ chave: campo, rotulo: `${nome}: ${valor}`, remover: () => alterar(campo, '') })
    }

    if (filtros.dataInicio || filtros.dataFim) {
        const ano = anoSelecionado(filtros)
        const rotulo = ano != null
            ? `Ano: ${ano}`
            : `Período: ${filtros.dataInicio ? dataBR(filtros.dataInicio) : 'início'} a ${filtros.dataFim ? dataBR(filtros.dataFim) : 'hoje'}`
        itens.push({ chave: 'periodo', rotulo, remover: () => definirPeriodo('', '') })
    }

    if (!itens.length) return null

    return (
        <div className="mt-4 flex flex-wrap items-center gap-2 rounded border border-gray-300 bg-[#FBFBFB] p-3 text-sm" aria-live="polite">
            <span className="font-semibold text-gray-700">Filtros ativos:</span>
            {itens.map((item) => (
                <button
                    key={item.chave}
                    type="button"
                    onClick={item.remover}
                    title="Remover este filtro"
                    className="flex items-center gap-1 rounded-full bg-[#FFC61A] px-3 py-1 text-black hover:bg-[#e6b217]"
                >
                    {item.rotulo}
                    <span aria-hidden="true" className="font-bold">✕</span>
                    <span className="sr-only">(remover)</span>
                </button>
            ))}
            <button type="button" onClick={limpar} className="ml-auto text-sm font-semibold text-[#094780] underline hover:text-[#073967]">
                Limpar todos
            </button>
        </div>
    )
}

export default FiltrosAtivos
