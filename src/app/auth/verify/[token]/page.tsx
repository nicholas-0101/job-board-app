"use client";

import { useParams } from "next/navigation";
import { useVerifyAccount } from "@/lib/hooks/useVerifyAccount";
import { useResendVerification } from "@/lib/hooks/useResendVerification";
import { useVerifyRedirect } from "@/lib/hooks/useVerifyRedirect";
import VerifyContainer from "@/components/auth/verify/VerifyContainer";
import VerifyHeader from "@/components/auth/verify/VerifyHeader";
import VerifyButton from "@/components/auth/verify/VerifyButton";
import SuccessButton from "@/components/auth/verify/SuccessButton";
import ErrorButton from "@/components/auth/verify/ErrorButton";
import ExpiredButton from "@/components/auth/verify/ExpiredButton";

export default function VerifyPage() {
  const { token: rawToken } = useParams();
  const token = Array.isArray(rawToken) ? rawToken[0] : rawToken;
  
  const { isLoading, status, message, setStatus, setMessage, handleVerify } =
    useVerifyAccount();
  const { resending, handleResend } = useResendVerification();
  const { handleRedirect } = useVerifyRedirect();

  const onVerify = async () => {
    if (token) {
      await handleVerify(token);
    }
  };

  const onResend = async () => {
    const result = await handleResend(token);
    if (result.success) {
      setMessage(result.message);
      setStatus("sent");
    } else {
      setMessage(result.message);
    }
  };

  return (
    <VerifyContainer>
      <VerifyHeader message={message} />

      {status === "pending" && (
        <VerifyButton isLoading={isLoading} onClick={onVerify} />
      )}

      {status === "success" && (
        <SuccessButton onClick={handleRedirect} />
      )}

      {status === "error" && (
        <ErrorButton onClick={onVerify} />
      )}

      {status === "expired" && (
        <ExpiredButton resending={resending} onClick={onResend} />
      )}
    </VerifyContainer>
  );
}
