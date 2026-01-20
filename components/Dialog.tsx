import React, { useEffect, useRef } from 'react';

interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    type?: 'info' | 'success' | 'warning' | 'error';
}

export const Dialog: React.FC<DialogProps> = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    type = 'info'
}) => {
    const dialogRef = useRef<HTMLDivElement>(null);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            window.addEventListener('keydown', handleEscape);
        }

        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    // Type-based styling for the header icon/accent
    const getIcon = () => {
        switch (type) {
            case 'success': return 'check_circle';
            case 'warning': return 'warning';
            case 'error': return 'error';
            default: return 'info';
        }
    };

    const getColorClass = () => {
        switch (type) {
            case 'success': return 'text-green-600 dark:text-green-400';
            case 'warning': return 'text-amber-600 dark:text-amber-400';
            case 'error': return 'text-red-600 dark:text-red-400';
            default: return 'text-primary dark:text-blue-400';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Dialog Panel */}
            <div
                ref={dialogRef}
                className="relative bg-white dark:bg-[#1e2023] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-scale-in border border-gray-100 dark:border-gray-800"
                role="dialog"
                aria-modal="true"
            >
                {/* Header */}
                <div className="p-6 pb-2 flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-opacity-10 ${getColorClass().replace('text-', 'bg-')} ${getColorClass()}`}>
                            <span className="material-symbols-outlined">{getIcon()}</span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/5"
                    >
                        <span className="material-symbols-outlined text-xl">close</span>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 pt-2">
                    <div className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {children}
                    </div>
                </div>

                {/* Footer */}
                {footer && (
                    <div className="p-4 bg-gray-50 dark:bg-white/5 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3 rounded-b-2xl">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};
