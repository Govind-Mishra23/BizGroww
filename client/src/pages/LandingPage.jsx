import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaIndustry, FaTruck, FaStore, FaUserTie } from 'react-icons/fa';

const LandingPage = () => {
    const navigate = useNavigate();

    const roles = [
        { id: 'manufacturer', label: 'Manufacturer', icon: <FaIndustry className="text-4xl mb-4 text-blue-500" />, path: '/login' },
        { id: 'distributor', label: 'Distributor', icon: <FaTruck className="text-4xl mb-4 text-green-500" />, path: '/login' },
        { id: 'retailer', label: 'Retailer', icon: <FaStore className="text-4xl mb-4 text-orange-500" />, path: '/login' },
        { id: 'candidate', label: 'Candidate', icon: <FaUserTie className="text-4xl mb-4 text-purple-500" />, path: '/login' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
            <div className="max-w-4xl w-full text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-8">
                    Who are you?
                </h1>
                <p className="text-xl text-gray-600 mb-12">
                    Select your role to get started
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {roles.map((role) => (
                        <button
                            key={role.id}
                            onClick={() => navigate(role.path, { state: { role: role.id } })}
                            className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col items-center justify-center border border-gray-100 hover:border-blue-200 group"
                        >
                            <div className="transform group-hover:scale-110 transition-transform duration-300">
                                {role.icon}
                            </div>
                            <span className="text-lg font-semibold text-gray-800 group-hover:text-blue-600">
                                {role.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
