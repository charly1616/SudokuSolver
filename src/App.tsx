import {useState} from "react";
import Botones from "./botones.tsx";

function App() {
  const [count, setCount] = useState(0);

  return (
    <section className="main-content ">
      <Botones />
    </section>
    
  )
}

export default App
