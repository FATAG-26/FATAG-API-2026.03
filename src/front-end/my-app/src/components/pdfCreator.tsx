import type { RefObject } from 'react'
import { useReactToPrint } from 'react-to-print'

type PDFCreatorProps = {
  pdfRef: RefObject<HTMLDivElement | null>
  disabled?: boolean
}

function PDFCreator({ pdfRef, disabled = false }: PDFCreatorProps) {
  const handlePrint = useReactToPrint({
    contentRef: pdfRef,
    documentTitle: 'Relatorio-de-verificacoes-de-bombas',
  })

  return (
    <button type="button" onClick={handlePrint} disabled={disabled} className="rounded-lg bg-white px-4 py-2 font-semibold text-[#00275a] shadow hover:bg-blue-50 disabled:cursor-wait disabled:opacity-60">
      {disabled ? 'Preparando relatório…' : 'Gerar Relatório'}
    </button>
  )
}

export default PDFCreator
