import { useEffect, useEffectEvent, useState } from 'react'
import { FILTROS_VAZIOS, normalizarNome, type CampoFiltroTexto, type Filtros } from './api'

/**
 * Estado único dos filtros, compartilhado por tabela, gráficos e ranking.
 * `entrada` acompanha a digitação; `aplicados` só muda depois de uma pausa,
 * para não chamar a API a cada tecla.
 */
export function useFiltros(atrasoMs = 400) {
  const [entrada, setEntrada] = useState<Filtros>(FILTROS_VAZIOS)
  const [aplicados, setAplicados] = useState<Filtros>(FILTROS_VAZIOS)

  useEffect(() => {
    const t = setTimeout(() => setAplicados(entrada), atrasoMs)
    return () => clearTimeout(t)
  }, [entrada, atrasoMs])

  const alterar = (campo: CampoFiltroTexto, valor: string) =>
    setEntrada((atual) => campo === 'municipio'
      ? { ...atual, municipio: valor, municipios: [] }
      : { ...atual, [campo]: valor })

  const alterarMunicipios = (municipios: string[]) =>
    setEntrada((atual) => ({ ...atual, municipio: '', municipios }))

  /** Liga ou desliga um município (ranking e mapa usam o mesmo estado). */
  const alternarMunicipio = (nome: string) =>
    setEntrada((atual) => {
      const lista = atual.municipios.length ? atual.municipios : atual.municipio.trim() ? [atual.municipio.trim()] : []
      const chave = normalizarNome(nome)
      const existe = lista.some((m) => normalizarNome(m) === chave)
      return {
        ...atual,
        municipio: '',
        municipios: existe ? lista.filter((m) => normalizarNome(m) !== chave) : [...lista, nome],
      }
    })

  const definirPeriodo = (dataInicio: string, dataFim: string) =>
    setEntrada((atual) => ({ ...atual, dataInicio, dataFim }))

  const limpar = () => {
    setEntrada(FILTROS_VAZIOS)
    setAplicados(FILTROS_VAZIOS)
  }

  return { entrada, aplicados, alterar, alterarMunicipios, alternarMunicipio, definirPeriodo, limpar }
}

/**
 * Busca dados na API sempre que `chave` muda, cancelando a requisição anterior.
 * Enquanto a nova resposta não chega, `dados` mantém o valor anterior
 * (a tela não pisca) e `carregando` fica true.
 */
export function useDados<T>(carregar: (signal: AbortSignal) => Promise<T>, chave: string) {
  const [estado, setEstado] = useState<{ chave: string; dados?: T; erro?: string } | null>(null)
  const executar = useEffectEvent(carregar)

  useEffect(() => {
    const controle = new AbortController()
    executar(controle.signal)
      .then((dados) => { if (!controle.signal.aborted) {setEstado({ chave, dados })}})
      .catch((e: unknown) => {
        if (controle.signal.aborted) return
        setEstado((anterior) => ({
          chave,
          dados: anterior?.dados,
          erro: e instanceof Error ? e.message : 'Erro desconhecido',
        }))
      })
    return () => controle.abort()
  }, [chave])

  return {
    dados: estado?.dados,
    carregando: estado?.chave !== chave,
    erro: estado?.chave === chave ? estado.erro : undefined,
  }
}
