import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  FaUsers,
  FaClipboardList,
  FaBox,
  FaImages,
  FaCertificate,
} from "react-icons/fa";

const AdminLayout = ({ children }) => {
  const navLinks = [
    {
      to: "/admin/manufacturers",
      label: "Manufacturers",
      icon: FaUsers,
      color: "blue",
    },
    {
      to: "/admin/requirements",
      label: "Requirement Posts",
      icon: FaClipboardList,
      color: "green",
    },
    {
      to: "/admin/products",
      label: "Product Portfolio",
      icon: FaBox,
      color: "purple",
    },
    {
      to: "/admin/gallery",
      label: "Gallery Monitor",
      icon: FaImages,
      color: "yellow",
    },
    {
      to: "/admin/certificates",
      label: "Certificates",
      icon: FaCertificate,
      color: "red",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navbar */}
      <nav className="bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-white">
                  🛡️ Admin Panel
                </span>
              </div>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      className={({ isActive }) =>
                        `inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          isActive
                            ? "bg-gray-700 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white"
                        }`
                      }
                    >
                      <Icon className="mr-2" />
                      {link.label}
                    </NavLink>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-sm text-gray-300 bg-gray-700 px-3 py-1 rounded-full">
                  👤 Admin User
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
};

export default AdminLayout;
