import { useState } from 'react'
import './App.css'
import Tablero from "./Components/tablero.jsx"

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Tablero />
    </>
  )
}

export default App
