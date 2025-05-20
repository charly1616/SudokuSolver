const ARBITRARY_NUMBER = -1;

function checkOptions(i, sudoku) {

}


function checkColisions(sudoku){
    return sudoku.map( (e,i) => e.map((u,j) => {
        let v = checkColision(sudoku, {i:i, j:j})
        v = Object.entries(v).filter(([clave, valor]) => valor.length !== 0).flat().filter(x => typeof(x) === "object").map(v => JSON.stringify(v))
        if (Object.entries(v).every(([clave, valor]) => { return valor.length === 0 })){
            return null;
        } else {
            return v;
        }
    }))
}


function checkColision(sudoku, position){
    return {
        colHorizontal: sudoku[position.i].map( (u,l) => {
            return (u === sudoku[position.i][position.j]) ? {i:position.i, j:l} : null;
        }).filter(x => x && (x.i !== position.i || x.j !== position.j)),
        colVertical: sudoku.map( (e, k) => {
            return {i:k, j:position.j};
        }).filter( x => sudoku[x.i][x.j] === sudoku[position.i][position.j] && (x.i !== position.i || x.j !== position.j)),
        colsSquare: sudoku.flatMap( (fila, k) => {
            return fila.map( (_, l)=> {return {i:k, j:l}})
        }).filter( x => (x.i/3 == position.i/3) && (x.j/3 == position.j/3) &&
         (sudoku[x.i][x.j] === sudoku[position.i][position.j]) && (x.i !== position.i || x.j !== position.j))
    }
}

const sud = [
  [5, 3, 4, 6, 7, 8, 9, 5, 2],     // ❌ error en [0][7]: duplicado 5
  [6, 7, 2, 1, 6, 5, 3, 4, 8],     // ❌ error en [1][4]: duplicado 6
  [1, 9, 8, 3, 4, 8, 5, 6, 7],     // ❌ error en [2][5]: duplicado 8
  [8, 5, 9, 7, 6, 1, 4, 2, 3],     // ✅
  [4, 2, 6, 7, 5, 3, 7, 9, 1],     // ❌ error en [4][3] y [4][6]: duplicado 7
  [7, 1, 3, 9, 2, 4, 8, 5, 6],     // ✅
  [9, 6, 1, 5, 3, 7, 2, 8, 4],     // ✅
  [2, 8, 7, 4, 1, 9, 6, 3, 5],     // ✅
  [3, 5, 5, 2, 8, 6, 1, 7, 9]      // ❌ error en [8][1] y [8][2]: duplicado 5
];

console.log(checkColisions(sud));

function getPositionsToFill(sudoku) {
    const posis = sudoku.map((x, i) => x.map((y, j) => {
        if (y===ARBITRARY_NUMBER){
            return {i:i, j:j};
        } else {
            return null;
        }
    })).flat().filter(v => v !== null);
    return posis;
}

export default function solver( sudoku ) {
    if (sudoku.length !== 9 || sudoku[0].length !== 9) return null;
    let positionsToFill = getPositionsToFill(sudoku);


}