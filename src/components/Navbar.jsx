import logoImg from "../assets/logo.png"

export default function Navbar({ activePage = "home" }) {
  return (
    <header className="bg-[#060F1F] text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1 sm:px-6">
        <a href="#/" aria-label="Go to home page">
          <img src={logoImg} alt="Sofia Nexus logo" className="h-12 w-12 object-contain sm:h-16 sm:w-16 md:h-20 md:w-20" />
        </a>

        <nav className="flex gap-3 text-sm font-medium sm:gap-5">
          <a href="#/" className={activePage === "home" ? "text-[#FF6B2C]" : "hover:text-[#FF6B2C]"}>Home</a>
          <a href="#/solutions" className={activePage === "solutions" ? "text-[#FF6B2C]" : "hover:text-[#FF6B2C]"}>Solutions</a>
          <a href="#/about" className={activePage === "about" ? "text-[#FF6B2C]" : "hover:text-[#FF6B2C]"}>About</a>
          <a href="#/contact" className={activePage === "contact" ? "text-[#FF6B2C]" : "hover:text-[#FF6B2C]"}>Contact</a>
        </nav>
      </div>
    </header>
  )
}