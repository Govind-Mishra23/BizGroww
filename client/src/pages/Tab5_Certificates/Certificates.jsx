import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import CloudinaryUpload from '../../components/CloudinaryUpload';

const Certificates = () => {
    const [certificates, setCertificates] = useState({
        gst: '',
        iso: '',
        msme: '',
        importLicense: '',
        compliance: []
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await axiosClient.get('/company');
            if (res.data && res.data.certificates) {
                setCertificates({ ...certificates, ...res.data.certificates });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const handleUpload = (field, urls) => {
        // For single files, take the first URL. For arrays, take all.
        const value = Array.isArray(certificates[field]) ? urls : (urls[0] || '');
        setCertificates({ ...certificates, [field]: value });
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await axiosClient.post('/company', { certificates });
            alert('Certificates Saved Successfully!');
        } catch (error) {
            console.error('Error saving certificates:', error);
            alert('Error saving certificates');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Company Certificates & Documents</h2>
            <p className="text-gray-500 mb-8 text-sm">Upload your official documents (PDF or Images).</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <CloudinaryUpload
                    label="GST Certificate"
                    existingImages={certificates.gst ? [certificates.gst] : []}
                    onUpload={(urls) => handleUpload('gst', urls)}
                    resourceType="auto"
                />
                <CloudinaryUpload
                    label="ISO Certificate"
                    existingImages={certificates.iso ? [certificates.iso] : []}
                    onUpload={(urls) => handleUpload('iso', urls)}
                    resourceType="auto"
                />
                <CloudinaryUpload
                    label="MSME Certificate"
                    existingImages={certificates.msme ? [certificates.msme] : []}
                    onUpload={(urls) => handleUpload('msme', urls)}
                    resourceType="auto"
                />
                <CloudinaryUpload
                    label="Import License"
                    existingImages={certificates.importLicense ? [certificates.importLicense] : []}
                    onUpload={(urls) => handleUpload('importLicense', urls)}
                    resourceType="auto"
                />
            </div>

            <div className="mt-8">
                <CloudinaryUpload
                    label="Other Compliance Documents"
                    existingImages={certificates.compliance}
                    onUpload={(urls) => handleUpload('compliance', urls)}
                    multiple
                    resourceType="auto"
                />
            </div>

            <div className="mt-8 flex justify-end">
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Saving...' : 'Save Certificates'}
                </button>
            </div>
        </div>
    );
};

export default Certificates;
