import React, { useState } from "react";
import "./tablero.css";

const MiniSudoku = ({ datos }) => {
  const [valores, setValores] = useState(datos);

  const actualizarCelda = (index, nuevoValor) => {
    const nuevosValores = [...valores];
    nuevosValores[index] = nuevoValor;
    setValores(nuevosValores);
  };

  return (
    <div className="borde">
      <div className="m-sudoku">
        {valores.map((valor, i) => {
          const fila = Math.floor(i / 3);
          const columna = i % 3;
          const esOscuro = (fila + columna) % 2 === 0;

          return (
            <input
              key={i}
              type="text"
              maxLength={1}
              value={valor}
              onChange={(e) => actualizarCelda(i, e.target.value)}
              className={`celda-input ${esOscuro ? "oscuro" : "claro"}`}
            />
          );
        })}
      </div>

    </div>
  );
};

const Tablero = () => {
  const tableros = [
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
  ];

  return (
    <div className="tablero-sudoku">
      {tableros.map((datos, i) => (
        <MiniSudoku key={i} datos={datos} />
      ))}
    </div>
  );
};

export default Tablero;
