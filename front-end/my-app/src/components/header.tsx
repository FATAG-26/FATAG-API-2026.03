
function Header() {
  return (
    <header className="bg-[#00275a] text-white p-1 flex justify-between items-center">
      <h1 className="font-mono text-lg font-bold">
        Consulta de bombas - Dashboard
      </h1>

      <img 
        src="/logo.png" 
        alt="Logótipo" 
        className="h-10 w-auto object-contain" 
      />
      
    </header>
  )
}

export default Header
