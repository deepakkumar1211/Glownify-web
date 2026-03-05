import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";

import store from "./../redux/store";
import ProtectedRoute from "./../components/ProtectedRoutes";
import DashboardLayout from "./../components/layout/DashboardLayout";
import AuthRedirect from "../components/AuthRedirect";

// Super Admin Pages
import SuperAdminDashboard from "./../pages/SuperAdmin/SuperAdminDashboard";
import ManageSalonsPage from "../pages/SuperAdmin/ManageSalonsPage";
import ManageUsersPage from "./../pages/SuperAdmin/ManageUsersPage";
import ManageCitiesAndStatesPage from "./../pages/SuperAdmin/ManageCitiesAndStatesPage";
import ManageCategoriesPage from "./../pages/SuperAdmin/ManageCategoriesPage";
import ManageSalesExecutivePage from "./../pages/SuperAdmin/ManageSalesExecutivePage";
import ManageSubscriptionPage from "./../pages/SuperAdmin/ManageSubscriptionPage";
import ManageResetPassword from "./../pages/SuperAdmin/ManageResetPassword";
import SuperAdminProfilePage from "../pages/SuperAdmin/SuperAdminProfilePage";

// Sales Executive Pages
import SalesExecitiveDashboard from "./../pages/SalesExecutive/SalesExecitiveDashboard";
import ManageSalesman from "./../pages/SalesExecutive/ManageSalesman";
import SalesExecutiveProfilePage from "../pages/SalesExecutive/SalesExecutiveProfilePage";

// Salon Owner Pages
import SalonOwnerDashboard from "../pages/SalonOwner/SalonOwnerDashboard";
import ManageServicesPage from "../pages/SalonOwner/ManageServicesPage";
import ManageSpecialistsPage from "../pages/SalonOwner/ManageSpecialistsPage";
import ManageAnalyticsPage from "../pages/SalonOwner/ManageAnalyticsPage";
import ManageBookingsPage from "../pages/SalonOwner/ManageBookingsPage";
import AIHairstyleScannerPage from "../pages/SalonOwner/AIHairstyleScannerPage";
import AIPosterCreatorPage from "../pages/SalonOwner/AIPosterCreatorPage";
import SalonOwnerProfilePage from "../pages/SalonOwner/SalonOwnerProfilePage";
import ManageAddOnPage from "../pages/SalonOwner/ManageAddOnPage";
import SubscriptionPage from "../pages/SalonOwner/SubscriptionPage";

// Salesman Pages
import SalesmanDashboard from "../pages/Salesman/SalesmanDashboard";
import MySaloonsPage from "../pages/Salesman/MySaloonsPage";
import SalesmanProfilePage from "../pages/Salesman/SalesmanProfilePage";

//TeamLead Pages
import TeamLeadDashboard from "../pages/TeamLead/TeamLeadDashboard";
import TeamLeadProfilePage from "../pages/TeamLead/TeamLeadProfilePage";

//IndependentPro Pages
import IndependentProDashboard from "../pages/IndependentPro/IndependentProDashboard";
import IndependentProProfilePage from "../pages/IndependentPro/IndependentProProfilePage";
import ManageIndependentServicesPage from "../pages/IndependentPro/ManageIndependentServicesPage";

//Specialist Pages
import SpecialistDashboard from "../pages/Specialist/SpecialistDashboard";
import SpecialistProfilePage from "../pages/Specialist/SpecialistProfilePage";

//Public Pages
import UserLayout from "./../components/User/UserLayout";
import HomePage from "./../pages/User/HomePage";
import MyBookingsPage from "./../pages/User/MyBookingsPage";
import UserProfilePage from "./../pages/User/UserProfilePage";
import HomeSaloonsDetails from "../pages/User/HomePageLayout/HomeSaloonsDetails";
import SalonDetailPageForHome from "../pages/User/HomePageLayout/SalonDetailPageForHome";
import SalonServices from "../pages/User/HomePageLayout/HomeSaloonDetails/SalonServices";
import SalonGallery from "../pages/User/HomePageLayout/HomeSaloonDetails/SalonGallery";
import SalonMap from "../pages/User/HomePageLayout/HomeSaloonDetails/SalonMap";
import SalonReviews from "../pages/User/HomePageLayout/HomeSaloonDetails/SalonReviews";
import SalonSpecialists from "../pages/User/HomePageLayout/HomeSaloonDetails/SalonSpecialists";
import LoginPage from "./../pages/Common/LoginPage";
import RegisterPage from "../pages/Common/RegisterPage";
import SalonsPage from "../pages/User/SalonsPage";
import PartnerRegistrationPage from "../pages/Common/PartnerRegistrationPage";
import SalonOwnerRegisterPage from "../pages/Common/SalonOwnerRegisterPage";
import IndependentProfessionalRegistrarionPage from "../pages/Common/IndependentProfessionalRegistrarionPage";
import IndependentProfessionalDetailPage from "../pages/User/HomePageLayout/IndependentProfessionalDetailPage";
import BlogPage from "../pages/Common/BlogPage";
import AboutPage from "../pages/Common/AboutPage";
import ContactPage from "../pages/Common/ContactPage";
import CartPage from "../pages/User/CartPage";
// import CareersPage from "../pages/Common/CareersPage";
import BookSubscriptionPage from "../pages/BookSubscriptionPage";
import PaymentSubscriptionPage from "../pages/PaymentSubscriptionPage";

const AllRoutes = () => {
  return (
    <Provider store={store}>
      <Toaster position="top-right" />
      <BrowserRouter>
        <AuthRedirect />
        <Routes>
          {/* PUBLIC CUSTOMER ROUTES */}
          <Route element={<UserLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/salons" element={<SalonsPage />} />
            <Route path="/partner-with-us" element={<PartnerRegistrationPage />} />
            <Route
              path="/partner-with-us/salon-owner-register"
              element={<SalonOwnerRegisterPage />}
            />
            <Route path="/booksubscriptionpage" element={<BookSubscriptionPage />} />
            <Route path="/paymentsubscriptionpage" element={<PaymentSubscriptionPage />} />
            <Route
              path="/partner-with-us/independent-professional-register"
              element={<IndependentProfessionalRegistrarionPage />}
            />
            <Route
              path="/independentprofessionaldetailspage"
              element={<IndependentProfessionalDetailPage />}
            />
            <Route
              path="/salondetailPageforhome/:id"
              element={<SalonDetailPageForHome />}
            />
            <Route path="/salon/:id" element={<HomeSaloonsDetails />}>
              <Route index element={<Navigate to="services" replace />} />
              <Route path="services" element={<SalonServices />} />
              <Route path="gallery" element={<SalonGallery />} />
              <Route path="map" element={<SalonMap />} />
              <Route path="reviews" element={<SalonReviews />} />
              <Route path="specialists" element={<SalonSpecialists />} />
            </Route>
            <Route path="/about-us" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/blogs" element={<BlogPage />} />
            <Route path="/cart" element={<CartPage />} />
            {/* <Route path="/careers" element={<CareersPage />} /> */}
          </Route>

          {/* PROTECTED CUSTOMER ROUTES */}
          <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
            <Route element={<UserLayout />}>
              <Route path="/bookings" element={<MyBookingsPage />} />
              <Route path="/profile" element={<UserProfilePage />} />
            </Route>
          </Route>
          {/* LOGIN ROUTE */}

          {/* SUPER ADMIN */}
          <Route element={<ProtectedRoute allowedRoles={["super_admin"]} />}>
            <Route path="/super-admin" element={<DashboardLayout />}>
              <Route index element={<SuperAdminDashboard />} />
              <Route path="dashboard" element={<SuperAdminDashboard />} />
              <Route path="manage-salons" element={<ManageSalonsPage />} />
              <Route
                path="manage-categories"
                element={<ManageCategoriesPage />}
              />
              <Route path="manage-users" element={<ManageUsersPage />} />
              <Route
                path="manage-cities-and-states"
                element={<ManageCitiesAndStatesPage />}
              />
              <Route
                path="manage-sales-executives"
                element={<ManageSalesExecutivePage />}
              />
              <Route
                path="manage-subscriptions"
                element={<ManageSubscriptionPage />}
              />
              <Route
                path="manage-reset-password"
                element={<ManageResetPassword />}
              />
              <Route path="profile" element={<SuperAdminProfilePage />} />
            </Route>
          </Route>

          {/* SALES EXECUTIVE */}
          <Route
            element={<ProtectedRoute allowedRoles={["sales_executive"]} />}
          >
            <Route path="/sales-executive" element={<DashboardLayout />}>
              <Route index element={<SalesExecitiveDashboard />} />
              <Route path="dashboard" element={<SalesExecitiveDashboard />} />
              <Route path="manage-salesman" element={<ManageSalesman />} />
              <Route path="profile" element={<SalesExecutiveProfilePage />} />
            </Route>
          </Route>

          {/* SALON OWNER */}
          <Route element={<ProtectedRoute allowedRoles={["salon_owner"]} />}>
            <Route path="/salon-owner" element={<DashboardLayout />}>
              <Route index element={<SalonOwnerDashboard />} />
              <Route path="dashboard" element={<SalonOwnerDashboard />} />
              <Route path="manage-services" element={<ManageServicesPage />} />
              <Route
                path="manage-specialists"
                element={<ManageSpecialistsPage />}
              />
              <Route
                path="manage-analytics"
                element={<ManageAnalyticsPage />}
              />
              <Route path="manage-bookings" element={<ManageBookingsPage />} />
              <Route
                path="ai-poster-creator"
                element={<AIPosterCreatorPage />}
              />
              <Route
                path="ai-hairstyle-scanner"
                element={<AIHairstyleScannerPage />}
              />
              <Route path="manage-add-ons" element={<ManageAddOnPage />} />
              <Route path="profile" element={<SalonOwnerProfilePage />} />
            </Route>
            <Route path="subscription" element={<SubscriptionPage />} />
          </Route>

          {/* SALESMAN */}
          <Route element={<ProtectedRoute allowedRoles={["salesman"]} />}>
            <Route path="/salesman" element={<DashboardLayout />}>
              <Route index element={<SalesmanDashboard />} />
              <Route path="dashboard" element={<SalesmanDashboard />} />
              <Route path="my-saloons" element={<MySaloonsPage />} />
              <Route path="profile" element={<SalesmanProfilePage />} />
            </Route>
          </Route>

          {/* TEAM LEAD */}
          <Route element={<ProtectedRoute allowedRoles={["team_lead"]} />}>
            <Route path="/team-lead" element={<DashboardLayout />}>
              <Route index element={<TeamLeadDashboard />} />
              <Route path="dashboard" element={<TeamLeadDashboard />} />
              <Route path="profile" element={<TeamLeadProfilePage />} />
            </Route>
          </Route>

          {/* INDEPENDENT PRO */}
          <Route
            element={<ProtectedRoute allowedRoles={["independent_pro"]} />}
          >
            <Route path="/independent-pro" element={<DashboardLayout />}>
              <Route index element={<IndependentProDashboard />} />
              <Route path="dashboard" element={<IndependentProDashboard />} />
              <Route
                path="manage-services"
                element={<ManageIndependentServicesPage />}
              />
              <Route path="profile" element={<IndependentProProfilePage />} />
            </Route>
          </Route>

          {/* SPECIALIST */}
          <Route element={<ProtectedRoute allowedRoles={["specialist"]} />}>
            <Route path="/specialist" element={<DashboardLayout />}>
              <Route index element={<SpecialistDashboard />} />
              <Route path="dashboard" element={<SpecialistDashboard />} />
              <Route path="profile" element={<SpecialistProfilePage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default AllRoutes;
