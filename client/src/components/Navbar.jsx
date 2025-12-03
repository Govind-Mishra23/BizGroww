import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const userInfoStr = localStorage.getItem("userInfo");
  const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;
  const role = userInfo ? userInfo.role : null;

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("businessModel");
    navigate("/");
  };

  let navLinks = [];

  if (role === "manufacturer") {
    navLinks = [
      { to: "/manufacturer/home", label: "Home", color: "blue" },
      { to: "/manufacturer/profile", label: "Edit Profile", color: "blue" },
      {
        to: "/manufacturer/profile/preview",
        label: "Profile Preview",
        color: "blue",
      },
      {
        to: "/manufacturer/requirements",
        label: "Distributor Requirements",
        color: "orange",
      },
      { to: "/manufacturer/products", label: "Products", color: "green" },
    ];
  } else if (role === "distributor") {
    navLinks = [
      { to: "/distributor/home", label: "Home", color: "blue" },
      { to: "/distributor/profile", label: "Profile", color: "blue" },
      { to: "/distributor/products", label: "Products", color: "green" },
      {
        to: "/distributor/network-area",
        label: "Network Area",
        color: "orange",
      },
      {
        to: "/distributor/network-details",
        label: "Network Details",
        color: "purple",
      },
    ];
  } else if (role === "retailer") {
    navLinks = [
      { to: "/retailer/home", label: "Home", color: "blue" },
      { to: "/retailer/profile", label: "Profile", color: "yellow" },
      { to: "/retailer/products", label: "Products", color: "green" },
      {
        to: "/retailer/network-details",
        label: "Network Details",
        color: "purple",
      },
    ];
  } else if (role === "candidate") {
    navLinks = [
      { to: "/candidate/home", label: "Home", color: "blue" },
      { to: "/jobs", label: "Browse Jobs", color: "purple" }, // Placeholder
    ];
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div
              className="flex-shrink-0 flex items-center cursor-pointer"
              onClick={() => navigate("/")}
            >
              <span className="text-xl font-bold text-blue-600">ReqModule</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) => {
                    const baseClasses =
                      "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium";
                    const activeClasses = isActive
                      ? `border-${link.color}-500 text-gray-900`
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700";
                    return `${baseClasses} ${activeClasses}`;
                  }}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center space-x-4">
              {/* <span className="text-sm text-gray-500 capitalize">Welcome, {role}</span> */}
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
