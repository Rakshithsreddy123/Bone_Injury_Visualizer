import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, Brain, Eye, Zap } from "lucide-react";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center space-y-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="border-b border-blue-200 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Medical Diagnosis Imaging
              </h1>
            </div>
            <div>
              {isAuthenticated ? (
                <Button
                  onClick={() => navigate("/diagnosis")}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Go to Visualizer
                </Button>
              ) : (
                <Button
                  onClick={() => (window.location.href = getLoginUrl())}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center space-y-6">
          <h2 className="text-5xl font-bold text-gray-900">
            Transform Medical Reports into Visual Insights
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Convert complex medical terminology into interactive 3D body visualizations
            that patients can easily understand. Empower patients with clarity about
            their diagnoses.
          </p>
          {isAuthenticated ? (
            <Button
              onClick={() => navigate("/diagnosis")}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-lg h-12 px-8"
            >
              Start Analyzing
            </Button>
          ) : (
            <Button
              onClick={() => (window.location.href = getLoginUrl())}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-lg h-12 px-8"
            >
              Sign In to Get Started
            </Button>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Key Features
        </h3>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-2 border-blue-200 bg-white hover:shadow-lg transition-shadow">
            <CardContent className="space-y-4 pt-6">
              <Brain className="h-8 w-8 text-blue-600" />
              <h4 className="font-semibold text-gray-900">NLP Analysis</h4>
              <p className="text-sm text-gray-600">
                Automatically extract key medical findings from complex reports
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-indigo-200 bg-white hover:shadow-lg transition-shadow">
            <CardContent className="space-y-4 pt-6">
              <Eye className="h-8 w-8 text-indigo-600" />
              <h4 className="font-semibold text-gray-900">Visual Mapping</h4>
              <p className="text-sm text-gray-600">
                Map diagnoses to interactive body visualizations instantly
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 bg-white hover:shadow-lg transition-shadow">
            <CardContent className="space-y-4 pt-6">
              <Zap className="h-8 w-8 text-purple-600" />
              <h4 className="font-semibold text-gray-900">Severity Coding</h4>
              <p className="text-sm text-gray-600">
                Color-coded severity levels (Severe, Moderate, Mild) for clarity
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-pink-200 bg-white hover:shadow-lg transition-shadow">
            <CardContent className="space-y-4 pt-6">
              <Activity className="h-8 w-8 text-pink-600" />
              <h4 className="font-semibold text-gray-900">History Tracking</h4>
              <p className="text-sm text-gray-600">
                Save and retrieve past diagnoses for easy reference
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
          How It Works
        </h3>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="text-center space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white text-2xl font-bold mx-auto">
              1
            </div>
            <h4 className="font-semibold text-gray-900">Paste Report</h4>
            <p className="text-gray-600">
              Copy and paste the medical report text into the analyzer
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-white text-2xl font-bold mx-auto">
              2
            </div>
            <h4 className="font-semibold text-gray-900">AI Analysis</h4>
            <p className="text-gray-600">
              Our NLP engine extracts key findings and conditions
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-600 text-white text-2xl font-bold mx-auto">
              3
            </div>
            <h4 className="font-semibold text-gray-900">Visualize</h4>
            <p className="text-gray-600">
              See an interactive body diagram with highlighted problem areas
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <Card className="border-2 border-blue-300 bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
          <CardContent className="space-y-6 pt-8 text-center">
            <h3 className="text-3xl font-bold">Ready to Get Started?</h3>
            <p className="text-lg opacity-90">
              Transform medical reports into clear, patient-friendly visualizations
            </p>
            {isAuthenticated ? (
              <Button
                onClick={() => navigate("/diagnosis")}
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 text-lg h-12 px-8"
              >
                Open Visualizer
              </Button>
            ) : (
              <Button
                onClick={() => (window.location.href = getLoginUrl())}
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 text-lg h-12 px-8"
              >
                Sign In Now
              </Button>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-blue-200 bg-white/50 py-8 text-center text-gray-600">
        <p>
          Medical Diagnosis Imaging 2024. Empowering patient understanding
          through visual communication.
        </p>
      </footer>
    </div>
  );
}
