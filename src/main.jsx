import "./index.css";

// Core React & Router
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// State & Data
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Pages
import Login from "./Pages/Auth/Login";
import SignUp from "./Pages/Auth/SignUp";

// Layout
import MainLayout from "./Layout/MainLayout";

// Routes
import PrivateRoute from "./Routes/PrivateRoute";
import PersonalInfo from "./Pages/Users/PersonalInfo/PersonalInfo";
import NomineeInfo from "./Pages/Users/NomineeInfo/NomineeInfo";
import BankInfo from "./Pages/Users/BankInfo/BankInfo";
import Loans from "./Pages/Users/Loans/Loans";
import AdminLayout from "./Layout/AdminLayout";
import AllUsers from "./Pages/Admin/AllUsers/AllUsers";
import AllNominees from "./Pages/Admin/AllNominees/AllNominees";
import LoanManagement from "./Pages/Admin/LoanManagement/LoanManagement";
import NotFound from "./Pages/NotFound/NotFound";

// React Query
const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<NotFound />} />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/Login" />} />

          {/* ---------- Auth Routes ---------- */}

          {/* Login Route */}
          <Route path="/Login" element={<Login />} />

          {/* SignUp Route */}
          <Route path="/SignUp" element={<SignUp />} />

          {/* ---------- User Routes ---------- */}
          <Route element={<MainLayout />}>
            {/* Personal Information Route */}
            <Route
              path="/PersonalInfo"
              element={
                <PrivateRoute>
                  <PersonalInfo />
                </PrivateRoute>
              }
            />

            {/* Nominee Information Route */}
            <Route
              path="/NomineeInfo"
              element={
                <PrivateRoute>
                  <NomineeInfo />
                </PrivateRoute>
              }
            />

            {/* Bank Information Route */}
            <Route
              path="/BankInfo"
              element={
                <PrivateRoute>
                  <BankInfo />
                </PrivateRoute>
              }
            />

            {/* Loans Route */}
            <Route
              path="/Loans"
              element={
                <PrivateRoute>
                  <Loans />
                </PrivateRoute>
              }
            />
          </Route>

          {/* ---------- Admin Routes ---------- */}
          <Route element={<AdminLayout />}>
            {/* All Users Route */}
            <Route path="/Admin/AllUsers" element={<AllUsers />} />

            {/* All Nominees Route */}
            <Route path="/Admin/AllNominees" element={<AllNominees />} />

            {/* All Nominees Route */}
            <Route path="/Admin/LoanManagement" element={<LoanManagement />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
