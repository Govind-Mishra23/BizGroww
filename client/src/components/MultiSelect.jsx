import React, { useState, useEffect, useRef } from 'react';
import { FaChevronDown, FaTimes } from 'react-icons/fa';

const MultiSelect = ({ label, options, selected = [], onChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef(null);
    const inputRef = useRef(null);

    const toggleOption = (option) => {
        const newSelected = selected.includes(option)
            ? selected.filter((item) => item !== option)
            : [...selected, option];
        onChange(newSelected);
        setSearchTerm(''); // Clear search after selection
        inputRef.current?.focus();
    };

    const removeOption = (option, e) => {
        e.stopPropagation();
        onChange(selected.filter((item) => item !== option));
    };

    // Filter options
    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="mb-4 relative" ref={containerRef}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white cursor-text flex flex-wrap gap-2 items-center min-h-[42px]"
                onClick={() => {
                    setIsOpen(true);
                    inputRef.current?.focus();
                }}
            >
                {selected.map(option => (
                    <span key={option} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded flex items-center">
                        {option}
                        <FaTimes
                            className="ml-1 cursor-pointer hover:text-blue-900"
                            onClick={(e) => removeOption(option, e)}
                        />
                    </span>
                ))}

                <div className="flex-grow flex items-center min-w-[100px]">
                    <input
                        ref={inputRef}
                        type="text"
                        className="w-full outline-none text-sm text-gray-700 bg-transparent"
                        placeholder={selected.length === 0 ? placeholder : ""}
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setIsOpen(true);
                        }}
                        onFocus={() => setIsOpen(true)}
                    />
                </div>

                <FaChevronDown className="text-gray-400 text-xs ml-auto" />
            </div>

            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => (
                            <div
                                key={option}
                                className="px-3 py-2 hover:bg-blue-50 cursor-pointer flex items-center"
                                onClick={() => toggleOption(option)}
                            >
                                <input
                                    type="checkbox"
                                    checked={selected.includes(option)}
                                    readOnly
                                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <span className="text-sm text-gray-700">{option}</span>
                            </div>
                        ))
                    ) : (
                        <div className="px-3 py-2 text-sm text-gray-500">No results found</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MultiSelect;
