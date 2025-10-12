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
import Dashboard from "./Pages/Dashboard";
import 

// Routes
import PrivateRoute from "./Routes/PrivateRoute";
import MainLayout from "./Layout/MainLayout";

// React Query
const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/Login" />} />

          <Route path="/Login" element={<Login />} />

          <Route path="/SignUp" element={<SignUp />} />

          <Route element={<MainLayout />}>
            <Route
              path="/Dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
