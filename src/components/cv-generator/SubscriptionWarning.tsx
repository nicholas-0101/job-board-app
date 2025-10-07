import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface SubscriptionWarningProps {
  onCheckAgain: () => void;
}

export default function SubscriptionWarning({ onCheckAgain }: SubscriptionWarningProps) {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="border-[#467EC7]/20 bg-gradient-to-br from-[#467EC7]/5 to-[#24CFA7]/5">
        <CardContent className="p-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#467EC7]/10 rounded-full mb-6">
              <AlertCircle className="w-10 h-10 text-[#467EC7]" />
            </div>
            <h2 className="text-3xl font-bold text-[#467EC7] mb-4">
              Subscription Required
            </h2>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              CV Generator is a premium feature that requires an active
              subscription. Upgrade your account to access professional
              ATS-optimized CV templates and unlimited generation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => router.push("/subscription")}
                className="bg-[#467EC7] hover:bg-[#467EC7]/90 text-white px-8 py-3 text-lg"
                size="lg"
              >
                View Subscription Plans
              </Button>
              <Button
                variant="outline"
                onClick={onCheckAgain}
                className="border-[#467EC7]/30 text-[#467EC7] hover:bg-[#467EC7]/5 px-8 py-3"
                size="lg"
              >
                Check Again
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
