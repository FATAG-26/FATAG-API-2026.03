import type { RefObject } from 'react'
import { useReactToPrint } from 'react-to-print'

type PDFCreatorProps = {
  pdfRef: RefObject<HTMLDivElement | null>
}

function PDFCreator({ pdfRef }: PDFCreatorProps) {
  const handlePrint = useReactToPrint({
    contentRef: pdfRef,
  })

  return (
    <button onClick={handlePrint} className="m-2 rounded-lg bg-gray-600 px-5 py-2 font-semibold text-white shadow hover:bg-gray-800">
      Imprimir Informações
    </button>
  )
}

export default PDFCreator