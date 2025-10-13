"use client";

import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/userStore";
import { apiCall } from "@/helper/axios";

export function useGoogleSignIn() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  const handleGoogleSignIn = () => {
    const role = "USER" as const;
    const nonce = Math.random().toString(36).substring(2, 15);
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${window.location.origin}/auth/google/callback&response_type=token id_token&scope=email profile&nonce=${nonce}`;
    const width = 500;
    const height = 600;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;
    window.open(
      url,
      "GoogleLogin",
      `width=${width},height=${height},top=${top},left=${left}`
    );

    const listener = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const { token } = event.data as { token?: string };
      if (token) {
        try {
          const res = await apiCall.post("/auth/social", {
            provider: "GOOGLE",
            token,
            role,
          });
          const userData = res.data.data;
          const isProfileComplete = Boolean(userData.isProfileComplete);

          // If admin, fetch companyId like in password sign-in
          if (userData.role === "ADMIN") {
            try {
              const companyResponse = await apiCall.get("/company/admin", {
                headers: {
                  Authorization: `Bearer ${userData.token}`,
                },
              });
              const companyId = Number(
                companyResponse.data?.id ?? companyResponse.data?.data?.id
              );
              if (!Number.isNaN(companyId)) {
                localStorage.setItem("companyId", companyId.toString());
              }
            } catch (err) {
              // ignore company fetch error
            }
          }

          localStorage.setItem("token", userData.token);
          localStorage.setItem("user", JSON.stringify(userData));
          localStorage.setItem("role", userData.role);
          localStorage.setItem("userId", userData.id.toString());
          localStorage.setItem(
            "isProfileComplete",
            isProfileComplete ? "true" : "false"
          );
          setUser({ ...userData, isProfileComplete });

          if (userData.role === "ADMIN") {
            router.replace(
              isProfileComplete ? "/admin" : "/admin/profile/complete"
            );
          } else {
            router.replace(isProfileComplete ? "/" : "/profile/complete");
          }
        } catch (err: any) {
          console.error(err);
          // Error handling can be added here if needed
        } finally {
          window.removeEventListener("message", listener);
        }
      }
    };

    window.addEventListener("message", listener);
  };

  return {
    handleGoogleSignIn,
  };
}
