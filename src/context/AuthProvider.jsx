import { useState } from "react";
import axios from "axios";
import { AuthCtx } from "./AuthContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

function getInitialToken() {
  return localStorage.getItem("token") || null;
}

function getInitialUser() {
  try {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

const existingToken = getInitialToken();
if (existingToken) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${existingToken}`;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getInitialUser);
  const [token, setToken] = useState(getInitialToken);

  function persist(data) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data));
    axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    setToken(data.token);
    setUser(data);
  }

  const login = async (email, password) => {
    const { data } = await axios.post(`${API}/api/auth/login`, { email, password });
    persist(data);
    return data;
  };

  const register = async (fullName, email, password) => {
    const { data } = await axios.post(`${API}/api/auth/register`, { fullName, email, password });
    persist(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    setToken(null);
    setUser(null);
  };

  return (
    <AuthCtx.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}
