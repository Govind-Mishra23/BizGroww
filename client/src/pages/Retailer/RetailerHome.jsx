import React from "react";
import { Link } from "react-router-dom";

const RetailerHome = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Retailer Dashboard
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Manage your profile, products, and network.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Tab 1: Profile */}
        <Link to="/retailer/profile" className="block">
          <div className="bg-yellow-50 overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300 border-l-4 border-yellow-500">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Profile
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-lg font-semibold text-gray-900">
                      Manage Profile
                    </div>
                  </dd>
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Tab 2: Product Portfolio */}
        <Link to="/retailer/products" className="block">
          <div className="bg-green-50 overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300 border-l-4 border-green-500">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Product Portfolio
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-lg font-semibold text-gray-900">
                      Manage Products
                    </div>
                  </dd>
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Tab 3: Network Details */}
        <Link to="/retailer/network-details" className="block">
          <div className="bg-purple-50 overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300 border-l-4 border-purple-500">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Network Details
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-lg font-semibold text-gray-900">
                      Distributor & Influencer
                    </div>
                  </dd>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default RetailerHome;
