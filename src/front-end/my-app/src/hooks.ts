import { useEffect, useEffectEvent, useState } from 'react'
import { FILTROS_VAZIOS, type Filtros } from './api'

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

  const alterar = (campo: keyof Filtros, valor: string) =>
    setEntrada((atual) => ({ ...atual, [campo]: valor }))

  const limpar = () => {
    setEntrada(FILTROS_VAZIOS)
    setAplicados(FILTROS_VAZIOS)
  }

  return { entrada, aplicados, alterar, limpar }
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
      .then((dados) => setEstado({ chave, dados }))
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
