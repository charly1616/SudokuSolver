const ARBITRARY_NUMBER = -1;

function checkOptions(i, sudoku) {

}


function checkColisions(sudoku){
    return sudoku.map( (e,i) => e.map((u,j) => {
        let v = checkColision(sudoku, {i:i, j:j})
        
        v = Object.entries(v).filter(([clave, valor]) => valor.length !== 0).flat().filter(x => typeof(x) !== "string").map(g => g[0])//.flat().filter(x => typeof(x) === "object").map(v => JSON.stringify(v))
        if (Object.entries(v).every(([clave, valor]) => { return valor.length === 0 })){
            return [];
        } else {
            //console.log("Objetos")
            //console.log(v.flat())
            //console.log("========")
            return v.flat();
        }
    }))
}


function checkColision(sudoku, position) {
    const value = sudoku[position.i][position.j];

    return {
        colHorizontal: sudoku[position.i]
            .map((u, j) => (u === value && j !== position.j ? { i: position.i, j } : null))
            .filter(x => x),

        colVertical: sudoku
            .map((row, i) => (row[position.j] === value && i !== position.i ? { i, j: position.j } : null))
            .filter(x => x),

        colsSquare: (() => {
            const res = [];
            const boxRowStart = Math.floor(position.i / 3) * 3;
            const boxColStart = Math.floor(position.j / 3) * 3;

            for (let i = boxRowStart; i < boxRowStart + 3; i++) {
                for (let j = boxColStart; j < boxColStart + 3; j++) {
                    if (i === position.i && j === position.j) continue;
                    if (sudoku[i][j] === value) {
                        res.push({ i, j });
                    }
                }
            }

            return res;
        })()
    };
}

const sud = [
  [5, 3, -1, -1, 7, -1, -1, -1, -1],
  [6, -1, -1, 1, 9, 5, -1, -1, -1],
  [-1, 9, 8, -1, -1, -1, -1, 6, -1],
  [8, -1, -1, -1, 6, -1, -1, -1, 3],
  [4, -1, -1, 8, -1, 3, -1, -1, 1],
  [7, -1, -1, -1, 2, -1, -1, -1, 6],
  [-1, 6, -1, -1, -1, -1, 2, 8, -1],
  [-1, -1, -1, 4, 1, 9, -1, -1, 5],
  [-1, -1, -1, -1, 8, -1, -1, 7, 9]
];

//console.log(checkColisions(sud));

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


function getPosibleValues(sudoku, position){
    let values = [true, true, true,true, true, true, true, true, true]

    //Discard horizontal
    sudoku[position.i].forEach(e => {
        if (e === -1) return;
        values[e-1] = false
    });


    //Discard vertical
    sudoku.forEach( (e,i) => {
        let u = e[position.j]
        if (u === -1) return;
        values[u-1] = false
    });


    let boxRowStart = Math.floor(position.i / 3) * 3;
    let boxColStart = Math.floor(position.j / 3) * 3;

    for (let i = boxRowStart; i < boxRowStart + 3; i++) {
        for (let j = boxColStart; j < boxColStart + 3; j++) {
            let val = sudoku[i][j];
            if (val === -1) continue;
            values[val - 1] = false;
        }
    }


    return values.map( (e,i) => (e)? (i+1) : null).filter(x => x)
}

// console.log(getPosibleValues(sud, {i:2,j:2}))

//console.log(getPositionsToFill(sud))

// position: {i, j}
// value: número que se coloca en esa celda
// posibleVals: Array de forma [[{i, j}, [números posibles]], ...]
function removePosibleValues(position, value, posibleVals) {
    const boxRowStart = Math.floor(position.i / 3) * 3;
    const boxColStart = Math.floor(position.j / 3) * 3;


    //console.log("=================================================")
    posibleVals.forEach(e => {
        
        const [pos, possibles] = e;

        // Si no está en la misma fila, columna ni subcuadro, omitir
        const sameRow = pos.i === position.i;
        const sameCol = pos.j === position.j;
        const sameBox = (
            Math.floor(pos.i / 3) === Math.floor(position.i / 3) &&
            Math.floor(pos.j / 3) === Math.floor(position.j / 3)
        );

        if (sameRow || sameCol || sameBox) {
            // Eliminar el valor si está presente
            const index = possibles.indexOf(value);
            if (index !== -1) {
                possibles.splice(index, 1);
            }
        }
    });
}



export default function solver( sudoku ) {
    if (sudoku.length !== 9 || sudoku[0].length !== 9) return null;
    //Obtengo Posiciones a llenar
    let positionsToFill = getPositionsToFill(sudoku);
    //Valor cambiante de los posibles valores de cada posicion
    let posNfills = [positionsToFill.map( e => [e,getPosibleValues(sudoku, e)])]

    //El estado de llenado del sudoku
    let fillings = []
    do {
        // Si ya no quedan más valores posibles para esta posición, retrocedemos
        if (posNfills[posNfills.length-1][fillings.length][1].length === 0) {
            // Si tampoco hay posiciones anteriores, el Sudoku no se puede resolver
            if (fillings.length === 0) {console.log("NO SE PUEDE RESOLVER");return null;}

            // Retroceder al estado anterior
            fillings.pop();
            posNfills.pop();
            //console.log("NO SE PUDO, RETROCEDER, " + fillings.length)

            continue; // importante: continuar con el ciclo después de retroceder
        }

        // Tomar la posición actual y el próximo número a probar
        const [pos2Change, possibleNums] = posNfills[posNfills.length-1][fillings.length];
        if (possibleNums.length === 0) {
            fillings.pop();
            posNfills.pop();
            //console.log("NO SE PUDO, RETROCEDER, " + fillings.length)
            continue;
        }

        const num = possibleNums.pop();
        // Remover valores que ya no son posibles
        posNfills.push( posNfills[posNfills.length-1].map( ([pos, ums], i) => [pos, [...ums]] ))
        removePosibleValues(pos2Change, num, posNfills[posNfills.length-1])

        // Clonar el sudoku actual
        const newSud = ((fillings.length > 0) ? fillings[fillings.length-1] : sudoku).map(row => [...row]);
        newSud[pos2Change.i][pos2Change.j] = num;
        fillings.push(newSud)


        //console.log(newSud.map(e => e.join(' ')).join('\n').replaceAll("-1", "_"))
        // Agregar el nuevo estado a la pila de intentos
        //fillings.push(newSud);
        //console.log("AUMENTAR A " + fillings.length)

    } while (fillings.length < posNfills[posNfills.length-1].length);

    
    
    return fillings.pop()
}

console.log(solver(sud))
