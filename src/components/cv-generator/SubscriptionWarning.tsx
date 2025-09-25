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
      <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50">
        <CardContent className="p-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-6">
              <AlertCircle className="w-10 h-10 text-orange-600" />
            </div>
            <h2 className="text-3xl font-bold text-orange-900 mb-4">
              Subscription Required
            </h2>
            <p className="text-lg text-orange-800 mb-8 max-w-2xl mx-auto">
              CV Generator is a premium feature that requires an active
              subscription. Upgrade your account to access professional
              ATS-optimized CV templates and unlimited generation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => router.push("/subscription")}
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg"
                size="lg"
              >
                View Subscription Plans
              </Button>
              <Button
                variant="outline"
                onClick={onCheckAgain}
                className="border-orange-300 text-orange-700 hover:bg-orange-50 px-8 py-3"
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
