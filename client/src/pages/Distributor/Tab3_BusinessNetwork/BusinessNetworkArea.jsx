import React, { useState, useEffect } from "react";
import axiosClient from "../../../api/axiosClient";
import InputField from "../../../components/InputField";

const BusinessNetworkArea = () => {
  const [geographicCoverage, setGeographicCoverage] = useState({
    country: "India",
    states: [],
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Temporary state for adding new locations
  const [newState, setNewState] = useState("");
  const [newDistrict, setNewDistrict] = useState("");
  const [selectedStateIndex, setSelectedStateIndex] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axiosClient.get(`/company?_=${new Date().getTime()}`);
      if (res.data && res.data.geographicCoverage) {
        setGeographicCoverage(res.data.geographicCoverage);
      }
    } catch (error) {
      console.log("Error fetching profile:", error);
    }
  };

  const handleAddState = () => {
    if (newState.trim()) {
      setGeographicCoverage({
        ...geographicCoverage,
        states: [
          ...geographicCoverage.states,
          { state: newState.trim(), districts: [] },
        ],
      });
      setNewState("");
    }
  };

  const handleRemoveState = (index) => {
    const updatedStates = geographicCoverage.states.filter(
      (_, i) => i !== index
    );
    setGeographicCoverage({ ...geographicCoverage, states: updatedStates });
    if (selectedStateIndex === index) setSelectedStateIndex(null);
  };

  const handleAddDistrict = (stateIndex) => {
    if (newDistrict.trim()) {
      const updatedStates = [...geographicCoverage.states];
      updatedStates[stateIndex].districts.push(newDistrict.trim());
      setGeographicCoverage({ ...geographicCoverage, states: updatedStates });
      setNewDistrict("");
    }
  };

  const handleRemoveDistrict = (stateIndex, districtIndex) => {
    const updatedStates = [...geographicCoverage.states];
    updatedStates[stateIndex].districts = updatedStates[
      stateIndex
    ].districts.filter((_, i) => i !== districtIndex);
    setGeographicCoverage({ ...geographicCoverage, states: updatedStates });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      // We need to send the full profile update, but here we only update geographicCoverage
      // Ideally, we should fetch the full profile first, merge, and save.
      // Or the backend should support partial updates (PATCH).
      // Assuming the backend handles partial updates or we merge with existing data.
      // For now, let's fetch current data again to be safe, or just send what we have if backend supports it.
      // Based on CompanyProfileForm, it sends the whole object. Let's try to send just this field if backend supports partial,
      // otherwise we might overwrite other fields with nulls if we are not careful.
      // To be safe, let's fetch the full profile, update this field, and save back.

      const res = await axiosClient.get("/company");
      const fullProfile = res.data;

      const updatedProfile = {
        ...fullProfile,
        geographicCoverage: geographicCoverage,
      };

      await axiosClient.post("/company", updatedProfile);
      setMessage({
        type: "success",
        text: "Network area updated successfully!",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update network area",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Business Network Area
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Define your geographic coverage.
          </p>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 mb-4 rounded-md ${
            message.type === "success"
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-8 divide-y divide-gray-200"
      >
        <div className="pt-8">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <InputField
                label="Country"
                value={geographicCoverage.country}
                onChange={(e) =>
                  setGeographicCoverage({
                    ...geographicCoverage,
                    country: e.target.value,
                  })
                }
                disabled // Assuming fixed to India for now based on prompt example, but editable if needed
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              States Covered
            </label>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newState}
                onChange={(e) => setNewState(e.target.value)}
                placeholder="Enter state name (e.g. Maharashtra)"
                className="flex-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
              <button
                type="button"
                onClick={handleAddState}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Add State
              </button>
            </div>

            <div className="space-y-4">
              {geographicCoverage.states.map((stateObj, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
                >
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                    <h4 className="text-lg font-medium text-gray-900">
                      {stateObj.state}
                    </h4>
                    <button
                      type="button"
                      onClick={() => handleRemoveState(index)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Remove State
                    </button>
                  </div>
                  <div className="p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Districts / Towns
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {stateObj.districts.map((district, dIndex) => (
                        <span
                          key={dIndex}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                        >
                          {district}
                          <button
                            type="button"
                            onClick={() => handleRemoveDistrict(index, dIndex)}
                            className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-green-400 hover:bg-green-200 hover:text-green-500 focus:outline-none"
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={selectedStateIndex === index ? newDistrict : ""}
                        onChange={(e) => {
                          setSelectedStateIndex(index);
                          setNewDistrict(e.target.value);
                        }}
                        placeholder="Add district/town"
                        className="flex-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddDistrict(index)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-5">
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Network Area"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BusinessNetworkArea;
