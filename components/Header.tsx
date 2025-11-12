import React, { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from './icons';

const Header: React.FC = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    return (
        <header className="bg-base-100 dark:bg-base-dark-200 p-4 shadow-md sticky top-0 z-20 animate-fade-in">
            <div className="container mx-auto flex items-center justify-between">
                <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    Asset Verification Tool
                </h1>
                <button onClick={toggleTheme} className="btn-icon p-2 rounded-full hover:bg-base-300 dark:hover:bg-base-dark-100 transition-colors duration-200">
                    {theme === 'light' ? <MoonIcon className="w-6 h-6 text-gray-700" /> : <SunIcon className="w-6 h-6 text-yellow-400" />}
                </button>
            </div>
        </header>
    );
};

export default Header;