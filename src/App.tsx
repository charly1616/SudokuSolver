import { useState } from 'react'
import './App.css'
import Tablero from "./Components/tablero.jsx"
import Botones from "./botones.tsx"

function App() {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);

  const handleClearAll = () => {
    // This will be implemented in tablero component
    window.dispatchEvent(new CustomEvent('clearAll'));
  };

  const handleSolve = () => {
    // This will be implemented in tablero component
    window.dispatchEvent(new CustomEvent('solve'));
  };

  return (
    <div className="app-container">
      <h1 className="title">SUDOKU SOLVER</h1>
      <div className="main-content">
        <div className="grid-and-buttons">
          <Tablero selectedNumber={selectedNumber} />
        </div>
        <div className="controls">
          <Botones selectedNumber={selectedNumber} onSelectNumber={setSelectedNumber} />
          <div style={{ width: '100%' }}>
            <button className="btn-clear" onClick={handleClearAll}>Clear</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
