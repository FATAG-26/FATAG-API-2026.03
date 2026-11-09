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
      {disabled ? 'Preparando relatório…' : ''}
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
      PDF
    </button>
  )
}

export default PDFCreator
