"use client";
import { useEffect } from "react";

export default function GoogleCallback() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.replace("#", "?"));
    const token = params.get("id_token"); // match the key your listener expects

    if (window.opener && token) {
      window.opener.postMessage({ token }, window.location.origin); // send { token }
      window.close();
    }
  }, []);

  return <div>Processing Google login...</div>;
}