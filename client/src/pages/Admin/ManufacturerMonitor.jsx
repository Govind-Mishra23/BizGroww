import React, { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import {
  FaCheck,
  FaTimes,
  FaEye,
  FaFilter,
  FaSearch,
  FaTrash,
} from "react-icons/fa";

const ManufacturerMonitor = () => {
  const [manufacturers, setManufacturers] = useState([]);
  const [filteredManufacturers, setFilteredManufacturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchManufacturers();
  }, []);

  useEffect(() => {
    filterManufacturers();
  }, [searchTerm, statusFilter, manufacturers]);

  const fetchManufacturers = async () => {
    try {
      const res = await axiosClient.get("/company/all");
      setManufacturers(res.data);
      setFilteredManufacturers(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching manufacturers:", error);
      setLoading(false);
    }
  };

  const filterManufacturers = () => {
    let filtered = [...manufacturers];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (m) =>
          m.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.ownerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.gstNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((m) => m.status === statusFilter);
    }

    setFilteredManufacturers(filtered);
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axiosClient.patch(`/company/${id}/status`, { status: newStatus });
      alert("Status updated successfully!");
      fetchManufacturers();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Error updating status");
    }
  };

  const deleteManufacturer = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this manufacturer? This will remove ALL associated data (User account, Profile, Requirements). This action cannot be undone."
      )
    ) {
      try {
        await axiosClient.delete(`/company/${id}`);
        alert("Manufacturer deleted successfully!");
        fetchManufacturers();
      } catch (error) {
        console.error("Error deleting manufacturer:", error);
        alert("Error deleting manufacturer");
      }
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      underReview: "bg-blue-100 text-blue-800",
    };
    return badges[status] || "bg-gray-100 text-gray-800";
  };

  const viewDetails = (manufacturer) => {
    setSelectedManufacturer(manufacturer);
    setShowDetailModal(true);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading manufacturers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Manufacturer Monitoring
        </h1>
        <p className="text-gray-600">
          Monitor and verify all registered manufacturers
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-blue-600 text-sm font-medium">
            Total Manufacturers
          </p>
          <p className="text-2xl font-bold text-blue-900">
            {manufacturers.length}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-green-600 text-sm font-medium">Approved</p>
          <p className="text-2xl font-bold text-green-900">
            {manufacturers.filter((m) => m.status === "approved").length}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <p className="text-yellow-600 text-sm font-medium">Pending Review</p>
          <p className="text-2xl font-bold text-yellow-900">
            {
              manufacturers.filter(
                (m) => m.status === "pending" || m.status === "underReview"
              ).length
            }
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="text-red-600 text-sm font-medium">Rejected</p>
          <p className="text-2xl font-bold text-red-900">
            {manufacturers.filter((m) => m.status === "rejected").length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by company name, owner, email, or GST..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="underReview">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Owner Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredManufacturers.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                  No manufacturers found
                </td>
              </tr>
            ) : (
              filteredManufacturers.map((manufacturer) => (
                <tr key={manufacturer._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {manufacturer.companyName}
                    </div>
                    <div className="text-xs text-gray-500">
                      GST: {manufacturer.gstNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {manufacturer.ownerName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {manufacturer.contactNumber}
                    </div>
                    <div className="text-xs text-gray-500">
                      {manufacturer.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {manufacturer.headOffice?.town},{" "}
                      {manufacturer.headOffice?.state}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                        manufacturer.status
                      )}`}
                    >
                      {manufacturer.status || "pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(manufacturer.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => viewDetails(manufacturer)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      {manufacturer.status !== "approved" && (
                        <button
                          onClick={() =>
                            updateStatus(manufacturer._id, "approved")
                          }
                          className="text-green-600 hover:text-green-900"
                          title="Approve"
                        >
                          <FaCheck />
                        </button>
                      )}
                      {manufacturer.status !== "rejected" && (
                        <button
                          onClick={() =>
                            updateStatus(manufacturer._id, "rejected")
                          }
                          className="text-red-600 hover:text-red-900"
                          title="Reject"
                        >
                          <FaTimes />
                        </button>
                      )}
                      <button
                        onClick={() => deleteManufacturer(manufacturer._id)}
                        className="text-red-600 hover:text-red-900 ml-2"
                        title="Delete Permanently"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedManufacturer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">
                Manufacturer Details
              </h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              {/* Company Information */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Company Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Company Name</p>
                    <p className="text-base font-medium">
                      {selectedManufacturer.companyName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Industry</p>
                    <p className="text-base font-medium">
                      {selectedManufacturer.industry}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Company Type</p>
                    <p className="text-base font-medium">
                      {selectedManufacturer.companyType}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Incorporation Year</p>
                    <p className="text-base font-medium">
                      {selectedManufacturer.incorporationYear}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">GST Number</p>
                    <p className="text-base font-medium">
                      {selectedManufacturer.gstNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Owner Name</p>
                    <p className="text-base font-medium">
                      {selectedManufacturer.ownerName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Contact Number</p>
                    <p className="text-base font-medium">
                      {selectedManufacturer.contactNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-base font-medium">
                      {selectedManufacturer.email}
                    </p>
                  </div>
                  {selectedManufacturer.website && (
                    <div>
                      <p className="text-sm text-gray-500">Website</p>
                      <a
                        href={selectedManufacturer.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base font-medium text-blue-600 hover:underline"
                      >
                        {selectedManufacturer.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Address Information */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Address Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedManufacturer.headOffice && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Head Office</p>
                      <p className="text-sm">
                        {selectedManufacturer.headOffice.address}
                      </p>
                      <p className="text-sm">
                        {selectedManufacturer.headOffice.town},{" "}
                        {selectedManufacturer.headOffice.state}
                      </p>
                      <p className="text-sm">
                        {selectedManufacturer.headOffice.country}
                      </p>
                    </div>
                  )}
                  {selectedManufacturer.manufacturingUnit?.address && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Manufacturing Unit
                      </p>
                      <p className="text-sm">
                        {selectedManufacturer.manufacturingUnit.address}
                      </p>
                      <p className="text-sm">
                        {selectedManufacturer.manufacturingUnit.town},{" "}
                        {selectedManufacturer.manufacturingUnit.state}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Products */}
              {selectedManufacturer.products &&
                selectedManufacturer.products.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">
                      Products ({selectedManufacturer.products.length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selectedManufacturer.products
                        .slice(0, 6)
                        .map((product, idx) => (
                          <div
                            key={idx}
                            className="text-sm bg-gray-50 p-2 rounded"
                          >
                            {product.category}{" "}
                            {product.subCategory && `- ${product.subCategory}`}
                          </div>
                        ))}
                    </div>
                  </div>
                )}

              {/* Admin Actions */}
              <div className="flex gap-4 pt-4 border-t">
                <button
                  onClick={() => {
                    updateStatus(selectedManufacturer._id, "approved");
                    setShowDetailModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => {
                    updateStatus(selectedManufacturer._id, "rejected");
                    setShowDetailModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManufacturerMonitor;
