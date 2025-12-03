import React, { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import CloudinaryUpload from "../../components/CloudinaryUpload";

const Gallery = () => {
  const [gallery, setGallery] = useState({
    factory: [],
    machinery: [],
    offices: [],
    warehouse: [],
    products: [],
    events: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axiosClient.get("/company");
      if (res.data && res.data.gallery) {
        // Merge with default structure to ensure all keys exist
        setGallery({ ...gallery, ...res.data.gallery });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleUpload = (section, urls) => {
    setGallery({ ...gallery, [section]: urls });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await axiosClient.post("/company", { gallery });
      alert("Gallery Saved Successfully!");
    } catch (error) {
      console.error("Error saving gallery:", error);
      alert("Error saving gallery");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Company Gallery</h2>
      <p className="text-gray-500 mb-8 text-sm">
        Upload images for your company facilities and events.
      </p>

      <div className="space-y-8">
        <CloudinaryUpload
          label="Factory Images"
          existingImages={gallery.factory}
          onUpload={(urls) => handleUpload("factory", urls)}
          multiple
        />
        <CloudinaryUpload
          label="Machinery Images"
          existingImages={gallery.machinery}
          onUpload={(urls) => handleUpload("machinery", urls)}
          multiple
        />
        <CloudinaryUpload
          label="Office Images"
          existingImages={gallery.offices}
          onUpload={(urls) => handleUpload("offices", urls)}
          multiple
        />
        <CloudinaryUpload
          label="Warehouse Images"
          existingImages={gallery.warehouse}
          onUpload={(urls) => handleUpload("warehouse", urls)}
          multiple
        />
        <CloudinaryUpload
          label="Product Images"
          existingImages={gallery.products}
          onUpload={(urls) => handleUpload("products", urls)}
          multiple
        />
        <CloudinaryUpload
          label="Events / Exhibitions"
          existingImages={gallery.events}
          onUpload={(urls) => handleUpload("events", urls)}
          multiple
        />
      </div>

      <div className="mt-8 flex flex-col items-end">
        <p className="text-sm text-gray-500 mb-2">
          Make sure to save your changes after uploading or deleting images.
        </p>
        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Gallery"}
        </button>
      </div>
    </div>
  );
};

export default Gallery;
