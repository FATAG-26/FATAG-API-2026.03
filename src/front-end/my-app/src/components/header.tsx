
import { useRef } from 'react'
import type { Filtros, ItemRanking } from '../api'
import logo from '../assets/CDIPEM_logo.png'
import Dropdown from './dropdown'
import PDFCreator from './pdfCreator'
import Report from './report'

type HeaderProps = {
  filtros: Filtros
  ranking: ItemRanking[]
  alvo?: string
  rankingCarregando: boolean
  rankingErro?: string
}

function Header({ filtros, ranking, alvo, rankingCarregando, rankingErro }: HeaderProps) {
  const pdfRef = useRef<HTMLDivElement>(null)

  return (
    <header className="flex w-full min-w-0 flex-wrap items-center justify-between gap-2 bg-[#ADB9CA] px-3 py-2 text-white sm:px-6">
      <img
        src={logo}
        alt="Logótipo"
        className="h-10 w-auto shrink-0 object-contain"
      />

      <Dropdown
        acao={<PDFCreator pdfRef={pdfRef} disabled={rankingCarregando} />}
        filtros={filtros}
      />

      <div ref={pdfRef} className="pdfOnly">
        <Report
          filtros={filtros}
          ranking={ranking}
          alvo={alvo}
          rankingCarregando={rankingCarregando}
          rankingErro={rankingErro}
        />
      </div>
    </header>
  )
}

export default Header
