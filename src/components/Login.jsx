import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const [state, setState] = useState("Login");
  const { setShowLogin, backendUrl, setToken, setUser } = useContext(AppContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  
  const onSubmitHandler = async (e) => {
    e.preventDefault(); // Prevents page refresh
  
    try {
      console.log("Submitting User Data:", { name, email, password }); // Debugging
  
      // Determine the API URL based on the state (Login or Signup)
      
        if(state === "Login")
        {
          const { data } = await axios.post(backendUrl+'/api/users/login', {email, password });
  
      console.log("Response Data:", data); // Debugging API Response
  
      if (data.success) {
         setToken(data.token);
        setUser(data.user);
        localStorage.setItem("token", data.token);
        setShowLogin(false);
        toast.success("Login Successful");
      } 
      else {
        toast.error(data.message);
      }
    } 
    else{
      const { data } = await axios.post(backendUrl+'/api/users/register', {name, email, password });
  
      console.log("Response Data:", data); // Debugging API Response
  
      if (data.success) {
         setToken(data.token);
        setUser(data.user);
        localStorage.setItem("token", data.token);
        setShowLogin(false);
        toast.success("Access Successful");
      } 
      else {
        toast.error(data.message);
      }
    } 

    }
    catch (error) {
      console.error("Request Error:", error.response ? error.response.data : error.message);
      toast.error(error.response?.data?.message || "An error occurred. Please try again.");
    }
  };
  
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <motion.form
      onSubmit={onSubmitHandler}
      initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
      animate={{ opacity: 1, backdropFilter: "blur(5px)" }}
      exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center"
    >
      <div className="relative bg-white p-10 rounded-xl text-slate-500">
        <h1 className="text-center text-2xl text-neutral-700">{state}</h1>
        <p className="text-sm">Welcome back! Please sign in to continue</p>

        {state !== "Login" && (
          <div className="border px-6 py-2 rounded-full mt-5">
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              className="outline-none text-sm w-full"
              placeholder="Full Name"
              required
            />
          </div>
        )}

        <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4">
          <img src={assets.email_icon} alt="Email Icon" />
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            className="outline-none text-sm"
            placeholder="Email id"
            required
          />
        </div>

        <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4">
          <img src={assets.lock_icon} alt="Lock Icon" />
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            className="outline-none text-sm"
            placeholder="Password"
            required
          />
        </div>

        <p className="text-sm text-blue-600 my-4 cursor-pointer">
          Forgot Password?
        </p>

        <button
          type="submit"
          className="bg-blue-600 w-full text-white py-2 rounded-full"
        >
          {state === "Login" ? "Login" : "Create Account"}
        </button>

        {state === "Login" ? (
          <p className="mt-5 text-center">
            Don't have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => setState("Sign Up")}
            >
              Sign up
            </span>
          </p>
        ) : (
          <p className="mt-5 text-center">
            Already have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => setState("Login")}
            >
              Login
            </span>
          </p>
        )}

        <img
          onClick={() => setShowLogin(false)}
          src={assets.cross_icon}
          alt="Close Icon"
          className="absolute top-5 right-5 cursor-pointer"
        />
      </div>
    </motion.form>
  );
};

export default Login;
