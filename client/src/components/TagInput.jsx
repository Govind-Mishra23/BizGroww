import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const TagInput = ({ label, tags = [], onChange, placeholder }) => {
    const [input, setInput] = useState('');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const trimmedInput = input.trim();
            if (trimmedInput && !tags.includes(trimmedInput)) {
                onChange([...tags, trimmedInput]);
                setInput('');
            }
        }
    };

    const removeTag = (tagToRemove) => {
        onChange(tags.filter(tag => tag !== tagToRemove));
    };

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((tag, index) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            {tag}
                            <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="ml-1.5 inline-flex items-center justify-center text-blue-400 hover:text-blue-600 focus:outline-none"
                            >
                                <FaTimes size={12} />
                            </button>
                        </span>
                    ))}
                </div>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={tags.length === 0 ? placeholder : ""}
                    className="w-full outline-none text-sm text-gray-700"
                />
            </div>
            <p className="mt-1 text-xs text-gray-500">Type a name and press Enter or Comma to add.</p>
        </div>
    );
};

export default TagInput;
