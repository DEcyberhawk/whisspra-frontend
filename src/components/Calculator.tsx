import React, { useState } from 'react';

interface CalculatorProps {
    onWipe: () => void;
}

const Calculator: React.FC<CalculatorProps> = ({ onWipe }) => {
    const [display, setDisplay] = useState('0');
    const [firstOperand, setFirstOperand] = useState<number | null>(null);
    const [operator, setOperator] = useState<string | null>(null);
    const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);
    const wipeHoldTimer = React.useRef<number | null>(null);

    const handleDigitClick = (digit: string) => {
        if (waitingForSecondOperand) {
            setDisplay(digit);
            setWaitingForSecondOperand(false);
        } else {
            setDisplay(display === '0' ? digit : display + digit);
        }
    };
    
    const inputDecimal = (dot: string) => {
        if (waitingForSecondOperand) return;
        if (!display.includes(dot)) {
            setDisplay(display + dot);
        }
    };

    const handleOperatorClick = (nextOperator: string) => {
        const inputValue = parseFloat(display);
        if (operator && waitingForSecondOperand) {
            setOperator(nextOperator);
            return;
        }
        if (firstOperand === null) {
            setFirstOperand(inputValue);
        } else if (operator) {
            const result = performCalculation[operator](firstOperand, inputValue);
            setDisplay(String(result));
            setFirstOperand(result);
        }
        setWaitingForSecondOperand(true);
        setOperator(nextOperator);
    };

    const performCalculation: { [key: string]: (a: number, b: number) => number } = {
        '/': (first, second) => first / second,
        '*': (first, second) => first * second,
        '+': (first, second) => first + second,
        '-': (first, second) => first - second,
        '=': (_first, second) => second,
    };
    
    const resetCalculator = () => {
        setDisplay('0');
        setFirstOperand(null);
        setOperator(null);
        setWaitingForSecondOperand(false);
    };

    const handleClearPress = () => {
        wipeHoldTimer.current = window.setTimeout(() => {
            onWipe();
        }, 2000); // 2 second hold
    };

    const handleClearRelease = () => {
        if (wipeHoldTimer.current) {
            clearTimeout(wipeHoldTimer.current);
            wipeHoldTimer.current = null;
        }
        resetCalculator();
    };


    const buttons = [
        { label: 'AC', className: 'bg-slate-500 hover:bg-slate-600', onMouseDown: handleClearPress, onMouseUp: handleClearRelease, onMouseLeave: handleClearRelease, onClick: () => {} },
        { label: '+/-', className: 'bg-slate-500 hover:bg-slate-600', onClick: () => setDisplay(String(parseFloat(display) * -1)) },
        { label: '%', className: 'bg-slate-500 hover:bg-slate-600', onClick: () => setDisplay(String(parseFloat(display) / 100)) },
        { label: '÷', className: 'bg-orange-500 hover:bg-orange-600', onClick: () => handleOperatorClick('/') },
        { label: '7', className: 'bg-slate-700 hover:bg-slate-800', onClick: () => handleDigitClick('7') },
        { label: '8', className: 'bg-slate-700 hover:bg-slate-800', onClick: () => handleDigitClick('8') },
        { label: '9', className: 'bg-slate-700 hover:bg-slate-800', onClick: () => handleDigitClick('9') },
        { label: '×', className: 'bg-orange-500 hover:bg-orange-600', onClick: () => handleOperatorClick('*') },
        { label: '4', className: 'bg-slate-700 hover:bg-slate-800', onClick: () => handleDigitClick('4') },
        { label: '5', className: 'bg-slate-700 hover:bg-slate-800', onClick: () => handleDigitClick('5') },
        { label: '6', className: 'bg-slate-700 hover:bg-slate-800', onClick: () => handleDigitClick('6') },
        { label: '−', className: 'bg-orange-500 hover:bg-orange-600', onClick: () => handleOperatorClick('-') },
        { label: '1', className: 'bg-slate-700 hover:bg-slate-800', onClick: () => handleDigitClick('1') },
        { label: '2', className: 'bg-slate-700 hover:bg-slate-800', onClick: () => handleDigitClick('2') },
        { label: '3', className: 'bg-slate-700 hover:bg-slate-800', onClick: () => handleDigitClick('3') },
        { label: '+', className: 'bg-orange-500 hover:bg-orange-600', onClick: () => handleOperatorClick('+') },
        { label: '0', className: 'col-span-2 bg-slate-700 hover:bg-slate-800', onClick: () => handleDigitClick('0') },
        { label: '.', className: 'bg-slate-700 hover:bg-slate-800', onClick: () => inputDecimal('.') },
        { label: '=', className: 'bg-orange-500 hover:bg-orange-600', onClick: () => handleOperatorClick('=') },
    ];
    
    return (
        <div className="h-screen w-screen bg-black flex items-center justify-center p-4 antialiased">
            <div className="w-full max-w-xs mx-auto">
                <div className="bg-black rounded-lg shadow-2xl shadow-slate-700/20">
                    <div className="p-4 text-white text-6xl text-right font-light tracking-wider overflow-x-auto">
                        {display}
                    </div>
                    <div className="grid grid-cols-4 gap-px">
                       {buttons.map(btn => (
                           <button
                               key={btn.label}
                               className={`text-white text-2xl h-20 transition-colors duration-200 ${btn.className} ${btn.label === 'AC' ? 'active:bg-red-500' : ''}`}
                               onClick={btn.onClick}
                               onMouseDown={btn.onMouseDown}
                               onMouseUp={btn.onMouseUp}
                               onMouseLeave={btn.onMouseLeave}
                           >
                               {btn.label}
                           </button>
                       ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Calculator;
