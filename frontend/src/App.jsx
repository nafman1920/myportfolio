import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Pages/Home";
import AdminLogin from "./components/Pages/AdminLogin";
import AdminDashboard from "./components/Pages/AdminDashboard";
import PrivateRoute from "./components/Routes/Privateroute";

import "./components/Styles/Navbar.css";
import "./components/Styles/Home.css";
import "./components/Styles/Footer.css";

const App = () => {
  const [activeStack, setActiveStack] = useState([]);

  const handleTabClick = (tab) => {
    if (tab === "home") {
      setActiveStack([]);
      return;
    }
    if (activeStack[0] === tab) {
      // close the tab if it's already active
      setActiveStack([]);
    } else {
      // open only one at a time
      setActiveStack([tab]);
    }
  };

  return (
    <Router>
      <div className="app">
        <Navbar onTabClick={handleTabClick} activeStack={activeStack} />
        <Routes>
          <Route
            path="/"
            element={<Home activeStack={activeStack} onTabClick={handleTabClick} />}
          />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
