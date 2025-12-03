import React from 'react';

const RolePreviewToggle = ({ role, setRole }) => {
    return (
        <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
            <span className="text-xs font-medium text-gray-500 px-2">Preview as:</span>
            {['Manufacturer', 'Distributor', 'Retailer'].map((r) => (
                <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${role === r
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    {r}
                </button>
            ))}
        </div>
    );
};

export default RolePreviewToggle;
