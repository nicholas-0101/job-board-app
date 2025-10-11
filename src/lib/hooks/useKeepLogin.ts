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

        const payload = res.data?.data;
        if (!payload) {
          setUser(null);
          return;
        }

        const { token: refreshedToken, ...rest } = payload;

        if (refreshedToken) {
          localStorage.setItem("token", refreshedToken);
        }
        if (rest.role) {
          localStorage.setItem("role", rest.role);
        }
        if (typeof rest.isProfileComplete === "boolean") {
          localStorage.setItem(
            "isProfileComplete",
            rest.isProfileComplete ? "true" : "false"
          );
        }
        if (rest.id) {
          localStorage.setItem("userId", rest.id.toString());
        }

        try {
          localStorage.setItem("user", JSON.stringify(rest));
        } catch {
          // ignore storage errors
        }

        setUser(rest);
      } catch (err) {
        console.error("Keep login failed", err);
        ["token", "role", "isProfileComplete", "user", "userId"].forEach((key) => {
          try {
            localStorage.removeItem(key);
          } catch {
            // ignore storage errors
          }
        });
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [setUser]);

  return loading;
}
