import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './Components/header'
import ChessBoard from './Components/ChessBoard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Header />   
      <main>
        <div className="card">
          <ChessBoard />
        </div>
      </main>
    </div>
  )
}

export default App
