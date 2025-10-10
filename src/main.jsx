import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";

// Pages
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/Login" />}></Route>

        <Route path="/Login" element={<Login />}></Route>

        <Route path="/SignUp" element={<SignUp />}></Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
