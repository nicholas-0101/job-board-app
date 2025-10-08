import { useRouter } from "next/navigation";
import { AlertCircle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface TransactionErrorProps {
  error: string | null;
}

export default function TransactionError({ error }: TransactionErrorProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F0F5F9] py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-8">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-red-900 mb-4">
                Transaction Error
              </h2>
              <p className="text-red-800 mb-6">
                {error || "Unable to load transaction details"}
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => router.push("/subscription")} variant="outline">
                  Back to Subscription
                </Button>
                <Button onClick={() => router.push("/")} className="bg-red-600 hover:bg-red-700">
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
