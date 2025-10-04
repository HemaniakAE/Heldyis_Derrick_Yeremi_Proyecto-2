import React from 'react'
import './App.css'
import Header from './Components/header'
import ChessBoard from './Components/ChessBoard'
import StatsBoard from './Components/StatsBoard'

function App() {
  return (
    <div className="App">
      <Header />
      <div className="main-layout">
        <div className="center-area">
          <div className="card">
            <ChessBoard />
          </div>
        </div>
        <div className="right-area">
          <StatsBoard />
        </div>
      </div>
    </div>
  )
}

export default App
