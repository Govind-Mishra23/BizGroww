import React, { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import {
  FaBuilding,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaMapMarkerAlt,
  FaIndustry,
  FaFileAlt,
  FaImages,
  FaUserTie,
  FaCalendarAlt,
  FaIdCard,
} from "react-icons/fa";

const CompanyProfilePreview = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosClient.get("/company");
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));

        if (res.data) {
          if (userInfo && res.data.user && res.data.user !== userInfo._id) {
            console.error("Profile mismatch! Fetching profile for wrong user.");
            setProfile(null);
            return;
          }
          setProfile(res.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (!profile)
    return (
      <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
        <FaBuilding className="mx-auto h-12 w-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">No Profile Found</h3>
        <p className="text-gray-500 mt-2">
          Please complete your company profile to see the preview.
        </p>
      </div>
    );

  // Helper to check if a section has any data
  const hasData = (dataObj) => {
    if (!dataObj) return false;
    return Object.values(dataObj).some(
      (val) => val && val !== "" && (!Array.isArray(val) || val.length > 0)
    );
  };

  const Field = ({ label, value, icon: Icon, fullWidth = false }) => {
    if (!value) return null;
    return (
      <div
        className={`${
          fullWidth ? "col-span-1 md:col-span-2" : ""
        } flex items-start p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200`}
      >
        {Icon && (
          <div className="flex-shrink-0 mr-4 mt-1">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <Icon size={16} />
            </div>
          </div>
        )}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            {label}
          </p>
          <p className="text-sm font-medium text-gray-900 break-words">
            {value}
          </p>
        </div>
      </div>
    );
  };

  const Section = ({ title, icon: Icon, children, isVisible = true }) => {
    if (!isVisible) return null;
    // Check if children array has any non-null elements
    const hasContent = React.Children.toArray(children).some(
      (child) => child && child.type !== React.Fragment
    );
    if (!hasContent) return null;

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
          {Icon && <Icon className="text-blue-600" size={18} />}
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {children}
          </div>
        </div>
      </div>
    );
  };

  // Check visibility for sections
  const showManufacturing =
    profile.manufacturingUnit && hasData(profile.manufacturingUnit);
  const showBranches = profile.branches && profile.branches.length > 0;
  const showCertificates =
    profile.certificates && hasData(profile.certificates);
  const showGallery = profile.gallery && hasData(profile.gallery);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="bg-white p-2 rounded-xl shadow-lg">
              <div className="h-24 w-24 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 text-3xl font-bold border border-blue-100">
                {profile.companyName?.charAt(0) || <FaBuilding />}
              </div>
            </div>
            <div className="flex gap-2 mb-2">
              {profile.businessModel?.map((model, idx) => (
                <span
                  key={idx}
                  className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold border border-blue-100 shadow-sm"
                >
                  {model}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {profile.companyName}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              {profile.industry && (
                <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-md">
                  <FaIndustry className="text-gray-500" /> {profile.industry}
                </span>
              )}
              {profile.companyType && (
                <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-md">
                  <FaBuilding className="text-gray-500" /> {profile.companyType}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Company Details */}
      <Section title="Company Overview" icon={FaBuilding}>
        <Field label="Owner Name" value={profile.ownerName} icon={FaUserTie} />
        <Field
          label="Incorporation Year"
          value={profile.incorporationYear}
          icon={FaCalendarAlt}
        />
        <Field label="GST Number" value={profile.gstNumber} icon={FaIdCard} />
        <Field label="Website" value={profile.website} icon={FaGlobe} />
      </Section>

      {/* Contact & Head Office */}
      <Section title="Contact & Head Office" icon={FaMapMarkerAlt}>
        <Field
          label="Contact Number"
          value={profile.contactNumber}
          icon={FaPhone}
        />
        <Field label="Email Address" value={profile.email} icon={FaEnvelope} />

        {profile.headOffice && (
          <>
            <div className="col-span-1 md:col-span-2 border-t border-gray-100 my-2"></div>
            <Field
              label="Address"
              value={profile.headOffice.address}
              icon={FaMapMarkerAlt}
              fullWidth
            />
            <Field label="City/Town" value={profile.headOffice.town} />
            <Field label="State" value={profile.headOffice.state} />
            <Field label="Country" value={profile.headOffice.country} />
          </>
        )}
      </Section>

      {/* Manufacturing Unit */}
      <Section
        title="Manufacturing Unit"
        icon={FaIndustry}
        isVisible={showManufacturing}
      >
        <Field
          label="Address"
          value={profile.manufacturingUnit?.address}
          icon={FaMapMarkerAlt}
          fullWidth
        />
        <Field label="City/Town" value={profile.manufacturingUnit?.town} />
        <Field label="State" value={profile.manufacturingUnit?.state} />
        <Field label="Country" value={profile.manufacturingUnit?.country} />
      </Section>

      {/* Branches */}
      {showBranches && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
            <FaMapMarkerAlt className="text-blue-600" size={18} />
            <h3 className="text-lg font-bold text-gray-800">
              Branches ({profile.branches.length})
            </h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {profile.branches.map((branch, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded">
                    #{index + 1}
                  </span>
                  <h4 className="font-semibold text-gray-800">
                    {branch.town}, {branch.state}
                  </h4>
                </div>
                <div className="space-y-2 text-sm">
                  {branch.address && (
                    <p className="text-gray-600 flex gap-2">
                      <FaMapMarkerAlt className="mt-1 flex-shrink-0 text-gray-400" />{" "}
                      {branch.address}
                    </p>
                  )}
                  {branch.contact && (
                    <p className="text-gray-600 flex gap-2">
                      <FaPhone className="mt-1 flex-shrink-0 text-gray-400" />{" "}
                      {branch.contact}
                    </p>
                  )}
                  <p className="text-gray-500 pl-6">{branch.country}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certificates */}
      {showCertificates && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
            <FaFileAlt className="text-blue-600" size={18} />
            <h3 className="text-lg font-bold text-gray-800">
              Certificates & Documents
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(profile.certificates).map(([key, value]) => {
                if (!value || (Array.isArray(value) && value.length === 0))
                  return null;
                const label = key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase());

                const renderDocCard = (url, title, idx) => (
                  <a
                    key={idx}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                  >
                    <div className="p-3 bg-red-50 text-red-500 rounded-lg group-hover:bg-white group-hover:text-red-600 transition-colors">
                      <FaFileAlt size={20} />
                    </div>
                    <div className="ml-3 overflow-hidden">
                      <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-blue-700">
                        {title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Click to view
                      </p>
                    </div>
                  </a>
                );

                if (Array.isArray(value)) {
                  return value.map((url, idx) =>
                    renderDocCard(url, `${label} ${idx + 1}`, `${key}-${idx}`)
                  );
                }
                return renderDocCard(value, label, key);
              })}
            </div>
          </div>
        </div>
      )}

      {/* Gallery */}
      {showGallery && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
            <FaImages className="text-blue-600" size={18} />
            <h3 className="text-lg font-bold text-gray-800">Company Gallery</h3>
          </div>
          <div className="p-6 space-y-8">
            {Object.entries(profile.gallery).map(([key, images]) => {
              if (!images || images.length === 0) return null;
              const label = key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase());
              return (
                <div key={key}>
                  <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    {label}
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((url, idx) => (
                      <div
                        key={idx}
                        className="group relative aspect-w-16 aspect-h-12 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <img
                          src={
                            url.includes("cloudinary.com")
                              ? url.replace(
                                  "/upload/",
                                  "/upload/w_300,h_300,c_fill,f_auto,q_auto,fl_strip_profile/"
                                )
                              : url
                          }
                          alt={`${label} ${idx + 1}`}
                          crossOrigin="anonymous"
                          className="object-cover w-full h-48 transform group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://via.placeholder.com/400x300?text=Image+Not+Found";
                          }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-200"></div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyProfilePreview;
