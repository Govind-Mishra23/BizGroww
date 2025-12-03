import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    setLoading(false);
  }, []);

  const login = async (email, password, role = null) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        "http://localhost:5001/api/auth/login",
        { email, password, role },
        config
      );

      if (data.error) {
        throw new Error(data.message);
      }

      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);
      return data;
    } catch (error) {
      // Handle axios errors
      if (error.response) {
        // Server responded with error
        throw new Error(error.response.data.message || "Login failed");
      } else if (error.request) {
        // No response from server
        throw new Error(
          "Cannot connect to server. Please check if the server is running."
        );
      } else {
        // Other errors
        throw error;
      }
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        "http://localhost:5001/api/auth/register",
        { name, email, password, role },
        config
      );

      if (data.error) {
        throw new Error(data.message);
      }

      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);
      return data;
    } catch (error) {
      // Handle axios errors
      if (error.response) {
        // Server responded with error
        throw new Error(error.response.data.message || "Registration failed");
      } else if (error.request) {
        // No response from server
        throw new Error(
          "Cannot connect to server. Please check if the server is running."
        );
      } else {
        // Other errors
        throw error;
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
