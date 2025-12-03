import React, { useState, useEffect } from "react";
import axiosClient from "../../../api/axiosClient";

const NetworkDetails = () => {
  const [networkDetails, setNetworkDetails] = useState({
    distributorNetwork: "",
    influencerNetwork: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const bands = ["0–50", "50–100", "100–200", "200–300", "300 & Above"];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axiosClient.get(`/company?_=${new Date().getTime()}`);
      if (res.data && res.data.networkDetails) {
        setNetworkDetails(res.data.networkDetails);
      }
    } catch (error) {
      console.log("Error fetching profile:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNetworkDetails({ ...networkDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await axiosClient.get("/company");
      const fullProfile = res.data;

      const updatedProfile = {
        ...fullProfile,
        networkDetails: networkDetails,
      };

      await axiosClient.post("/company", updatedProfile);
      setMessage({
        type: "success",
        text: "Network details updated successfully!",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.message || "Failed to update network details",
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
            Network Details
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Provide details about your distribution and influencer network.
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
            {/* Distributor Network */}
            <div className="sm:col-span-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. Distributor Network (Number of distributors/dealers you
                supply to)
              </label>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {bands.map((band) => (
                  <div key={band} className="flex items-center">
                    <input
                      id={`distributor-${band}`}
                      name="distributorNetwork"
                      type="radio"
                      value={band}
                      checked={networkDetails.distributorNetwork === band}
                      onChange={handleChange}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                    />
                    <label
                      htmlFor={`distributor-${band}`}
                      className="ml-3 block text-sm font-medium text-gray-700"
                    >
                      {band}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Influencer Network */}
            <div className="sm:col-span-6 pt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                2. Influencer Network (Number of influencers you work with —
                carpenters/electricians/plumbers etc.)
              </label>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {bands.map((band) => (
                  <div key={band} className="flex items-center">
                    <input
                      id={`influencer-${band}`}
                      name="influencerNetwork"
                      type="radio"
                      value={band}
                      checked={networkDetails.influencerNetwork === band}
                      onChange={handleChange}
                      className="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300"
                    />
                    <label
                      htmlFor={`influencer-${band}`}
                      className="ml-3 block text-sm font-medium text-gray-700"
                    >
                      {band}
                    </label>
                  </div>
                ))}
              </div>
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
              {loading ? "Saving..." : "Save Network Details"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NetworkDetails;
