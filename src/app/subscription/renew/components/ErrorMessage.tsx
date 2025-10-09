import { AlertCircle, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const ErrorMessage = ({ message, onRetry }: { 
  message: string; 
  onRetry?: () => void; 
}) => (
  <Card className="border-red-200 bg-red-50">
    <CardContent className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <AlertCircle className="w-6 h-6 text-red-600" />
        <p className="text-red-800">{message}</p>
      </div>
      <div className="flex gap-3">
        {onRetry && (
          <Button onClick={onRetry} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        )}
        <Button 
          onClick={() => window.location.href = "/subscription"} 
          variant="outline" 
          size="sm"
        >
          Go to Subscription
        </Button>
      </div>
    </CardContent>
  </Card>
);
