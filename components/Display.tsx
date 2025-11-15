
import React from 'react';

interface DisplayProps {
  value: string;
}

const Display: React.FC<DisplayProps> = ({ value }) => {
    // Dynamically adjust font size based on length for better visibility
    const getFontSize = (val: string) => {
        const len = val.replace('.', '').length;
        if (len > 14) return 'text-3xl';
        if (len > 11) return 'text-4xl';
        if (len > 8) return 'text-5xl';
        return 'text-6xl';
    };

    return (
        <div className="text-white font-light text-right w-full h-24 flex items-end justify-end p-4 overflow-hidden">
            <span className={`inline-block w-full break-all transition-all duration-100 ${getFontSize(value)}`}>
                {value}
            </span>
        </div>
    );
};

export default Display;
