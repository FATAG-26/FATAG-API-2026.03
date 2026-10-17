
import logo from '../assets/CDIPEM_logo.png';

function Header() {
  return (

 <header className="flex w-full min-w-0 flex-wrap items-center justify-between gap-2 border-b border-white bg-[#00275a] px-3 py-2 text-white sm:px-6">

      <h1 className="m-0 min-w-0 flex-1 text-left text-base font-bold leading-tight sm:text-lg">
        Consulta de bombas - Dashboard
      </h1>

      <img
        src={logo}
        alt="Logótipo"
        className="h-14 w-auto shrink-0 object-contain sm:h-16"
      />

    </header>
  )
}

export default Header