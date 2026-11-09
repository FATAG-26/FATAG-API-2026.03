
import type { ReactNode } from 'react'
import logo from '../assets/CDIPEM_logo.png';

type HeaderProps = { acao?: ReactNode }

function Header({ acao }: HeaderProps) {
  return (

 <header className="flex w-full min-w-0 flex-wrap items-center justify-between gap-2 bg-[#ADB9CA] px-3 py-2 text-white sm:px-6">

      <img
        src={logo}
        alt="Logótipo"
        className="h-10 w-auto shrink-0 object-contain"
      />
  
      {acao}

    </header>
  )
}

export default Header
