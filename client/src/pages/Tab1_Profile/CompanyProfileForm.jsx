import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../../components/InputField";
import axiosClient from "../../api/axiosClient";
import Gallery from "../Tab4_Gallery/Gallery";
import Certificates from "../Tab5_Certificates/Certificates";

const CompanyProfileForm = () => {
  const initialState = {
    companyName: "",
    industry: "",
    businessModel: [],
    companyType: "Pvt Ltd",
    incorporationYear: "",
    gstNumber: "",
    ownerName: "",
    contactNumber: "",
    email: "",
    website: "",
    headOffice: { country: "India", state: "", town: "", address: "" },
    manufacturingUnit: { country: "India", state: "", town: "", address: "" },
    branches: [],
  };

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      // Add timestamp to prevent caching
      const res = await axiosClient.get(`/company?_=${new Date().getTime()}`);

      if (res.data) {
        // CRITICAL SECURITY CHECK: Verify this profile belongs to logged-in user
        // Backend now returns _userId field for verification
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

        // Fallback to old 'user' field if _userId not present
        if (
          userInfo &&
          res.data.user &&
          !res.data._userId &&
          res.data.user !== userInfo._id
        ) {
          console.error("❌ SECURITY ALERT: Profile mismatch (legacy check)!");
          console.error("Expected user:", userInfo._id);
          console.error("Received profile for:", res.data.user);
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
          ...initialState, // Start with clean state
          ...res.data,
          // Ensure nested objects exist even if not in DB (legacy data support)
          headOffice: res.data.headOffice || {
            country: "India",
            state: "",
            town: "",
            address: "",
          },
          manufacturingUnit: res.data.manufacturingUnit || {
            country: "India",
            state: "",
            town: "",
            address: "",
          },
          branches: res.data.branches || [],
        });
      }
    } catch (error) {
      console.log("No profile found, creating new one.");
      setFormData(initialState); // Explicitly reset to initial state
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await axiosClient.post("/company", formData);
      setMessage({ type: "success", text: "Profile saved successfully!" });
      // Redirect to preview after short delay or immediately
      setTimeout(() => {
        navigate("/manufacturer/profile/preview");
      }, 1000);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Error saving profile",
      });
    } finally {
      setLoading(false);
    }
  };

  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h2>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium text-sm focus:outline-none ${
            activeTab === "general"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("general")}
        >
          General Info
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm focus:outline-none ${
            activeTab === "gallery"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("gallery")}
        >
          Gallery
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm focus:outline-none ${
            activeTab === "certificates"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("certificates")}
        >
          Certificates
        </button>
      </div>

      {activeTab === "general" && (
        <>
          {message && (
            <div
              className={`p-4 mb-6 rounded-md ${
                message.type === "success"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* 1. Company Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">
                1. Company Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Company Name"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                />
                <InputField
                  label="Industry/Sector"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  required
                />

                <div className="md:col-span-2 mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Model
                  </label>
                  <div className="flex space-x-4">
                    {["Manufacturer", "Outsourcing", "Importer"].map(
                      (model) => (
                        <label
                          key={model}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={formData.businessModel.includes(model)}
                            onChange={() => handleBusinessModelChange(model)}
                            className="rounded text-blue-600 focus:ring-blue-500"
                          />
                          <span>{model}</span>
                        </label>
                      )
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type of Company
                  </label>
                  <select
                    name="companyType"
                    value={formData.companyType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {[
                      "Proprietor",
                      "Partnership",
                      "LLP",
                      "Pvt Ltd",
                      "Public Ltd",
                    ].map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <InputField
                  label="Year of Incorporation"
                  name="incorporationYear"
                  value={formData.incorporationYear}
                  onChange={handleChange}
                  required
                />
                <InputField
                  label="GST Number"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  required
                  placeholder="15-digit GST"
                />
                <InputField
                  label="Owner Name"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  required
                />
                <InputField
                  label="Contact Number"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  required
                />
                <InputField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <InputField
                  label="Website (Optional)"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* 2. Address Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">
                2. Address Information
              </h3>

              {/* Head Office */}
              <div className="mb-6 bg-gray-50 p-4 rounded-md border border-gray-100">
                <h4 className="text-md font-medium text-blue-700 mb-3">
                  🟦 Registered / Head Office
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Country"
                    value={formData.headOffice.country}
                    onChange={(e) =>
                      handleNestedChange(
                        "headOffice",
                        "country",
                        e.target.value
                      )
                    }
                    required
                  />
                  <InputField
                    label="State"
                    value={formData.headOffice.state}
                    onChange={(e) =>
                      handleNestedChange("headOffice", "state", e.target.value)
                    }
                    required
                  />
                  <InputField
                    label="Town/City"
                    value={formData.headOffice.town}
                    onChange={(e) =>
                      handleNestedChange("headOffice", "town", e.target.value)
                    }
                    required
                  />
                  <div className="md:col-span-2">
                    <InputField
                      label="Full Address"
                      value={formData.headOffice.address}
                      onChange={(e) =>
                        handleNestedChange(
                          "headOffice",
                          "address",
                          e.target.value
                        )
                      }
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Manufacturing Unit */}
              <div className="mb-6 bg-gray-50 p-4 rounded-md border border-gray-100">
                <h4 className="text-md font-medium text-green-700 mb-3">
                  🟩 Manufacturing Unit Address
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Country"
                    value={formData.manufacturingUnit.country}
                    onChange={(e) =>
                      handleNestedChange(
                        "manufacturingUnit",
                        "country",
                        e.target.value
                      )
                    }
                  />
                  <InputField
                    label="State"
                    value={formData.manufacturingUnit.state}
                    onChange={(e) =>
                      handleNestedChange(
                        "manufacturingUnit",
                        "state",
                        e.target.value
                      )
                    }
                  />
                  <InputField
                    label="Town/City"
                    value={formData.manufacturingUnit.town}
                    onChange={(e) =>
                      handleNestedChange(
                        "manufacturingUnit",
                        "town",
                        e.target.value
                      )
                    }
                  />
                  <div className="md:col-span-2">
                    <InputField
                      label="Full Address"
                      value={formData.manufacturingUnit.address}
                      onChange={(e) =>
                        handleNestedChange(
                          "manufacturingUnit",
                          "address",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Branches */}
              <div className="mb-6 bg-gray-50 p-4 rounded-md border border-gray-100">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-md font-medium text-orange-700">
                    🟧 Branch Addresses
                  </h4>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        branches: [
                          ...formData.branches,
                          {
                            country: "India",
                            state: "",
                            town: "",
                            address: "",
                            contact: "",
                          },
                        ],
                      })
                    }
                    className="text-sm bg-orange-100 text-orange-700 px-3 py-1 rounded hover:bg-orange-200"
                  >
                    + Add Branch
                  </button>
                </div>

                {formData.branches.map((branch, index) => (
                  <div
                    key={index}
                    className="mb-4 p-3 bg-white border border-gray-200 rounded relative"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        const newBranches = formData.branches.filter(
                          (_, i) => i !== index
                        );
                        setFormData({ ...formData, branches: newBranches });
                      }}
                      className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xs"
                    >
                      Remove
                    </button>
                    <h5 className="text-xs font-bold text-gray-500 mb-2">
                      Branch #{index + 1}
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <InputField
                        label="Country"
                        value={branch.country}
                        onChange={(e) => {
                          const newBranches = [...formData.branches];
                          newBranches[index].country = e.target.value;
                          setFormData({ ...formData, branches: newBranches });
                        }}
                      />
                      <InputField
                        label="State"
                        value={branch.state}
                        onChange={(e) => {
                          const newBranches = [...formData.branches];
                          newBranches[index].state = e.target.value;
                          setFormData({ ...formData, branches: newBranches });
                        }}
                      />
                      <InputField
                        label="Town/City"
                        value={branch.town}
                        onChange={(e) => {
                          const newBranches = [...formData.branches];
                          newBranches[index].town = e.target.value;
                          setFormData({ ...formData, branches: newBranches });
                        }}
                      />
                      <InputField
                        label="Contact Details"
                        value={branch.contact}
                        onChange={(e) => {
                          const newBranches = [...formData.branches];
                          newBranches[index].contact = e.target.value;
                          setFormData({ ...formData, branches: newBranches });
                        }}
                      />
                      <div className="md:col-span-2">
                        <InputField
                          label="Full Address"
                          value={branch.address}
                          onChange={(e) => {
                            const newBranches = [...formData.branches];
                            newBranches[index].address = e.target.value;
                            setFormData({ ...formData, branches: newBranches });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {formData.branches.length === 0 && (
                  <p className="text-sm text-gray-400 italic text-center py-2">
                    No branches added.
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </form>
        </>
      )}

      {activeTab === "gallery" && <Gallery />}
      {activeTab === "certificates" && <Certificates />}
    </div>
  );
};

export default CompanyProfileForm;
