
import React, { useState, useCallback } from 'react';
import Display from './components/Display';
import Button from './components/Button';

const buttonConfig = [
    { label: 'AC', className: 'bg-gray-400 text-black', type: 'special' },
    { label: '±', className: 'bg-gray-400 text-black', type: 'special' },
    { label: '%', className: 'bg-gray-400 text-black', type: 'special' },
    { label: '÷', className: 'bg-orange-500 hover:bg-orange-600 text-white', type: 'operator' },
    { label: '7', className: 'bg-gray-700 hover:bg-gray-800 text-white', type: 'digit' },
    { label: '8', className: 'bg-gray-700 hover:bg-gray-800 text-white', type: 'digit' },
    { label: '9', className: 'bg-gray-700 hover:bg-gray-800 text-white', type: 'digit' },
    { label: '×', className: 'bg-orange-500 hover:bg-orange-600 text-white', type: 'operator' },
    { label: '4', className: 'bg-gray-700 hover:bg-gray-800 text-white', type: 'digit' },
    { label: '5', className: 'bg-gray-700 hover:bg-gray-800 text-white', type: 'digit' },
    { label: '6', className: 'bg-gray-700 hover:bg-gray-800 text-white', type: 'digit' },
    { label: '-', className: 'bg-orange-500 hover:bg-orange-600 text-white', type: 'operator' },
    { label: '1', className: 'bg-gray-700 hover:bg-gray-800 text-white', type: 'digit' },
    { label: '2', className: 'bg-gray-700 hover:bg-gray-800 text-white', type: 'digit' },
    { label: '3', className: 'bg-gray-700 hover:bg-gray-800 text-white', type: 'digit' },
    { label: '+', className: 'bg-orange-500 hover:bg-orange-600 text-white', type: 'operator' },
    { label: '0', className: 'col-span-2 bg-gray-700 hover:bg-gray-800 text-white', type: 'digit' },
    { label: '.', className: 'bg-gray-700 hover:bg-gray-800 text-white', type: 'digit' },
    { label: '=', className: 'bg-orange-500 hover:bg-orange-600 text-white', type: 'operator' },
];

const App: React.FC = () => {
    const [input, setInput] = useState<string>('0');
    const [operator, setOperator] = useState<string | null>(null);
    const [prevValue, setPrevValue] = useState<string | null>(null);
    const [isNewInput, setIsNewInput] = useState<boolean>(true);

    const calculate = useCallback((): string | null => {
        if (prevValue === null || operator === null) return null;
        const prev = parseFloat(prevValue);
        const current = parseFloat(input);
        if (isNaN(prev) || isNaN(current)) return 'Error';

        let result: number;
        switch (operator) {
            case '+': result = prev + current; break;
            case '-': result = prev - current; break;
            case '×': result = prev * current; break;
            case '÷':
                if (current === 0) return 'Error';
                result = prev / current;
                break;
            default: return null;
        }
        return String(Number(result.toPrecision(15)));
    }, [prevValue, operator, input]);

    const handleClear = useCallback(() => {
        setInput('0');
        setOperator(null);
        setPrevValue(null);
        setIsNewInput(true);
    }, []);

    const handleDigit = useCallback((digit: string) => {
        if (input.length >= 15 && !isNewInput) return;
        if (isNewInput) {
            setInput(digit);
            setIsNewInput(false);
        } else {
            setInput(input === '0' ? digit : input + digit);
        }
    }, [input, isNewInput]);

    const handleDecimal = useCallback(() => {
        if (isNewInput) {
            setInput('0.');
            setIsNewInput(false);
        } else if (!input.includes('.')) {
            setInput(input + '.');
        }
    }, [input, isNewInput]);

    const handleOperator = useCallback((op: string) => {
        if (prevValue !== null && operator !== null && !isNewInput) {
            const result = calculate();
            if (result === 'Error') {
                setInput('Error');
                setPrevValue(null);
                setOperator(null);
                setIsNewInput(true);
                return;
            }
            setPrevValue(result);
            setInput(result || '0');
        } else {
            setPrevValue(input);
        }
        setOperator(op);
        setIsNewInput(true);
    }, [input, prevValue, operator, isNewInput, calculate]);

    const handleEquals = useCallback(() => {
        if (prevValue === null || operator === null || isNewInput) return;
        
        const result = calculate();
        setInput(result || input);
        setPrevValue(null);
        setOperator(null);
        setIsNewInput(true);
    }, [prevValue, operator, input, calculate, isNewInput]);

    const handlePlusMinus = useCallback(() => {
        if (input !== '0' && input !== 'Error') {
            setInput(input.startsWith('-') ? input.slice(1) : '-' + input);
        }
    }, [input]);

    const handlePercent = useCallback(() => {
        if (input !== 'Error') {
            const numericValue = parseFloat(input);
            if (!isNaN(numericValue)) {
                setInput(String(numericValue / 100));
            }
        }
    }, [input]);

    const handleButtonClick = useCallback((label: string) => {
        if (input === 'Error' && label !== 'AC') return;

        if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(label)) {
            handleDigit(label);
        } else if (label === '.') {
            handleDecimal();
        } else if (['+', '-', '×', '÷'].includes(label)) {
            handleOperator(label);
        } else if (label === '=') {
            handleEquals();
        } else if (label === 'AC') {
            handleClear();
        } else if (label === '±') {
            handlePlusMinus();
        } else if (label === '%') {
            handlePercent();
        }
    }, [input, handleDigit, handleDecimal, handleOperator, handleEquals, handleClear, handlePlusMinus, handlePercent]);

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-xs mx-auto bg-black rounded-3xl shadow-2xl shadow-gray-800/40 p-4 space-y-4">
                <Display value={input} />
                <div className="grid grid-cols-4 gap-3">
                    {buttonConfig.map((btn) => (
                        <Button
                            key={btn.label}
                            label={btn.label}
                            onClick={handleButtonClick}
                            className={btn.className}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default App;
