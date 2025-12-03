import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import CompanyProfileForm from "./pages/Tab1_Profile/CompanyProfileForm";
import CompanyProfilePreview from "./pages/Tab1_Profile/CompanyProfilePreview";
import RequirementsList from "./pages/Tab2_Requirements/RequirementsList";
import CreateRequirement from "./pages/Tab2_Requirements/CreateRequirement";
import RequirementDetail from "./pages/Tab2_Requirements/RequirementDetail";
import ProductPortfolio from "./pages/Tab3_Products/ProductPortfolio";
import Gallery from "./pages/Tab4_Gallery/Gallery";
import Certificates from "./pages/Tab5_Certificates/Certificates";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import ManufacturerMonitor from "./pages/Admin/ManufacturerMonitor";
import RequirementMonitor from "./pages/Admin/RequirementMonitor";
import AdminLayout from "./components/AdminLayout";
import Navbar from "./components/Navbar";
import DistributorHome from "./pages/Distributor/DistributorHome";
import DistributorProfileForm from "./pages/Distributor/Tab1_Profile/DistributorProfileForm";
import BusinessNetworkArea from "./pages/Distributor/Tab3_BusinessNetwork/BusinessNetworkArea";
import NetworkDetails from "./pages/Distributor/Tab4_NetworkDetails/NetworkDetails";
import RetailerHome from "./pages/Retailer/RetailerHome";
import RetailerProfileForm from "./pages/Retailer/Tab1_Profile/RetailerProfileForm";
import RetailerNetworkDetails from "./pages/Retailer/Tab3_NetworkDetails/RetailerNetworkDetails";
import ManufacturerHome from "./pages/ManufacturerHome";

import CandidateHome from "./pages/CandidateHome";
import ProtectedRoute from "./components/ProtectedRoute";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Landing Page - No Layout */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Admin Routes - With Admin Layout */}
        <Route
          path="/admin/*"
          element={
            <AdminLayout>
              <Routes>
                <Route path="manufacturers" element={<ManufacturerMonitor />} />
                <Route path="requirements" element={<RequirementMonitor />} />
              </Routes>
            </AdminLayout>
          }
        />

        {/* Protected/Internal Routes - Wrapped in Layout */}
        <Route
          element={
            <Layout>
              <Outlet />
            </Layout>
          }
        >
          {/* Manufacturer Routes */}
          <Route element={<ProtectedRoute allowedRoles={["manufacturer"]} />}>
            <Route path="/manufacturer/home" element={<ManufacturerHome />} />
            <Route
              path="/manufacturer/profile"
              element={<CompanyProfileForm />}
            />
            <Route
              path="/manufacturer/profile/preview"
              element={<CompanyProfilePreview />}
            />
            <Route
              path="/manufacturer/products"
              element={<ProductPortfolio />}
            />
            <Route path="/manufacturer/gallery" element={<Gallery />} />
            <Route
              path="/manufacturer/certificates"
              element={<Certificates />}
            />
            <Route
              path="/manufacturer/requirements"
              element={<RequirementsList />}
            />
            <Route
              path="/manufacturer/requirements/create"
              element={<CreateRequirement />}
            />
            <Route
              path="/manufacturer/requirements/edit/:id"
              element={<CreateRequirement />}
            />
            <Route
              path="/manufacturer/requirements/:id"
              element={<RequirementDetail />}
            />
          </Route>

          {/* Distributor Routes */}
          {/* Distributor Routes */}
          <Route element={<ProtectedRoute allowedRoles={["distributor"]} />}>
            <Route path="/distributor/home" element={<DistributorHome />} />
            <Route
              path="/distributor/profile"
              element={<DistributorProfileForm />}
            />
            <Route
              path="/distributor/products"
              element={<ProductPortfolio />}
            />
            <Route
              path="/distributor/network-area"
              element={<BusinessNetworkArea />}
            />
            <Route
              path="/distributor/network-details"
              element={<NetworkDetails />}
            />
          </Route>

          {/* Retailer Routes */}
          <Route element={<ProtectedRoute allowedRoles={["retailer"]} />}>
            <Route path="/retailer/home" element={<RetailerHome />} />
            <Route path="/retailer/profile" element={<RetailerProfileForm />} />
            <Route path="/retailer/products" element={<ProductPortfolio />} />
            <Route
              path="/retailer/network-details"
              element={<RetailerNetworkDetails />}
            />
          </Route>

          {/* Candidate Routes */}
          <Route element={<ProtectedRoute allowedRoles={["candidate"]} />}>
            <Route path="/candidate/home" element={<CandidateHome />} />
            {/* Add other candidate routes here if needed */}
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
