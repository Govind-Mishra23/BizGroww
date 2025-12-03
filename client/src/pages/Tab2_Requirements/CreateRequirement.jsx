import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import InputField from "../../components/InputField";
import MultiSelect from "../../components/MultiSelect";
import TagInput from "../../components/TagInput";

const CreateRequirement = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get ID from URL if editing
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [companyId, setCompanyId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    targetAudience: "Distributor",
    states: [],
    towns: [],
    marketingSupport: false,
    supportOptions: {
      marketingTeam: false,
      branding: false,
      influencerMeets: false,
      gifts: false,
      schemes: false,
      stockSupport: false,
    },
    notes: "",
    status: "OPEN",
  });

  // Full list of Indian States and UTs
  const stateOptions = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
  ];

  useEffect(() => {
    // Fetch company profile to get company ID
    fetchCompanyProfile();
    if (isEditMode) {
      fetchRequirement();
    }
  }, [id]);

  const fetchCompanyProfile = async () => {
    try {
      const res = await axiosClient.get("/company");
      if (res.data && res.data._id) {
        setCompanyId(res.data._id);
      }
    } catch (error) {
      console.error("Error fetching company profile:", error);
    }
  };

  const fetchRequirement = async () => {
    try {
      const res = await axiosClient.get(`/requirements/${id}`);
      // Merge fetched data with default structure to ensure all fields exist
      setFormData((prev) => ({
        ...prev,
        ...res.data,
        supportOptions: {
          ...prev.supportOptions,
          ...(res.data.supportOptions || {}),
        },
      }));
    } catch (error) {
      console.error("Error fetching requirement:", error);
      alert("Error loading requirement details");
      navigate("/manufacturer/requirements");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSupportOptionChange = (option) => {
    setFormData({
      ...formData,
      supportOptions: {
        ...formData.supportOptions,
        [option]: !formData.supportOptions[option],
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      // Backend will automatically attach company from authenticated user
      const dataToSend = { ...formData };

      if (isEditMode) {
        await axiosClient.put(`/requirements/${id}`, dataToSend);
      } else {
        await axiosClient.post("/requirements", dataToSend);
      }
      navigate("/manufacturer/requirements");
    } catch (error) {
      console.error(
        "Error saving requirement:",
        error.response?.data || error.message
      );
      alert(
        `Error: ${error.response?.data?.message || "Something went wrong"}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {isEditMode ? "Edit Requirement Post" : "Create Requirement Post"}
      </h2>

      <form onSubmit={handleSubmit}>
        <InputField
          label="Requirement Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Need Retail Partners for New Product Launch"
        />

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Target Audience
          </label>
          <select
            name="targetAudience"
            value={formData.targetAudience}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="Distributor">Distributor</option>
            <option value="Retailer">Retailer</option>
            <option value="Both">Both</option>
          </select>
        </div>

        <MultiSelect
          label="States"
          options={stateOptions}
          selected={formData.states}
          onChange={(val) => setFormData({ ...formData, states: val })}
          placeholder="Select States"
        />

        <TagInput
          label="Towns / Cities"
          tags={formData.towns}
          onChange={(val) => setFormData({ ...formData, towns: val })}
          placeholder="Type city name"
        />

        <div className="mb-6 p-4 bg-gray-50 rounded-md border border-gray-100">
          <label className="flex items-center space-x-2 cursor-pointer mb-4">
            <input
              type="checkbox"
              name="marketingSupport"
              checked={formData.marketingSupport}
              onChange={handleChange}
              className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="font-medium text-gray-900">
              Marketing Support Provided?
            </span>
          </label>

          {formData.marketingSupport && (
            <div className="grid grid-cols-2 gap-3 ml-7 animate-fade-in">
              {Object.keys(formData.supportOptions).map((key) => (
                <label
                  key={key}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.supportOptions[key]}
                    onChange={() => handleSupportOptionChange(key)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes / Additional Details
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            placeholder="Any specific requirements or details..."
          ></textarea>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="OPEN">OPEN</option>
            <option value="CLOSED">CLOSED</option>
            <option value="FULFILLED">FULFILLED</option>
            <option value="EXPIRED">EXPIRED</option>
          </select>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate("/manufacturer/requirements")}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : isEditMode
                ? "Update Requirement"
                : "Post Requirement"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRequirement;
