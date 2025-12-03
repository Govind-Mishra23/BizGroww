import React from 'react';

const InputField = ({ label, type = 'text', name, value, onChange, placeholder, required, error, disabled }) => {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                type={type}
                name={name}
                value={value || ''}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500' : 'border-gray-300'
                    } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
};

export default InputField;
