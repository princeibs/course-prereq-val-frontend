import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCookies } from "react-cookie";
import axios from "axios";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import {
  Login,
  Register,
} from "./pages/Auth";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import { baseUrl } from "./helpers/config";
import Loader from "./components/Loader";

// Main parent component
export default function App() {
  const [cookies, setCookies] = useCookies();
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(false);

  // Get user role from local storage. 
  const role = cookies?.role;

  // Get details of currently logged in user
  const getUserDetails = async () => {
    try {
      setLoading(true);
      const res =await axios.get(`${baseUrl}/users/profile`, {
              headers: { Authorization: `Bearer ${cookies.access_token}` },
            })
      setUserDetails(res.data.data.user);
    } catch (e) {
      if (e?.response?.status == 401) {
        toast.error("Authorization failed. Please login again");
      } else {
        console.log(e);
        toast.error(e?.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cookies.access_token) {
      getUserDetails();
    }
  }, [cookies.access_token]);

  return (
    <div className="app min-h-[100vh] m-auto flex flex-col justify-start items-center">
      {!loading ? (
        <Router>
          <Navbar
            userDetails={userDetails}
            getUserDetails={getUserDetails}
            cookies={cookies}
            role={role}
            setCookies={setCookies}
            setUserDetails={setUserDetails}
          />
          <Routes>
            {/* Shared  */}
            <Route path="/" element={<Home userDetails={userDetails} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Router>
      ) : (
        <Loader />
      )}
      <ToastContainer position="bottom-center" />
      {/* <Footer/> */}
    </div>
  );
}
