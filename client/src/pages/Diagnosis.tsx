import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Send } from "lucide-react";
import { trpc } from "@/lib/trpc";
import BodyVisualization from "@/components/BodyVisualization";

interface Finding {
  bodyPart: string;
  condition: string;
  severity: "severe" | "moderate" | "mild";
  description: string;
}

export default function Diagnosis() {
  const [reportText, setReportText] = useState("");
  const [findings, setFindings] = useState<Finding[]>([]);
  const [showVisualization, setShowVisualization] = useState(false);
  const [diagnosisHistory, setDiagnosisHistory] = useState<any[]>([]);

  // tRPC mutations and queries
  const createDiagnosisMutation = trpc.diagnosis.create.useMutation();
  const listDiagnosisQuery = trpc.diagnosis.list.useQuery();

  const handleAnalyzeReport = async () => {
    if (!reportText.trim()) {
      alert("Please enter a medical report");
      return;
    }

    try {
      const result = await createDiagnosisMutation.mutateAsync({
        reportText,
      });

      setFindings(result.findings);
      setShowVisualization(true);

      // Refresh diagnosis history
      if (listDiagnosisQuery.refetch) {
        listDiagnosisQuery.refetch();
      }
    } catch (error) {
      console.error("Error analyzing report:", error);
      alert("Failed to analyze report. Please try again.");
    }
  };

  const handleClearForm = () => {
    setReportText("");
    setFindings([]);
    setShowVisualization(false);
  };

  const isLoading = createDiagnosisMutation.isPending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">
            Medical Diagnosis Visualizer
          </h1>
          <p className="text-lg text-gray-600">
            Convert complex medical reports into interactive visual diagnoses
          </p>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Input Section */}
          <Card className="border-2 border-blue-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
              <CardTitle>Medical Report Input</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Paste Medical Report Text
                </label>
                <Textarea
                  placeholder="Example: Patient has a severe fracture in the left femur with moderate swelling. Right shoulder shows signs of inflammation. Mild pain in the lower back."
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  className="min-h-64 resize-none border-2 border-gray-300 focus:border-blue-500"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleAnalyzeReport}
                  disabled={isLoading || !reportText.trim()}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Analyze Report
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleClearForm}
                  variant="outline"
                  className="flex-1"
                >
                  Clear
                </Button>
              </div>

              {/* Quick Examples */}
              <div className="space-y-2 border-t pt-4">
                <p className="text-sm font-medium text-gray-700">
                  Quick Examples:
                </p>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-left"
                    onClick={() =>
                      setReportText(
                        "Patient presents with severe fracture in left femur. Moderate swelling observed. Right shoulder shows inflammation."
                      )
                    }
                  >
                    Example 1: Fracture Report
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-left"
                    onClick={() =>
                      setReportText(
                        "Mild pain in lower back. Moderate inflammation in right knee. Severe headache reported."
                      )
                    }
                  >
                    Example 2: Pain Assessment
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-left"
                    onClick={() =>
                      setReportText(
                        "Chest X-ray shows mild inflammation in left lung. Heart rate normal. Abdomen shows no abnormalities."
                      )
                    }
                  >
                    Example 3: Imaging Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visualization Section */}
          <div className="space-y-4">
            {showVisualization && findings.length > 0 ? (
              <BodyVisualization findings={findings} />
            ) : (
              <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
                <CardContent className="flex h-96 items-center justify-center">
                  <div className="text-center space-y-2">
                    <p className="text-lg font-medium text-gray-600">
                      Visualization will appear here
                    </p>
                    <p className="text-sm text-gray-500">
                      Enter a medical report and click "Analyze Report" to see
                      the interactive body visualization
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* History Section */}
        {listDiagnosisQuery.data && listDiagnosisQuery.data.length > 0 && (
          <Card className="border-2 border-green-200">
            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
              <CardTitle>Recent Diagnoses</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {listDiagnosisQuery.data.map((diagnosis: any) => (
                  <Card key={diagnosis.id} className="border border-gray-200">
                    <CardContent className="space-y-2 pt-4">
                      <p className="text-xs text-gray-500">
                        {new Date(diagnosis.createdAt).toLocaleDateString()}
                      </p>
                      <p className="line-clamp-3 text-sm text-gray-700">
                        {diagnosis.reportText}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          const parsedFindings = JSON.parse(diagnosis.findings);
                          setFindings(parsedFindings);
                          setReportText(diagnosis.reportText);
                          setShowVisualization(true);
                        }}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
