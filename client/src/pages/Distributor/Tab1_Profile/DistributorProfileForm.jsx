import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../../../components/InputField";
import axiosClient from "../../../api/axiosClient";

const DistributorProfileForm = () => {
  const initialState = {
    companyName: "",
    industry: "",
    businessModel: [],
    companyType: "Proprietor",
    incorporationYear: "",
    gstNumber: "",
    ownerName: "",
    otherDirectors: [],
    contactNumber: "",
    email: "",
    website: "",
    headOffice: { country: "India", state: "", town: "", address: "" },
    branches: [],
  };

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [newDirector, setNewDirector] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const res = await axiosClient.get(`/company?_=${new Date().getTime()}`);

      if (res.data) {
        // CRITICAL SECURITY CHECK: Verify this profile belongs to logged-in user
        if (userInfo && res.data._userId && res.data._userId !== userInfo._id) {
          console.error("❌ SECURITY ALERT: Profile mismatch!");
          console.error("Expected user:", userInfo._id);
          console.error("Received profile for:", res.data._userId);
          setMessage({
            type: "error",
            text: "Security error: Profile data mismatch",
          });
          setFormData(initialState);
          return;
        }

        console.log(
          "✅ Profile verified for user:",
          res.data._userEmail || userInfo.email
        );

        setFormData({
          ...initialState,
          ...res.data,
          headOffice: res.data.headOffice || initialState.headOffice,
          branches: res.data.branches || [],
          otherDirectors: res.data.otherDirectors || [],
        });
      }
    } catch (error) {
      console.log("No profile found, creating new one.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNestedChange = (section, field, value) => {
    setFormData({
      ...formData,
      [section]: { ...formData[section], [field]: value },
    });
  };

  const handleBusinessModelChange = (model) => {
    const currentModels = formData.businessModel;
    const newModels = currentModels.includes(model)
      ? currentModels.filter((m) => m !== model)
      : [...currentModels, model];
    setFormData({ ...formData, businessModel: newModels });
  };

  const handleAddDirector = () => {
    if (newDirector.trim()) {
      setFormData({
        ...formData,
        otherDirectors: [...formData.otherDirectors, newDirector.trim()],
      });
      setNewDirector("");
    }
  };

  const handleRemoveDirector = (index) => {
    const updatedDirectors = formData.otherDirectors.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, otherDirectors: updatedDirectors });
  };

  const handleAddBranch = () => {
    setFormData({
      ...formData,
      branches: [
        ...formData.branches,
        { country: "India", state: "", town: "", address: "", contact: "" },
      ],
    });
  };

  const handleBranchChange = (index, field, value) => {
    const updatedBranches = formData.branches.map((branch, i) =>
      i === index ? { ...branch, [field]: value } : branch
    );
    setFormData({ ...formData, branches: updatedBranches });
  };

  const handleRemoveBranch = (index) => {
    const updatedBranches = formData.branches.filter((_, i) => i !== index);
    setFormData({ ...formData, branches: updatedBranches });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await axiosClient.post("/company", formData);
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update profile",
      });
    } finally {
      setLoading(false);
    }
  };

  const businessModels = [
    "Distributor",
    "Supplier",
    "Dealer",
    "C&F",
    "OEM",
    "Showroom",
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Distributor Profile
          </h2>
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
        <div className="space-y-8 divide-y divide-gray-200">
          {/* Basic Information */}
          <div className="pt-8">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Basic Information
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                General information about your distribution business.
              </p>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <InputField
                  label="Firm Name"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="sm:col-span-3">
                <InputField
                  label="Industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                />
              </div>

              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Model (Select all that apply)
                </label>
                <div className="flex flex-wrap gap-2">
                  {businessModels.map((model) => (
                    <button
                      key={model}
                      type="button"
                      onClick={() => handleBusinessModelChange(model)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border ${
                        formData.businessModel.includes(model)
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {model}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">
                  Type of Company
                </label>
                <select
                  name="companyType"
                  value={formData.companyType}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option>Proprietor</option>
                  <option>Partnership</option>
                  <option>LLP</option>
                  <option>Pvt Ltd</option>
                  <option>Public Ltd</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <InputField
                  label="Year of Incorporation"
                  name="incorporationYear"
                  value={formData.incorporationYear}
                  onChange={handleChange}
                />
              </div>

              <div className="sm:col-span-3">
                <InputField
                  label="GST Number"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleChange}
                />
              </div>

              <div className="sm:col-span-3">
                <InputField
                  label="Owner Name"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                />
              </div>

              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700">
                  Other Directors
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    value={newDirector}
                    onChange={(e) => setNewDirector(e.target.value)}
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300"
                    placeholder="Enter director name"
                  />
                  <button
                    type="button"
                    onClick={handleAddDirector}
                    className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 text-sm hover:bg-gray-100"
                  >
                    Add
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.otherDirectors.map((director, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {director}
                      <button
                        type="button"
                        onClick={() => handleRemoveDirector(index)}
                        className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                      >
                        <span className="sr-only">Remove {director}</span>
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="pt-8">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Contact Details
              </h3>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <InputField
                  label="Contact Number"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                />
              </div>

              <div className="sm:col-span-3">
                <InputField
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                />
              </div>

              <div className="sm:col-span-6">
                <InputField
                  label="Website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Registered Address */}
          <div className="pt-8">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Registered Address
              </h3>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <InputField
                  label="Country"
                  value={formData.headOffice.country}
                  onChange={(e) =>
                    handleNestedChange("headOffice", "country", e.target.value)
                  }
                />
              </div>
              <div className="sm:col-span-3">
                <InputField
                  label="State"
                  value={formData.headOffice.state}
                  onChange={(e) =>
                    handleNestedChange("headOffice", "state", e.target.value)
                  }
                />
              </div>
              <div className="sm:col-span-3">
                <InputField
                  label="Town/City"
                  value={formData.headOffice.town}
                  onChange={(e) =>
                    handleNestedChange("headOffice", "town", e.target.value)
                  }
                />
              </div>
              <div className="sm:col-span-6">
                <InputField
                  label="Address"
                  value={formData.headOffice.address}
                  onChange={(e) =>
                    handleNestedChange("headOffice", "address", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* Branches */}
          <div className="pt-8">
            <div className="flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Branches
              </h3>
              <button
                type="button"
                onClick={handleAddBranch}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Branch
              </button>
            </div>
            <div className="mt-6 space-y-6">
              {formData.branches.map((branch, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative"
                >
                  <button
                    type="button"
                    onClick={() => handleRemoveBranch(index)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                  >
                    <span className="sr-only">Remove branch</span>
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <InputField
                        label="State"
                        value={branch.state}
                        onChange={(e) =>
                          handleBranchChange(index, "state", e.target.value)
                        }
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <InputField
                        label="Town/City"
                        value={branch.town}
                        onChange={(e) =>
                          handleBranchChange(index, "town", e.target.value)
                        }
                      />
                    </div>
                    <div className="sm:col-span-6">
                      <InputField
                        label="Address"
                        value={branch.address}
                        onChange={(e) =>
                          handleBranchChange(index, "address", e.target.value)
                        }
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <InputField
                        label="Contact Person/Number"
                        value={branch.contact}
                        onChange={(e) =>
                          handleBranchChange(index, "contact", e.target.value)
                        }
                      />
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
              {loading ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DistributorProfileForm;
