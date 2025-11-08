import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Send, ArrowLeft } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

interface Finding {
  bodyPart: string;
  condition: string;
  severity: "severe" | "moderate" | "mild";
  description: string;
}

const EXAMPLE_REPORTS = [
  {
    title: "Fracture Report",
    text: "Patient has a severe fracture in the left femur with moderate swelling. Right shoulder shows signs of inflammation. Mild pain in the lower back.",
  },
  {
    title: "Chest X-ray",
    text: "Chest X-ray shows mild inflammation in left lung. Heart rate normal. Abdomen appears normal with mild inflammation in lower region.",
  },
  {
    title: "Imaging Report",
    text: "MRI reveals severe inflammation in the right shoulder with moderate rotator cuff strain. Mild inflammation noted in the cervical spine.",
  },
];

export default function Diagnosis() {
  const [reportText, setReportText] = useState("");
  const [findings, setFindings] = useState<Finding[]>([]);
  const [showVisualization, setShowVisualization] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(
    null
  );
  const [, navigate] = useLocation();

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
      setGeneratedImageUrl(result.imageUrl);
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
    setGeneratedImageUrl(null);
  };

  const handleLoadExample = (exampleText: string) => {
    setReportText(exampleText);
  };

  const isLoading = createDiagnosisMutation.isPending;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "severe":
        return "bg-red-100 text-red-800 border-red-300";
      case "moderate":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "mild":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case "severe":
        return "bg-red-500";
      case "moderate":
        return "bg-amber-500";
      case "mild":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Home
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Medical Diagnosis Visualizer
          </h1>
          <div className="w-32"></div>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Input Section */}
          <Card className="border-2 border-blue-200 shadow-lg h-fit">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
              <CardTitle>Medical Report Input</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Paste Medical Report Text
                </label>
                <Textarea
                  placeholder="Enter or paste medical report text here..."
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  className="min-h-48 border-2 border-blue-300 focus:border-blue-500"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleAnalyzeReport}
                  disabled={isLoading || !reportText.trim()}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
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
                  className="border-2 border-gray-300"
                >
                  Clear
                </Button>
              </div>

              {/* Quick Examples */}
              <div className="space-y-2 pt-4 border-t-2 border-gray-200">
                <p className="text-sm font-medium text-gray-700">
                  Quick Examples:
                </p>
                <div className="space-y-2">
                  {EXAMPLE_REPORTS.map((example, idx) => (
                    <Button
                      key={idx}
                      onClick={() => handleLoadExample(example.text)}
                      variant="outline"
                      className="w-full justify-start border-2 border-blue-200 hover:bg-blue-50"
                    >
                      {example.title}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visualization Section */}
          <div className="space-y-4">
            {showVisualization ? (
              <>
                {/* AI Generated Image */}
                <Card className="border-2 border-indigo-200 shadow-lg overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                    <CardTitle>AI-Generated Medical Visualization</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {generatedImageUrl ? (
                      <div className="space-y-4">
                        <img
                          src={generatedImageUrl}
                          alt="AI-generated medical visualization"
                          className="w-full h-auto rounded-lg border-2 border-indigo-200 shadow-md"
                        />
                        <p className="text-sm text-gray-600 text-center">
                          AI-generated medical imaging based on report analysis
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-64 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border-2 border-dashed border-indigo-300">
                        <div className="text-center space-y-2">
                          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto" />
                          <p className="text-gray-600">
                            Generating medical visualization...
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Findings List */}
                {findings.length > 0 && (
                  <Card className="border-2 border-purple-200 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      <CardTitle>Extracted Findings</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {findings.map((finding, idx) => (
                          <div
                            key={idx}
                            className={`p-3 rounded-lg border-2 ${getSeverityColor(
                              finding.severity
                            )}`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <p className="font-semibold">
                                  {finding.bodyPart}
                                </p>
                                <p className="text-sm">{finding.condition}</p>
                                <p className="text-xs mt-1 opacity-75">
                                  {finding.description}
                                </p>
                              </div>
                              <span
                                className={`${getSeverityBadgeColor(
                                  finding.severity
                                )} text-white text-xs font-bold px-2 py-1 rounded whitespace-nowrap`}
                              >
                                {finding.severity.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Severity Legend */}
                <Card className="border-2 border-gray-200">
                  <CardContent className="pt-6">
                    <p className="text-sm font-medium text-gray-700 mb-3">
                      Severity Legend:
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-red-500"></div>
                        <span className="text-sm text-gray-700">
                          Severe - Critical condition
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-amber-500"></div>
                        <span className="text-sm text-gray-700">
                          Moderate - Significant concern
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-yellow-500"></div>
                        <span className="text-sm text-gray-700">
                          Mild - Minor issue
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="border-2 border-dashed border-gray-300 h-96 flex items-center justify-center">
                <CardContent className="text-center space-y-4">
                  <div className="text-6xl">📋</div>
                  <p className="text-gray-600 font-medium">
                    Enter a medical report to see AI-generated visualization
                  </p>
                  <p className="text-sm text-gray-500">
                    The system will analyze the report and generate a realistic
                    medical image
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* History Section */}
        {listDiagnosisQuery.data && listDiagnosisQuery.data.length > 0 && (
          <Card className="border-2 border-green-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
              <CardTitle>Recent Diagnoses</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {listDiagnosisQuery.data.map((diagnosis: any) => (
                  <div
                    key={diagnosis.id}
                    className="p-4 border-2 border-green-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <p className="text-sm text-gray-600 mb-2">
                      {new Date(diagnosis.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-700 line-clamp-3">
                      {diagnosis.reportText}
                    </p>
                    {diagnosis.generatedImageUrl && (
                      <img
                        src={diagnosis.generatedImageUrl}
                        alt="Previous diagnosis"
                        className="mt-3 w-full h-24 object-cover rounded border border-green-200"
                      />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
