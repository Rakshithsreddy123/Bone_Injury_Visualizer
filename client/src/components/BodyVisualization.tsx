import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Finding {
  bodyPart: string;
  condition: string;
  severity: "severe" | "moderate" | "mild";
  description: string;
}

interface BodyVisualizationProps {
  findings: Finding[];
}

const BodyVisualization: React.FC<BodyVisualizationProps> = ({ findings }) => {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  // Map body parts to their SVG positions and colors based on severity
  const bodyPartMap: Record<
    string,
    { cx: number; cy: number; r: number; color: string }
  > = {
    head: { cx: 150, cy: 50, r: 30, color: "#fbbf24" },
    neck: { cx: 150, cy: 85, r: 15, color: "#f87171" },
    shoulder: { cx: 120, cy: 110, r: 20, color: "#60a5fa" },
    arm: { cx: 100, cy: 140, r: 15, color: "#34d399" },
    elbow: { cx: 95, cy: 170, r: 12, color: "#a78bfa" },
    wrist: { cx: 90, cy: 200, r: 10, color: "#fb923c" },
    hand: { cx: 85, cy: 230, r: 12, color: "#f472b6" },
    chest: { cx: 150, cy: 130, r: 35, color: "#f87171" },
    heart: { cx: 150, cy: 120, r: 15, color: "#ef4444" },
    lung: { cx: 140, cy: 130, r: 20, color: "#3b82f6" },
    abdomen: { cx: 150, cy: 180, r: 40, color: "#fbbf24" },
    stomach: { cx: 150, cy: 170, r: 25, color: "#f59e0b" },
    liver: { cx: 165, cy: 160, r: 20, color: "#f97316" },
    kidney: { cx: 140, cy: 165, r: 15, color: "#ec4899" },
    spine: { cx: 150, cy: 150, r: 10, color: "#6366f1" },
    back: { cx: 150, cy: 160, r: 30, color: "#8b5cf6" },
    hip: { cx: 130, cy: 220, r: 25, color: "#06b6d4" },
    leg: { cx: 130, cy: 280, r: 20, color: "#10b981" },
    knee: { cx: 130, cy: 320, r: 18, color: "#14b8a6" },
    ankle: { cx: 130, cy: 360, r: 12, color: "#f43f5e" },
    foot: { cx: 130, cy: 390, r: 15, color: "#84cc16" },
  };

  // Get severity color
  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case "severe":
        return "#dc2626"; // red
      case "moderate":
        return "#f59e0b"; // amber
      case "mild":
        return "#fbbf24"; // yellow
      default:
        return "#d1d5db"; // gray
    }
  };

  // Get severity badge color
  const getSeverityBadgeColor = (
    severity: string
  ): "destructive" | "default" | "secondary" | "outline" => {
    switch (severity) {
      case "severe":
        return "destructive";
      case "moderate":
        return "default";
      case "mild":
        return "secondary";
      default:
        return "outline";
    }
  };

  // Group findings by body part
  const findingsByBodyPart = findings.reduce(
    (acc, finding) => {
      const key = finding.bodyPart.toLowerCase();
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(finding);
      return acc;
    },
    {} as Record<string, Finding[]>
  );

  return (
    <div className="w-full space-y-6">
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-blue-900">
            Interactive Body Visualization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center gap-8 lg:flex-row">
            {/* SVG Body Diagram */}
            <div className="flex items-center justify-center">
              <svg
                width="300"
                height="400"
                viewBox="0 0 300 400"
                className="rounded-lg border-2 border-blue-300 bg-white shadow-lg"
              >
                {/* Head */}
                <circle
                  cx="150"
                  cy="50"
                  r="30"
                  fill={
                    hoveredPart === "head" ||
                    Object.keys(findingsByBodyPart).some((part) =>
                      part.includes("head")
                    )
                      ? getSeverityColor(
                          findingsByBodyPart[
                            Object.keys(findingsByBodyPart).find((part) =>
                              part.includes("head")
                            ) || ""
                          ]?.[0]?.severity || "mild"
                        )
                      : "#e5e7eb"
                  }
                  stroke="#1f2937"
                  strokeWidth="2"
                  onMouseEnter={() => setHoveredPart("head")}
                  onMouseLeave={() => setHoveredPart(null)}
                  style={{ cursor: "pointer", transition: "fill 0.3s" }}
                />

                {/* Neck */}
                <rect
                  x="140"
                  y="80"
                  width="20"
                  height="20"
                  fill={
                    hoveredPart === "neck" ||
                    Object.keys(findingsByBodyPart).some((part) =>
                      part.includes("neck")
                    )
                      ? getSeverityColor(
                          findingsByBodyPart[
                            Object.keys(findingsByBodyPart).find((part) =>
                              part.includes("neck")
                            ) || ""
                          ]?.[0]?.severity || "mild"
                        )
                      : "#e5e7eb"
                  }
                  stroke="#1f2937"
                  strokeWidth="2"
                  onMouseEnter={() => setHoveredPart("neck")}
                  onMouseLeave={() => setHoveredPart(null)}
                  style={{ cursor: "pointer", transition: "fill 0.3s" }}
                />

                {/* Chest */}
                <ellipse
                  cx="150"
                  cy="130"
                  rx="35"
                  ry="45"
                  fill={
                    hoveredPart === "chest" ||
                    Object.keys(findingsByBodyPart).some((part) =>
                      part.includes("chest")
                    )
                      ? getSeverityColor(
                          findingsByBodyPart[
                            Object.keys(findingsByBodyPart).find((part) =>
                              part.includes("chest")
                            ) || ""
                          ]?.[0]?.severity || "mild"
                        )
                      : "#e5e7eb"
                  }
                  stroke="#1f2937"
                  strokeWidth="2"
                  onMouseEnter={() => setHoveredPart("chest")}
                  onMouseLeave={() => setHoveredPart(null)}
                  style={{ cursor: "pointer", transition: "fill 0.3s" }}
                />

                {/* Left Arm */}
                <rect
                  x="100"
                  y="110"
                  width="20"
                  height="100"
                  fill={
                    hoveredPart === "arm" ||
                    Object.keys(findingsByBodyPart).some((part) =>
                      part.includes("arm")
                    )
                      ? getSeverityColor(
                          findingsByBodyPart[
                            Object.keys(findingsByBodyPart).find((part) =>
                              part.includes("arm")
                            ) || ""
                          ]?.[0]?.severity || "mild"
                        )
                      : "#e5e7eb"
                  }
                  stroke="#1f2937"
                  strokeWidth="2"
                  onMouseEnter={() => setHoveredPart("arm")}
                  onMouseLeave={() => setHoveredPart(null)}
                  style={{ cursor: "pointer", transition: "fill 0.3s" }}
                />

                {/* Right Arm */}
                <rect
                  x="180"
                  y="110"
                  width="20"
                  height="100"
                  fill={
                    hoveredPart === "arm" ||
                    Object.keys(findingsByBodyPart).some((part) =>
                      part.includes("arm")
                    )
                      ? getSeverityColor(
                          findingsByBodyPart[
                            Object.keys(findingsByBodyPart).find((part) =>
                              part.includes("arm")
                            ) || ""
                          ]?.[0]?.severity || "mild"
                        )
                      : "#e5e7eb"
                  }
                  stroke="#1f2937"
                  strokeWidth="2"
                  onMouseEnter={() => setHoveredPart("arm")}
                  onMouseLeave={() => setHoveredPart(null)}
                  style={{ cursor: "pointer", transition: "fill 0.3s" }}
                />

                {/* Abdomen */}
                <ellipse
                  cx="150"
                  cy="210"
                  rx="30"
                  ry="40"
                  fill={
                    hoveredPart === "abdomen" ||
                    Object.keys(findingsByBodyPart).some((part) =>
                      part.includes("abdomen")
                    )
                      ? getSeverityColor(
                          findingsByBodyPart[
                            Object.keys(findingsByBodyPart).find((part) =>
                              part.includes("abdomen")
                            ) || ""
                          ]?.[0]?.severity || "mild"
                        )
                      : "#e5e7eb"
                  }
                  stroke="#1f2937"
                  strokeWidth="2"
                  onMouseEnter={() => setHoveredPart("abdomen")}
                  onMouseLeave={() => setHoveredPart(null)}
                  style={{ cursor: "pointer", transition: "fill 0.3s" }}
                />

                {/* Left Leg */}
                <rect
                  x="125"
                  y="250"
                  width="20"
                  height="120"
                  fill={
                    hoveredPart === "leg" ||
                    Object.keys(findingsByBodyPart).some((part) =>
                      part.includes("leg")
                    )
                      ? getSeverityColor(
                          findingsByBodyPart[
                            Object.keys(findingsByBodyPart).find((part) =>
                              part.includes("leg")
                            ) || ""
                          ]?.[0]?.severity || "mild"
                        )
                      : "#e5e7eb"
                  }
                  stroke="#1f2937"
                  strokeWidth="2"
                  onMouseEnter={() => setHoveredPart("leg")}
                  onMouseLeave={() => setHoveredPart(null)}
                  style={{ cursor: "pointer", transition: "fill 0.3s" }}
                />

                {/* Right Leg */}
                <rect
                  x="155"
                  y="250"
                  width="20"
                  height="120"
                  fill={
                    hoveredPart === "leg" ||
                    Object.keys(findingsByBodyPart).some((part) =>
                      part.includes("leg")
                    )
                      ? getSeverityColor(
                          findingsByBodyPart[
                            Object.keys(findingsByBodyPart).find((part) =>
                              part.includes("leg")
                            ) || ""
                          ]?.[0]?.severity || "mild"
                        )
                      : "#e5e7eb"
                  }
                  stroke="#1f2937"
                  strokeWidth="2"
                  onMouseEnter={() => setHoveredPart("leg")}
                  onMouseLeave={() => setHoveredPart(null)}
                  style={{ cursor: "pointer", transition: "fill 0.3s" }}
                />

                {/* Left Foot */}
                <ellipse
                  cx="135"
                  cy="385"
                  rx="12"
                  ry="8"
                  fill={
                    hoveredPart === "foot" ||
                    Object.keys(findingsByBodyPart).some((part) =>
                      part.includes("foot")
                    )
                      ? getSeverityColor(
                          findingsByBodyPart[
                            Object.keys(findingsByBodyPart).find((part) =>
                              part.includes("foot")
                            ) || ""
                          ]?.[0]?.severity || "mild"
                        )
                      : "#e5e7eb"
                  }
                  stroke="#1f2937"
                  strokeWidth="2"
                  onMouseEnter={() => setHoveredPart("foot")}
                  onMouseLeave={() => setHoveredPart(null)}
                  style={{ cursor: "pointer", transition: "fill 0.3s" }}
                />

                {/* Right Foot */}
                <ellipse
                  cx="165"
                  cy="385"
                  rx="12"
                  ry="8"
                  fill={
                    hoveredPart === "foot" ||
                    Object.keys(findingsByBodyPart).some((part) =>
                      part.includes("foot")
                    )
                      ? getSeverityColor(
                          findingsByBodyPart[
                            Object.keys(findingsByBodyPart).find((part) =>
                              part.includes("foot")
                            ) || ""
                          ]?.[0]?.severity || "mild"
                        )
                      : "#e5e7eb"
                  }
                  stroke="#1f2937"
                  strokeWidth="2"
                  onMouseEnter={() => setHoveredPart("foot")}
                  onMouseLeave={() => setHoveredPart(null)}
                  style={{ cursor: "pointer", transition: "fill 0.3s" }}
                />
              </svg>
            </div>

            {/* Legend and Findings */}
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg text-gray-900">
                  Severity Legend
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 rounded bg-red-600"></div>
                    <span className="text-sm text-gray-700">Severe</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 rounded bg-amber-500"></div>
                    <span className="text-sm text-gray-700">Moderate</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 rounded bg-yellow-400"></div>
                    <span className="text-sm text-gray-700">Mild</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-lg text-gray-900">
                  Findings ({findings.length})
                </h3>
                <div className="max-h-64 space-y-2 overflow-y-auto">
                  {findings.length > 0 ? (
                    findings.map((finding, idx) => (
                      <Card
                        key={idx}
                        className="border border-gray-200 bg-white p-3"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900">
                              {finding.bodyPart}
                            </span>
                            <Badge
                              variant={getSeverityBadgeColor(finding.severity)}
                            >
                              {finding.severity.charAt(0).toUpperCase() +
                                finding.severity.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium text-gray-700">
                            {finding.condition}
                          </p>
                          <p className="text-xs text-gray-600">
                            {finding.description}
                          </p>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      No findings to display
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BodyVisualization;
