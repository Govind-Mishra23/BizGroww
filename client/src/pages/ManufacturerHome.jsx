import React, { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";

const ManufacturerHome = () => {
  const [distributors, setDistributors] = useState([]);
  const [retailers, setRetailers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNetworkData();
  }, []);

  const fetchNetworkData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch distributors and retailers in parallel
      const [distRes, retailRes] = await Promise.all([
        axiosClient.get("/company/distributors"),
        axiosClient.get("/company/retailers"),
      ]);

      console.log("✅ Distributors fetched:", distRes.data.length);
      console.log("✅ Retailers fetched:", retailRes.data.length);

      setDistributors(distRes.data);
      setRetailers(retailRes.data);
    } catch (err) {
      console.error("❌ Error fetching network data:", err);
      setError(err.response?.data?.message || "Failed to load network data");
    } finally {
      setLoading(false);
    }
  };

  const renderDistributorCard = (distributor) => (
    <div
      key={distributor._id}
      className="border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-base font-semibold text-gray-900">
            {distributor.companyName || "No Company Name"}
          </h4>
          <p className="text-sm text-gray-600 mt-1">
            {distributor.industry || "Industry not specified"}
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            {distributor.businessModel &&
              distributor.businessModel.length > 0 &&
              distributor.businessModel.map((model, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {model}
                </span>
              ))}
          </div>
          <div className="mt-2 text-sm text-gray-500">
            <p>
              📍 {distributor.headOffice?.state || "Location not specified"},{" "}
              {distributor.headOffice?.country || "India"}
            </p>
            {distributor.contactNumber && <p>📞 {distributor.contactNumber}</p>}
            {distributor.email && <p>✉️ {distributor.email}</p>}
          </div>
        </div>
        <button className="ml-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
          View Details
        </button>
      </div>
    </div>
  );

  const renderRetailerCard = (retailer) => (
    <div
      key={retailer._id}
      className="border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-base font-semibold text-gray-900">
            {retailer.companyName || "No Company Name"}
          </h4>
          <p className="text-sm text-gray-600 mt-1">
            {retailer.industry || "Industry not specified"}
          </p>
          <div className="mt-2 text-sm text-gray-500">
            <p>
              📍 {retailer.headOffice?.state || "Location not specified"},{" "}
              {retailer.headOffice?.country || "India"}
            </p>
            {retailer.gstNumber && <p>🏢 GST: {retailer.gstNumber}</p>}
            {retailer.branches && retailer.branches.length > 0 && (
              <p>🏪 {retailer.branches.length} branch(es)</p>
            )}
          </div>
        </div>
        <button className="ml-4 text-green-600 hover:text-green-800 text-sm font-medium">
          View Details
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading network data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Distributor List Section */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Distributor Network
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  {distributors.length} distributor
                  {distributors.length !== 1 ? "s" : ""} available
                </p>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {distributors.length}
              </span>
            </div>
          </div>
          <div className="px-4 py-5 sm:p-6 max-h-96 overflow-y-auto">
            {distributors.length > 0 ? (
              <div>{distributors.map(renderDistributorCard)}</div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <p className="mt-2">No distributors found yet.</p>
                <p className="text-xs mt-1">
                  Distributors will appear here once they create their profiles.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Retailer List Section */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Retailer Network
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  {retailers.length} retailer{retailers.length !== 1 ? "s" : ""}{" "}
                  available
                </p>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {retailers.length}
              </span>
            </div>
          </div>
          <div className="px-4 py-5 sm:p-6 max-h-96 overflow-y-auto">
            {retailers.length > 0 ? (
              <div>{retailers.map(renderRetailerCard)}</div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <p className="mt-2">No retailers found yet.</p>
                <p className="text-xs mt-1">
                  Retailers will appear here once they create their profiles.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManufacturerHome;
