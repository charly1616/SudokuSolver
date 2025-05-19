import './botones.css';

function Botones() {
    return (
        <div className="botones">
            {[1,2,3,4,5,6,7,8,9].map((num: number) => (
                <button  className="boton" key={num}>{num}</button>
            ))}
        </div>
    );
}

export default Botones