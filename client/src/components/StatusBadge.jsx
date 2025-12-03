import React from 'react';

const StatusBadge = ({ status }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'OPEN': return 'bg-green-100 text-green-800 border-green-200';
            case 'CLOSED': return 'bg-red-100 text-red-800 border-red-200';
            case 'FULFILLED': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'EXPIRED': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
            {status}
        </span>
    );
};

export default StatusBadge;
