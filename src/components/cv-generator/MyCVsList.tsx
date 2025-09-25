import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, Trash2, Plus } from "lucide-react";
import { GeneratedCV } from "./types";

interface MyCVsListProps {
  generatedCVs: GeneratedCV[];
  onDownloadCV: (cvId: string, fileName: string) => void;
  onDeleteCV: (cvId: string) => void;
  onSwitchToGenerate: () => void;
}

export default function MyCVsList({ 
  generatedCVs, 
  onDownloadCV, 
  onDeleteCV, 
  onSwitchToGenerate 
}: MyCVsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Generated CVs</CardTitle>
        <CardDescription>
          Manage and download your previously generated CVs
        </CardDescription>
      </CardHeader>
      <CardContent>
        {generatedCVs.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No CVs Generated Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Generate your first CV using our professional templates
            </p>
            <Button onClick={onSwitchToGenerate}>
              <Plus className="w-4 h-4 mr-2" />
              Generate Your First CV
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {generatedCVs.map((cv) => (
              <div
                key={cv.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">CV_{cv.id}.pdf</h3>
                    <p className="text-sm text-gray-600">
                      Template: {cv.templateUsed} • Created:{" "}
                      {new Date(cv.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      onDownloadCV(
                        cv.id.toString(),
                        `CV_${cv.id}.pdf`
                      )
                    }
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeleteCV(cv.id.toString())}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
