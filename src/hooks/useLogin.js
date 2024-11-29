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
    const text = await response.text();

    const json = JSON.parse(text);

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
