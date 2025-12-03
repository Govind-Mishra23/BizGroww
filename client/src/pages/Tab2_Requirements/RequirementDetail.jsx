import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import StatusBadge from '../../components/StatusBadge';
import { FaArrowLeft } from 'react-icons/fa';

const RequirementDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [req, setReq] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReq = async () => {
            try {
                const res = await axiosClient.get(`/requirements/${id}`);
                setReq(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchReq();
    }, [id]);

    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (!req) return <div className="text-center py-10">Requirement not found</div>;

    return (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <button
                onClick={() => navigate('/requirements')}
                className="flex items-center text-gray-500 hover:text-gray-700 mb-6"
            >
                <FaArrowLeft className="mr-2" /> Back to List
            </button>

            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{req.title}</h1>
                    <p className="text-sm text-gray-500 font-mono">{req.reqId}</p>
                </div>
                <StatusBadge status={req.status} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Target Audience</h3>
                    <p className="text-lg text-gray-900">{req.targetAudience}</p>
                </div>

                <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Locations</h3>
                    <div className="mb-2">
                        <span className="text-xs text-gray-500 block">States</span>
                        <p className="text-gray-900">{req.states.join(', ') || 'All States'}</p>
                    </div>
                    <div>
                        <span className="text-xs text-gray-500 block">Towns</span>
                        <p className="text-gray-900">{req.towns.join(', ') || 'All Towns'}</p>
                    </div>
                </div>
            </div>

            <div className="border-t pt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Marketing Support</h3>
                {req.marketingSupport ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {Object.entries(req.supportOptions).map(([key, value]) => (
                            value && (
                                <div key={key} className="flex items-center space-x-2 text-gray-700">
                                    <span className="text-green-500">✓</span>
                                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                </div>
                            )
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 italic">No marketing support provided.</p>
                )}
            </div>
        </div>
    );
};

export default RequirementDetail;
