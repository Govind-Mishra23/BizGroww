import React from 'react';

const DistributorHome = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Distributor Dashboard
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Welcome to your distributor portal.
                    </p>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                                Actions
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                                    <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                                        <div className="w-0 flex-1 flex items-center">
                                            <span className="ml-2 flex-1 w-0 truncate">
                                                Browse Manufacturer Requirements
                                            </span>
                                        </div>
                                        <div className="ml-4 flex-shrink-0">
                                            <a href="/requirements" className="font-medium text-blue-600 hover:text-blue-500">
                                                View
                                            </a>
                                        </div>
                                    </li>
                                </ul>
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
};

export default DistributorHome;
