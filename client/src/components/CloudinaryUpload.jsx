import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  FaCloudUploadAlt,
  FaTrash,
  FaSpinner,
  FaCheckCircle,
  FaEdit,
  FaPlus,
} from "react-icons/fa";
import axios from "axios";

const CloudinaryUpload = ({
  label,
  onUpload,
  existingImages = [],
  multiple = false,
  resourceType = "image",
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState(existingImages);
  const [successMsg, setSuccessMsg] = useState("");

  // Sync with parent state if it changes (e.g. initial load)
  useEffect(() => {
    setUploadedFiles(existingImages);
  }, [existingImages]);

  const onDrop = async (acceptedFiles) => {
    setUploading(true);
    setSuccessMsg("");
    const newUrls = [];

    for (const file of acceptedFiles) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
      );
      formData.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

      try {
        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
          }/${resourceType}/upload`,
          formData
        );
        newUrls.push(res.data.secure_url);
        console.log(
          "Image uploaded successfully to Cloudinary:",
          res.data.secure_url
        );
      } catch (error) {
        console.error("Upload Error:", error);
        alert("Error uploading file");
      }
    }

    const updatedFiles = multiple ? [...uploadedFiles, ...newUrls] : newUrls;
    setUploadedFiles(updatedFiles);
    onUpload(updatedFiles);
    setUploading(false);
    setSuccessMsg("Images updated successfully!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const removeFile = (index) => {
    const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(updatedFiles);
    onUpload(updatedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept:
      resourceType === "image"
        ? { "image/*": [] }
        : { "application/pdf": [], "image/*": [] },
    multiple,
  });

  return (
    <div className="mb-6 bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-3">
        <label className="block text-sm font-bold text-gray-700 flex items-center">
          {label}
          {uploadedFiles.length > 0 && (
            <span className="ml-2 text-green-500 text-xs font-normal flex items-center bg-green-50 px-2 py-0.5 rounded-full">
              <FaCheckCircle className="mr-1" /> {uploadedFiles.length} file(s)
            </span>
          )}
        </label>
        {successMsg && (
          <span className="text-xs text-green-600 font-medium animate-fade-in-out">
            {successMsg}
          </span>
        )}
      </div>

      {/* Preview Section - Always visible if files exist */}
      {uploadedFiles.length > 0 && (
        <div className="mb-4 grid grid-cols-3 md:grid-cols-5 gap-3">
          {uploadedFiles.map((url, index) => (
            <div
              key={index}
              className="relative group border rounded-lg overflow-hidden bg-gray-50 aspect-square"
            >
              {resourceType === "image" ||
              url.match(/\.(jpeg|jpg|gif|png|webp|bmp)$/i) ? (
                <img
                  src={
                    url.includes("cloudinary.com")
                      ? url.replace(
                          "/upload/",
                          "/upload/w_300,h_300,c_fill,f_auto,q_auto,fl_strip_profile/"
                        )
                      : url
                  }
                  alt="Uploaded"
                  crossOrigin="anonymous"
                  className="h-full w-full object-cover bg-white"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/150?text=Error";
                  }}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-xs p-2 text-center break-all text-gray-500">
                  {url.split("/").pop().slice(-10)}
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all hover:bg-red-600"
                  title="Remove Image"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
        }`}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <div className="flex flex-col items-center text-blue-600 py-2">
            <FaSpinner className="animate-spin text-2xl mb-2" />
            <p className="text-sm font-medium">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-gray-500 py-2">
            {uploadedFiles.length > 0 ? (
              <>
                <FaPlus className="text-2xl mb-2 text-blue-500" />
                <p className="text-sm">Click or drag to add more images</p>
              </>
            ) : (
              <>
                <FaCloudUploadAlt className="text-3xl mb-2 text-gray-400" />
                <p className="text-sm font-medium text-gray-700">
                  Upload {label}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Drag & drop or click to browse
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CloudinaryUpload;
