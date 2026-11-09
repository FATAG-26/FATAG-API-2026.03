import { useEffect, useState } from 'react'
import { listarBairros, listarMunicipios, type CampoFiltroTexto, type Filtros } from '../api'
import { useDados } from '../hooks'

type FiltroProps = {
    entrada: Filtros
    alterar: (campo: CampoFiltroTexto, valor: string) => void
    limpar: () => void
}

const RESULTADOS = ['Aprovado', 'Reprovado', 'Interditado', 'Excluído', 'Sem Verificação']
const classesCampo = 'w-full min-w-0 rounded border border-gray-300 bg-white px-3 py-2'

function Filtro({ entrada, alterar, limpar }: FiltroProps) {
    const [aberto, setAberto] = useState(false)
    const municipios = useDados((signal) => listarMunicipios(signal), 'municipios')
    const bairros = useDados(
        (signal) => listarBairros(entrada.municipio, signal),
        `bairros:${entrada.municipio}`,
    )

    useEffect(() => {
        if (!aberto) return

        function fecharComEscape(evento: KeyboardEvent) {
            if (evento.key === 'Escape') setAberto(false)
        }

        document.addEventListener('keydown', fecharComEscape)
        return () => document.removeEventListener('keydown', fecharComEscape)
    }, [aberto])

    return (
        <>
            <button
                type="button"
                aria-label="Abrir filtros"
                aria-expanded={aberto}
                aria-controls="painel-filtros"
                onClick={() => setAberto(true)}
                className="fixed bottom-1/2 left-0 rounded-r-lg bg-[#FFC61A] p-2 shadow-md"
            >
                <span className="block">F</span><span className="block">I</span><span className="block">L</span>
                <span className="block">T</span><span className="block">R</span><span className="block">O</span><span className="block">S</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true" className="mx-auto size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
                </svg>
            </button>

            {aberto && (
                <div
                    className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
                    onMouseDown={(evento) => {
                        if (evento.target === evento.currentTarget) setAberto(false)
                    }}
                >
                    <section
                        id="painel-filtros"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Filtros"
                        className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-xl border border-gray-200 bg-[#FFC61A] p-4 shadow-xl sm:p-6"
                    >
                        <div className="mb-4 flex justify-end">
                            <button type="button" aria-label="Fechar filtros" onClick={() => setAberto(false)} className="rounded p-2 hover:bg-black/10">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <label className="flex min-w-0 flex-col gap-1 font-medium text-left">
                                Município:
                                <input type="text" list="lista-municipios-modal" value={entrada.municipio} onChange={(e) => alterar('municipio', e.target.value)} className={classesCampo} />
                                <datalist id="lista-municipios-modal">
                                    {municipios.dados?.map((municipio) => <option key={municipio} value={municipio} />)}
                                </datalist>
                            </label>
                            <label className="flex min-w-0 flex-col gap-1 font-medium text-left">
                                Bairro:
                                <input type="text" list="lista-bairros-modal" value={entrada.bairro} onChange={(e) => alterar('bairro', e.target.value)} className={classesCampo} />
                                <datalist id="lista-bairros-modal">
                                    {bairros.dados?.map((bairro) => <option key={bairro} value={bairro} />)}
                                </datalist>
                            </label>
                            <label className="flex min-w-0 flex-col gap-1 font-medium text-left">
                                Proprietário:
                                <input type="text" value={entrada.proprietario} onChange={(e) => alterar('proprietario', e.target.value)} className={classesCampo} />
                            </label>
                            <label className="flex min-w-0 flex-col gap-1 font-medium text-left">
                                Resultado:
                                <select value={entrada.resultado} onChange={(e) => alterar('resultado', e.target.value)} className={classesCampo}>
                                    <option value="">Todos os resultados</option>
                                    {RESULTADOS.map((resultado) => <option key={resultado} value={resultado}>{resultado}</option>)}
                                </select>
                            </label>
                            <label className="flex min-w-0 flex-col gap-1 font-medium text-left">
                                De:
                                <input type="date" value={entrada.dataInicio} onChange={(e) => alterar('dataInicio', e.target.value)} className={`${classesCampo} [color-scheme:light]`} />
                            </label>
                            <label className="flex min-w-0 flex-col gap-1 font-medium text-left">
                                Até:
                                <input type="date" value={entrada.dataFim} onChange={(e) => alterar('dataFim', e.target.value)} className={`${classesCampo} [color-scheme:light]`} />
                            </label>
                        </div>

                        <div className="mt-4 flex justify-end">
                            <button type="button" onClick={limpar} className="rounded-lg bg-[#094780] px-4 py-2 font-semibold text-white hover:bg-[#073967]">
                                Limpar Filtros
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </>
    )
}

export default Filtro
