const ARBITRARY_NUMBER = -1;

function checkOptions(i: number, sudoku: number[][]) {

}

function checkColisions(sudoku: number[][], position: {i:number, j:number}){
    return {
        colisionsHorizontal: sudoku[position.i].map( u => {
            return (u === sudoku[position.i][position.j]) ? {i:position.i, j:u} : null;
        }).filter(x => x),
        colisionsVertical: [sudoku[position.i].flatMap((e) => e.map( u => {
            return {i:position.i, j:u};
        }))],
        colisionsSquare: [sudoku[position.i].flatMap((e) => e.map( u => {
            return {i:position.i, j:u};
        }))]
    }
}


function getPositionsToFill(sudoku: number[][] ) {
    const posis = sudoku.map((x, i) => x.map((y, j) => {
        if (y===ARBITRARY_NUMBER){
            return {i:i, j:j};
        } else {
            return null;
        }
    })).flat().filter(v => v !== null);
    return posis;
}

export default function solver( sudoku: number[][] ) {
    if (sudoku.length !== 9 || sudoku[0].length !== 9) return null;
    let positionsToFill = getPositionsToFill(sudoku);


}


