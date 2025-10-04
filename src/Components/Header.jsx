function Header() {
  return (
    <header className="header">
      <h1>
        Knight's Tour{' '}
        <img 
          src="/caballo_logo.png" 
          alt="Caballo logo" 
          className="header-logo"
          style={{ height: "1em", verticalAlign: "middle" }} 
        />
        </h1>
    </header>
  )
}

export default Header
