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
    let values = [true, true, true,true, true, true,true, true, true]

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


    sudoku.filter( (e,i) => i/3===position.i/3).forEach( row => {
        row.filter( (u,j) => j/3===position.j).forEach( (a) => {
            if (a === -1) return;
            values[a-1] = false
        })
    })


    return values.map( (e,i) => (e)? (i+1) : null).filter(x => x)
}

// console.log(getPosibleValues(sud, {i:2,j:2}))

//console.log(getPositionsToFill(sud))


export default function solver( sudoku ) {
    if (sudoku.length !== 9 || sudoku[0].length !== 9) return null;
    let positionsToFill = getPositionsToFill(sudoku);
    const posNfillsconst = positionsToFill.map( e => [e,getPosibleValues(sudoku, e)])
    let posNfills = positionsToFill.map( e => [e,getPosibleValues(sudoku, e)])


    let fillings = []
    do {
        // Si ya no quedan más valores posibles para esta posición, retrocedemos
        if (posNfills[fillings.length][1].length === 0) {
            // Si tampoco hay posiciones anteriores, el Sudoku no se puede resolver
            if (fillings.length === 0) {console.log("NO SE PUEDE RESOLVER");return null;}

            // Retroceder al estado anterior
            fillings.pop();
            console.log("NO SE PUDO, RETROCEDER, " + fillings.length)

            // Restaurar los posibles valores desde la copia original
            posNfills = posNfills.map((e, i) => 
                i <= fillings.length+1 ? e : [posNfillsconst[i][0], [...posNfillsconst[i][1]]]
            );

            continue; // importante: continuar con el ciclo después de retroceder
        }

        // Tomar la posición actual y el próximo número a probar
        const [pos2Change, possibleNums] = posNfills[fillings.length];
        const num = possibleNums.pop();
        console.log(`[${pos2Change.i}, ${pos2Change.j}]` + " " + num)

        // Clonar el sudoku actual
        const newSud = ((fillings.length > 1) ? fillings[fillings.length-1] : sudoku).map(row => [...row]);
        newSud[pos2Change.i][pos2Change.j] = num;

        // Si hay colisiones, no continuar con esta rama
        // console.log(Object.entries(checkColision(newSud,pos2Change)).filter(([cle,val]) => val.length > 0))
        if (Object.entries(checkColision(newSud,pos2Change)).filter(([cle,val]) => val.length > 0).length > 0) continue;

        // Agregar el nuevo estado a la pila de intentos
        fillings.push(newSud);
        console.log("AUMENTAR A " + fillings.length)

    } while (fillings.length < posNfills.length);

    
    
    return fillings.pop()
}

console.log(solver(sud))
