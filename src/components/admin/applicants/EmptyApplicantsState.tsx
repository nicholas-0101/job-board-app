import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function EmptyApplicantsState() {
  return (
    <Card className="border-dashed shadow-md">
      <CardContent className="p-12 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-primary-100 rounded-full">
            <Users className="w-10 h-10 text-[#467EC7]" />
          </div>
          <div>
            <p className="text-lg font-medium text-foreground mb-1">
              No applicants yet
            </p>
            <p className="text-muted-foreground">
              Applications will appear here when candidates apply
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
