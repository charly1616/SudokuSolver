import React, { useState, useEffect } from "react";
import "./tablero.css";

const Tablero = ({ selectedNumber }) => {
  const samplePuzzle = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  const [grid, setGrid] = useState(
    samplePuzzle.map(row => row.map(val => val === 0 ? '' : val.toString()))
  );
  const [errorCells, setErrorCells] = useState([]);
  const [solverCells, setSolverCells] = useState(new Set());

  const updateCell = (rowIndex, colIndex, value) => {
    if (value === '' || /^[1-9]$/.test(value)) {
      setGrid(prevGrid => {
        const newGrid = prevGrid.map(row => [...row]);
        newGrid[rowIndex][colIndex] = value;
        return newGrid;
      });
      // Remove solver highlighting when user modifies a cell
      setSolverCells(prevSolverCells => {
        const newSolverCells = new Set(prevSolverCells);
        newSolverCells.delete(rowIndex * 9 + colIndex);
        return newSolverCells;
      });
    }
  };

  const findErrors = (currentGrid) => {
    const errors = new Set();

    // Check rows - if duplicate found, highlight entire row
    for (let row = 0; row < 9; row++) {
      const indexMap = {};
      let hasDuplicate = false;
      for (let col = 0; col < 9; col++) {
        const val = currentGrid[row][col];
        if (val !== '') {
          if (indexMap[val] !== undefined) {
            hasDuplicate = true;
          } else {
            indexMap[val] = col;
          }
        }
      }
      if (hasDuplicate) {
        for (let col = 0; col < 9; col++) {
          errors.add(row * 9 + col);
        }
      }
    }

    // Check columns - if duplicate found, highlight entire column
    for (let col = 0; col < 9; col++) {
      const indexMap = {};
      let hasDuplicate = false;
      for (let row = 0; row < 9; row++) {
        const val = currentGrid[row][col];
        if (val !== '') {
          if (indexMap[val] !== undefined) {
            hasDuplicate = true;
          } else {
            indexMap[val] = row;
          }
        }
      }
      if (hasDuplicate) {
        for (let row = 0; row < 9; row++) {
          errors.add(row * 9 + col);
        }
      }
    }

    // Check 3x3 boxes - if duplicate found, highlight entire box
    for (let boxRow = 0; boxRow < 9; boxRow += 3) {
      for (let boxCol = 0; boxCol < 9; boxCol += 3) {
        const indexMap = {};
        let hasDuplicate = false;
        for (let i = boxRow; i < boxRow + 3; i++) {
          for (let j = boxCol; j < boxCol + 3; j++) {
            const val = currentGrid[i][j];
            if (val !== '') {
              if (indexMap[val] !== undefined) {
                hasDuplicate = true;
              } else {
                indexMap[val] = [i, j];
              }
            }
          }
        }
        if (hasDuplicate) {
          for (let i = boxRow; i < boxRow + 3; i++) {
            for (let j = boxCol; j < boxCol + 3; j++) {
              errors.add(i * 9 + j);
            }
          }
        }
      }
    }

    setErrorCells(Array.from(errors));
  };

  const handleClearAll = () => {
    setGrid(
      samplePuzzle.map(row => row.map(val => val === 0 ? '' : val.toString()))
    );
    setErrorCells([]);
    setSolverCells(new Set());
  };

  const handleSolve = () => {
    const gridArray = grid.map(row => row.map(val => val === '' ? 0 : parseInt(val)));
    
    // Track which cells were empty before solving
    const cellsThatWereEmpty = new Set();
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (gridArray[row][col] === 0) {
          cellsThatWereEmpty.add(row * 9 + col);
        }
      }
    }
    
    const isValid = (board, row, col, num) => {
      // Check row
      for (let i = 0; i < 9; i++) {
        if (board[row][i] === num) return false;
      }
      
      // Check column
      for (let i = 0; i < 9; i++) {
        if (board[i][col] === num) return false;
      }
      
      // Check 3x3 box
      const boxRow = Math.floor(row / 3) * 3;
      const boxCol = Math.floor(col / 3) * 3;
      for (let i = boxRow; i < boxRow + 3; i++) {
        for (let j = boxCol; j < boxCol + 3; j++) {
          if (board[i][j] === num) return false;
        }
      }
      
      return true;
    };

    const solve = (board) => {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (board[row][col] === 0) {
            for (let num = 1; num <= 9; num++) {
              if (isValid(board, row, col, num)) {
                board[row][col] = num;
                if (solve(board)) return true;
                board[row][col] = 0;
              }
            }
            return false;
          }
        }
      }
      return true;
    };

    const solvedGrid = gridArray.map(row => [...row]);
    if (solve(solvedGrid)) {
      const newGrid = solvedGrid.map(row => row.map(val => val === 0 ? '' : val.toString()));
      setGrid(newGrid);
      setSolverCells(cellsThatWereEmpty);
      setErrorCells([]);
    } else {
      alert('No solution found for this puzzle');
    }
  };

  useEffect(() => {
    const clearListener = () => handleClearAll();
    const solveListener = () => handleSolve();

    window.addEventListener('clearAll', clearListener);
    window.addEventListener('solve', solveListener);

    return () => {
      window.removeEventListener('clearAll', clearListener);
      window.removeEventListener('solve', solveListener);
    };
  }, [grid]);

  // Validate grid whenever it changes
  useEffect(() => {
    findErrors(grid);
  }, [grid]);

  const handleCellClick = (rowIndex, colIndex) => {
    if (selectedNumber !== null && selectedNumber !== undefined) {
      updateCell(rowIndex, colIndex, selectedNumber.toString());
    } else if (selectedNumber === null) {
      // If no number is selected (delete mode), delete the cell
      updateCell(rowIndex, colIndex, '');
    }
  };

  const handleDelete = (rowIndex, colIndex) => {
    updateCell(rowIndex, colIndex, '');
  };

  return (
    <div className="tablero-sudoku">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: 'contents' }}>
          {row.map((valor, colIndex) => {
            const esOscuro = (rowIndex + colIndex) % 2 === 0;
            const globalIndex = rowIndex * 9 + colIndex;
            const isError = errorCells.includes(globalIndex);
            const isSolverCell = solverCells.has(globalIndex);
            const isThirdRow = (rowIndex + 1) % 3 === 0;

            return (
              <input
                key={`${rowIndex}-${colIndex}`}
                type="text"
                maxLength={1}
                value={valor}
                onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                onKeyDown={(e) => {
                  if (e.key === 'Backspace' || e.key === 'Delete') {
                    e.preventDefault();
                    handleDelete(rowIndex, colIndex);
                  }
                }}
                placeholder="·"
                className={`celda-input ${esOscuro ? "oscuro" : "claro"} ${isError ? "error" : ""} ${isSolverCell ? "solver" : ""} ${isThirdRow ? "third-row" : ""}`}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Tablero;
