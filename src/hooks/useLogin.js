import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { REACT_APP_SERVER_URL } from "../server/config";

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    const response = await fetch(`${REACT_APP_SERVER_URL}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const text = await response.text(); // Get response as text for debugging
    console.log(text); // Log response text
    
    const json = JSON.parse(text); // Parse it manually after logging

    if (!response.ok) {
      setError(json.error || "Login failed");
      setLoading(false);
      return false;
    }

    if (response) {
      localStorage.setItem("user", JSON.stringify(json));
      dispatch({ type: "LOGIN", payload: json });
      setLoading(false);
      return true;
    }
  };

  return { login, loading, error };
};
