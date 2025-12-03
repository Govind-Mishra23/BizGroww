import React, { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import InputField from "../../components/InputField";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaBoxOpen,
  FaSave,
  FaTimes,
  FaCheckCircle,
} from "react-icons/fa";

const ProductPortfolio = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setFetching(true);
    try {
      const res = await axiosClient.get("/company");
      if (res.data && res.data.products) {
        setProducts(res.data.products);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      if (error.response && error.response.status === 401) {
        window.location.href = "/login";
      }
    } finally {
      setFetching(false);
    }
  };

  const addProduct = () => {
    const newProduct = {
      category: "",
      subCategory: "",
      quantityBand: "",
      brandName: "",
      multiBrandSupport: false,
      otherProduct: "",
    };
    setProducts([...products, newProduct]);
    setEditingIndex(products.length); // Automatically enter edit mode for new product
  };

  const removeProduct = (index) => {
    if (window.confirm("Are you sure you want to remove this product?")) {
      const newProducts = products.filter((_, i) => i !== index);
      setProducts(newProducts);
      if (editingIndex === index) setEditingIndex(null);
    }
  };

  const handleChange = (index, field, value) => {
    const newProducts = [...products];
    newProducts[index][field] = value;
    setProducts(newProducts);
  };

  const toggleEdit = (index) => {
    setEditingIndex(editingIndex === index ? null : index);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await axiosClient.post("/company", { products });
      // Show a temporary success message or toast here if you had one
      setEditingIndex(null); // Close all edit forms on save
      alert("Product Portfolio Saved Successfully!");
    } catch (error) {
      console.error("Error saving products:", error);
      alert("Error saving products");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Product Portfolio
          </h2>
          <p className="text-gray-500 mt-1">
            Manage your product offerings and details.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={addProduct}
            className="flex items-center px-4 py-2 bg-white text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors shadow-sm font-medium"
          >
            <FaPlus className="mr-2" /> Add Product
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md font-medium disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </span>
            ) : (
              <>
                <FaSave className="mr-2" /> Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {fetching ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-500 font-medium">
            Loading your portfolio...
          </p>
        </div>
      ) : (
        <>
          {products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-300">
              <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaBoxOpen className="text-4xl text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Products Added
              </h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Start building your portfolio by adding your first product. This
                helps buyers understand what you offer.
              </p>
              <button
                onClick={addProduct}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
              >
                <FaPlus className="mr-2" /> Add First Product
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-xl border transition-all duration-200 ${
                    editingIndex === index
                      ? "border-blue-500 ring-2 ring-blue-100 shadow-lg scale-[1.02] z-10"
                      : "border-gray-200 hover:border-blue-300 hover:shadow-md"
                  }`}
                >
                  {editingIndex === index ? (
                    // Edit Mode
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-blue-600">
                          Editing Product
                        </h3>
                        <button
                          onClick={() => toggleEdit(index)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <FaTimes />
                        </button>
                      </div>

                      <div className="space-y-4">
                        <InputField
                          label="Category"
                          value={product.category}
                          onChange={(e) =>
                            handleChange(index, "category", e.target.value)
                          }
                          placeholder="e.g. Electronics"
                          className="mb-0"
                        />
                        <InputField
                          label="Subcategory"
                          value={product.subCategory}
                          onChange={(e) =>
                            handleChange(index, "subCategory", e.target.value)
                          }
                          placeholder="e.g. Smartphones"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <InputField
                            label="Brand"
                            value={product.brandName}
                            onChange={(e) =>
                              handleChange(index, "brandName", e.target.value)
                            }
                            placeholder="Brand Name"
                          />
                          <InputField
                            label="Qty Band"
                            value={product.quantityBand}
                            onChange={(e) =>
                              handleChange(
                                index,
                                "quantityBand",
                                e.target.value
                              )
                            }
                            placeholder="e.g. 100+"
                          />
                        </div>

                        <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                          <input
                            type="checkbox"
                            id={`multi-${index}`}
                            checked={product.multiBrandSupport}
                            onChange={(e) =>
                              handleChange(
                                index,
                                "multiBrandSupport",
                                e.target.checked
                              )
                            }
                            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                          <label
                            htmlFor={`multi-${index}`}
                            className="ml-2 text-sm font-medium text-gray-700 cursor-pointer"
                          >
                            Multi-brand Support
                          </label>
                        </div>

                        <InputField
                          label="Other Details"
                          value={product.otherProduct}
                          onChange={(e) =>
                            handleChange(index, "otherProduct", e.target.value)
                          }
                          placeholder="Additional info..."
                        />

                        <div className="pt-2 flex justify-end">
                          <button
                            onClick={() => toggleEdit(index)}
                            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                          >
                            Done
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="p-6 flex flex-col h-full">
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                          <FaBoxOpen className="text-xl" />
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => toggleEdit(index)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => removeProduct(index)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {product.category || "Untitled Product"}
                      </h3>
                      <p className="text-sm text-gray-500 mb-4">
                        {product.subCategory || "No subcategory"}
                      </p>

                      <div className="space-y-2 mt-auto">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Brand:</span>
                          <span className="font-medium text-gray-900">
                            {product.brandName || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Quantity:</span>
                          <span className="font-medium text-gray-900">
                            {product.quantityBand || "N/A"}
                          </span>
                        </div>
                        {product.multiBrandSupport && (
                          <div className="pt-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <FaCheckCircle className="mr-1" /> Multi-brand
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Add New Card Button (Grid Item) */}
              <button
                onClick={addProduct}
                className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all group h-full min-h-[300px]"
              >
                <div className="p-4 bg-gray-100 rounded-full group-hover:bg-blue-100 transition-colors mb-4">
                  <FaPlus className="text-2xl text-gray-400 group-hover:text-blue-500" />
                </div>
                <span className="font-medium text-gray-500 group-hover:text-blue-600">
                  Add Another Product
                </span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductPortfolio;
