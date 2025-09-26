"use client";
import { useState, useEffect } from "react";
import { useUserStore } from "@/lib/store/userStore";
import { apiCall } from "@/helper/axios";

export function useKeepLogin() {
  const setUser = useUserStore((state) => state.setUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await apiCall.get("/auth/keep", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.data); // make sure your backend returns the full user object
      } catch (err) {
        console.error("Keep login failed", err);
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [setUser]);

  return loading;
}