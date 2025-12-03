import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import StatusBadge from "../../components/StatusBadge";
import RolePreviewToggle from "../../components/RolePreviewToggle";
import { FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";

const RequirementsList = () => {
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("Manufacturer"); // Default role

  useEffect(() => {
    fetchRequirements();
  }, []);

  const fetchRequirements = async () => {
    try {
      // Use the new endpoint to get only the logged-in user's requirements
      const res = await axiosClient.get("/requirements/my-requirements");
      setRequirements(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this requirement?")) {
      try {
        await axiosClient.delete(`/requirements/${id}`);
        setRequirements(requirements.filter((req) => req._id !== id));
      } catch (error) {
        alert("Error deleting requirement");
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Distributor Requirements
        </h2>

        <div className="flex items-center gap-4">
          <RolePreviewToggle role={role} setRole={setRole} />

          {role === "Manufacturer" && (
            <Link
              to="/manufacturer/requirements/create"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <FaPlus className="mr-2" /> Post Requirement
            </Link>
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : requirements.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500 mb-4">No requirements posted yet.</p>
          {role === "Manufacturer" && (
            <Link
              to="/manufacturer/requirements/create"
              className="text-blue-600 hover:underline"
            >
              Create your first post
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requirements.map((req) => (
            <div
              key={req._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="p-5 flex-grow">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-mono text-gray-400">
                    {req.reqId}
                  </span>
                  <StatusBadge status={req.status} />
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                  {req.title}
                </h3>

                <div className="text-sm text-gray-600 mb-4 space-y-1">
                  <p>
                    <span className="font-medium">Target:</span>{" "}
                    {req.targetAudience}
                  </p>
                  <p>
                    <span className="font-medium">Locations:</span>{" "}
                    {req.states.length} States, {req.towns.length} Towns
                  </p>
                  {req.marketingSupport && (
                    <p className="text-green-600 text-xs font-semibold mt-2">
                      ✓ Marketing Support Available
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex justify-between items-center rounded-b-lg">
                <Link
                  to={`/manufacturer/requirements/${req._id}`}
                  className="text-sm text-gray-600 hover:text-blue-600 font-medium flex items-center"
                >
                  <FaEye className="mr-1" /> View Details
                </Link>

                {role === "Manufacturer" && (
                  <div className="flex space-x-3">
                    <Link
                      to={`/manufacturer/requirements/edit/${req._id}`}
                      className="text-gray-400 hover:text-blue-600"
                      title="Edit"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      onClick={() => handleDelete(req._id)}
                      className="text-gray-400 hover:text-red-600"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RequirementsList;
