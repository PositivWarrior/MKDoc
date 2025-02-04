const Header = () => {
  return (
    <header className="bg-white py-4 shadow-sm sticky top-0 z-50 w-full">
      <div className="w-full mx-auto px-4 flex justify-between items-center h-12 md:px-8">
        <h1 className="m-0 text-2xl font-semibold text-slate-800 whitespace-nowrap">
          LukMeg Verdivurdering
        </h1>
        <div className="flex flex-col items-end gap-4 sm:flex-row sm:gap-8">
          <a href="tel:+4799854333" className="text-slate-500 no-underline text-sm transition-colors hover:text-blue-600 whitespace-nowrap">
            +47 998 54 333
          </a>
          <a href="mailto:lukmegnorge@gmail.com" className="text-slate-500 no-underline text-sm transition-colors hover:text-blue-600 whitespace-nowrap">
            lukmegnorge@gmail.com
          </a>
        </div>
      </div>
    </header>
  )
}

export default Header 