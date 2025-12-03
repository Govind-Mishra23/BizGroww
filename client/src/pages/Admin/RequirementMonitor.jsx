import React, { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import { FaEye, FaFilter, FaSearch, FaEdit } from "react-icons/fa";

const RequirementMonitor = () => {
  const [requirements, setRequirements] = useState([]);
  const [filteredRequirements, setFilteredRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [audienceFilter, setAudienceFilter] = useState("all");
  const [selectedRequirement, setSelectedRequirement] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    fetchRequirements();
  }, []);

  useEffect(() => {
    filterRequirements();
  }, [searchTerm, statusFilter, audienceFilter, requirements]);

  const fetchRequirements = async () => {
    try {
      const res = await axiosClient.get("/requirements");
      setRequirements(res.data);
      setFilteredRequirements(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching requirements:", error);
      setLoading(false);
    }
  };

  const filterRequirements = () => {
    let filtered = [...requirements];

    // Search filter - including company name
    if (searchTerm) {
      filtered = filtered.filter(
        (r) =>
          r.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.reqId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.company?.companyName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          r.company?.ownerName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          r.company?.gstNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((r) => r.status === statusFilter);
    }

    // Audience filter
    if (audienceFilter !== "all") {
      filtered = filtered.filter((r) => r.targetAudience === audienceFilter);
    }

    setFilteredRequirements(filtered);
  };

  const getStatusBadge = (status) => {
    const badges = {
      OPEN: "bg-green-100 text-green-800 border-green-300",
      CLOSED: "bg-red-100 text-red-800 border-red-300",
      FULFILLED: "bg-blue-100 text-blue-800 border-blue-300",
      EXPIRED: "bg-gray-100 text-gray-800 border-gray-300",
    };
    return badges[status] || "bg-gray-100 text-gray-800";
  };

  const getAudienceBadge = (audience) => {
    const badges = {
      Distributor: "bg-purple-100 text-purple-800",
      Retailer: "bg-orange-100 text-orange-800",
      Both: "bg-indigo-100 text-indigo-800",
    };
    return badges[audience] || "bg-gray-100 text-gray-800";
  };

  const viewDetails = (requirement) => {
    setSelectedRequirement(requirement);
    setShowDetailModal(true);
  };

  const openStatusModal = (requirement) => {
    setSelectedRequirement(requirement);
    setNewStatus(requirement.status);
    setShowStatusModal(true);
  };

  const updateStatus = async () => {
    try {
      await axiosClient.put(`/requirements/${selectedRequirement._id}`, {
        ...selectedRequirement,
        status: newStatus,
      });
      alert("Status updated successfully!");
      setShowStatusModal(false);
      fetchRequirements();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Error updating status");
    }
  };

  const deleteRequirement = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this requirement? This action cannot be undone."
      )
    ) {
      try {
        await axiosClient.delete(`/requirements/${id}`);
        alert("Requirement deleted successfully!");
        fetchRequirements();
      } catch (error) {
        console.error("Error deleting requirement:", error);
        alert("Error deleting requirement");
      }
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading requirements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Requirement Posts Monitoring
        </h1>
        <p className="text-gray-600">
          Monitor and manage all manufacturer requirement posts
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-green-600 text-sm font-medium">
            Open Requirements
          </p>
          <p className="text-2xl font-bold text-green-900">
            {requirements.filter((r) => r.status === "OPEN").length}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="text-red-600 text-sm font-medium">Closed</p>
          <p className="text-2xl font-bold text-red-900">
            {requirements.filter((r) => r.status === "CLOSED").length}
          </p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-blue-600 text-sm font-medium">Fulfilled</p>
          <p className="text-2xl font-bold text-blue-900">
            {requirements.filter((r) => r.status === "FULFILLED").length}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm font-medium">Expired</p>
          <p className="text-2xl font-bold text-gray-900">
            {requirements.filter((r) => r.status === "EXPIRED").length}
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
            placeholder="Search by title, REQ ID, company name, owner, GST, or notes..."
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
            <option value="OPEN">Open</option>
            <option value="CLOSED">Closed</option>
            <option value="FULFILLED">Fulfilled</option>
            <option value="EXPIRED">Expired</option>
          </select>
        </div>
        {/* Audience Filter */}
        <div className="relative">
          <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select
            value={audienceFilter}
            onChange={(e) => setAudienceFilter(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
          >
            <option value="all">All Audience</option>
            <option value="Distributor">Distributor</option>
            <option value="Retailer">Retailer</option>
            <option value="Both">Both</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                REQ ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Target Audience
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                States
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRequirements.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                  No requirements found
                </td>
              </tr>
            ) : (
              filteredRequirements.map((requirement) => (
                <tr key={requirement._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono font-medium text-blue-600">
                      {requirement.reqId}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {requirement.title}
                    </div>
                    {requirement.notes && (
                      <div className="text-xs text-gray-500 truncate max-w-xs">
                        {requirement.notes.substring(0, 50)}...
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {requirement.company ? (
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {requirement.company.companyName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {requirement.company.ownerName}
                        </div>
                        <div className="text-xs text-gray-400 font-mono">
                          {requirement.company.gstNumber}
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">
                        No company data
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getAudienceBadge(
                        requirement.targetAudience
                      )}`}
                    >
                      {requirement.targetAudience}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {requirement.states?.slice(0, 2).join(", ")}
                      {requirement.states?.length > 2 &&
                        ` +${requirement.states.length - 2}`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusBadge(
                        requirement.status
                      )}`}
                    >
                      {requirement.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(requirement.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => viewDetails(requirement)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => openStatusModal(requirement)}
                        className="text-green-600 hover:text-green-900"
                        title="Change Status"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => deleteRequirement(requirement._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete (Spam)"
                      >
                        🗑️
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
      {showDetailModal && selectedRequirement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedRequirement.title}
                </h3>
                <p className="text-sm text-gray-500 font-mono">
                  {selectedRequirement.reqId}
                </p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Company Info */}
              {selectedRequirement.company && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Company Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Company Name</p>
                      <p className="text-base font-medium">
                        {selectedRequirement.company.companyName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Owner Name</p>
                      <p className="text-base font-medium">
                        {selectedRequirement.company.ownerName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">GST Number</p>
                      <p className="text-base font-medium font-mono text-sm">
                        {selectedRequirement.company.gstNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Contact</p>
                      <p className="text-base font-medium">
                        {selectedRequirement.company.contactNumber}
                      </p>
                      <p className="text-xs text-gray-500">
                        {selectedRequirement.company.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Basic Info */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Basic Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Target Audience</p>
                    <p className="text-base font-medium">
                      {selectedRequirement.targetAudience}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusBadge(
                        selectedRequirement.status
                      )}`}
                    >
                      {selectedRequirement.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Created At</p>
                    <p className="text-base font-medium">
                      {formatDate(selectedRequirement.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Marketing Support</p>
                    <p className="text-base font-medium">
                      {selectedRequirement.marketingSupport
                        ? "✅ Yes"
                        : "❌ No"}
                    </p>
                  </div>
                </div>
              </div>

              {/* States & Towns */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Location
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">States</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedRequirement.states?.map((state, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                        >
                          {state}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Towns</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedRequirement.towns?.map((town, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded"
                        >
                          {town}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Support Options */}
              {selectedRequirement.supportOptions && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Support Options
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(selectedRequirement.supportOptions).map(
                      ([key, value]) => (
                        <div key={key} className="flex items-center gap-2">
                          <span
                            className={`${
                              value ? "text-green-600" : "text-gray-400"
                            }`}
                          >
                            {value ? "✅" : "❌"}
                          </span>
                          <span className="text-sm capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedRequirement.notes && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Notes
                  </h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
                    {selectedRequirement.notes}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4 pt-4 border-t">
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    openStatusModal(selectedRequirement);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Change Status
                </button>
                <button
                  onClick={() => {
                    deleteRequirement(selectedRequirement._id);
                    setShowDetailModal(false);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete (Spam)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Change Modal */}
      {showStatusModal && selectedRequirement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Change Status
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Changing status for: <strong>{selectedRequirement.title}</strong>
            </p>

            <div className="space-y-3 mb-6">
              {["OPEN", "CLOSED", "FULFILLED", "EXPIRED"].map((status) => (
                <label
                  key={status}
                  className="flex items-center cursor-pointer"
                >
                  <input
                    type="radio"
                    name="status"
                    value={status}
                    checked={newStatus === status}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="mr-3"
                  />
                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full border ${getStatusBadge(
                      status
                    )}`}
                  >
                    {status}
                  </span>
                </label>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={updateStatus}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Update Status
              </button>
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequirementMonitor;
