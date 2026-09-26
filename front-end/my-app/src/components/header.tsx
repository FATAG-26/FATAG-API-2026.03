
import logo from '../assets/CDIPEM_logo.png';

function Header() {
  return (
 <header className="bg-[#00275a] text-white px-6 flex items-center justify-between h-12">
      <h1 className="text-lg font-bold">
        Consulta de bombas - Dashboard
      </h1>

      <img 
        src={logo} 
        alt="Logótipo" 
        className="h-15 w-auto object-contain p-2" 
      />
      
    </header>
  )
}

export default Header
