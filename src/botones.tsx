import './botones.css';
import { useEffect } from 'react';

interface BotonesProps {
    selectedNumber: number | null;
    onSelectNumber: (num: number | null) => void;
}

function Botones({ selectedNumber, onSelectNumber }: BotonesProps) {
    const handleDelete = () => {
        onSelectNumber(null);
    };

    const handleSolve = () => {
        window.dispatchEvent(new CustomEvent('solve'));
    };

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            const num = parseInt(event.key);
            if (num >= 1 && num <= 9) {
                onSelectNumber(selectedNumber === num ? null : num);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [selectedNumber, onSelectNumber]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
            <div className="botones">
                {[1,2,3,4,5,6,7,8,9].map((num: number) => (
                    <button
                        className={`boton ${selectedNumber === num ? 'selected' : ''}`}
                        key={num}
                        onClick={() => onSelectNumber(selectedNumber === num ? null : num)}
                    >
                        {num}
                    </button>
                ))}
            </div>
            <div className="botones-accion">
                <button className="btn-solve" onClick={handleSolve}>Solve</button>
                <button 
                    className={`btn-delete ${selectedNumber === null ? 'selected' : ''}`}
                    onClick={handleDelete}
                >
                    ×
                </button>
            </div>
        </div>
    );
}

export default Botones