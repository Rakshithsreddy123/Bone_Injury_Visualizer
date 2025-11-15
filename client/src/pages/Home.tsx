import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Activity, Brain, Eye, Zap, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Home() {
  const { isAuthenticated, loading, user } = useAuth();
  const [, navigate] = useLocation();
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
  });

  // tRPC mutations
  const loginMutation = trpc.auth.login.useMutation();
  const registerMutation = trpc.auth.register.useMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isLogin) {
        await loginMutation.mutateAsync({
          username: formData.username,
          password: formData.password,
        });
      } else {
        await registerMutation.mutateAsync({
          username: formData.username,
          password: formData.password,
          name: formData.name,
          email: formData.email,
        });
      }

      // Reset form and redirect
      setFormData({ username: "", password: "", name: "", email: "" });
      setShowAuthForm(false);
      navigate("/diagnosis");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Authentication failed");
    }
  };

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
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    Welcome, {user?.name || user?.username}
                  </span>
                  <Button
                    onClick={() => navigate("/diagnosis")}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Go to Visualizer
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setShowAuthForm(!showAuthForm)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {showAuthForm ? "Close" : "Sign In"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-5xl font-bold text-gray-900">
            Medical Diagnosis Visualizer
          </h2>
          <p className="mb-8 text-xl text-gray-600">
            Convert complex medical reports into interactive visual diagnoses
          </p>
        </div>

        {/* Auth Form Modal */}
        {showAuthForm && !isAuthenticated && (
          <div className="mb-12 flex justify-center">
            <Card className="w-full max-w-md border-2 border-blue-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                <CardTitle>
                  {isLogin ? "Sign In" : "Create Account"}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <Input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="Enter username"
                      required
                      className="border-2 border-blue-200"
                    />
                  </div>

                  {!isLogin && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <Input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter your name"
                          required={!isLogin}
                          className="border-2 border-blue-200"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email (Optional)
                        </label>
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter email"
                          className="border-2 border-blue-200"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <Input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter password"
                      required
                      className="border-2 border-blue-200"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={
                      loginMutation.isPending || registerMutation.isPending
                    }
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {loginMutation.isPending || registerMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isLogin ? "Signing In..." : "Creating Account..."}
                      </>
                    ) : isLogin ? (
                      "Sign In"
                    ) : (
                      "Create Account"
                    )}
                  </Button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setIsLogin(!isLogin);
                        setFormData({
                          username: "",
                          password: "",
                          name: "",
                          email: "",
                        });
                      }}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {isLogin
                        ? "Don't have an account? Sign up"
                        : "Already have an account? Sign in"}
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
          <Card className="border-2 border-blue-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="pt-6 text-center space-y-3">
              <Brain className="h-12 w-12 text-blue-600 mx-auto" />
              <h3 className="font-semibold text-gray-900">AI-Powered Analysis</h3>
              <p className="text-sm text-gray-600">
                Advanced NLP extracts medical findings from reports
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-indigo-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="pt-6 text-center space-y-3">
              <Eye className="h-12 w-12 text-indigo-600 mx-auto" />
              <h3 className="font-semibold text-gray-900">Visual Diagnosis</h3>
              <p className="text-sm text-gray-600">
                Interactive body visualization with highlighted areas
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="pt-6 text-center space-y-3">
              <Zap className="h-12 w-12 text-purple-600 mx-auto" />
              <h3 className="font-semibold text-gray-900">Real-Time Generation</h3>
              <p className="text-sm text-gray-600">
                AI generates medical images based on findings
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-pink-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="pt-6 text-center space-y-3">
              <Activity className="h-12 w-12 text-pink-600 mx-auto" />
              <h3 className="font-semibold text-gray-900">Severity Tracking</h3>
              <p className="text-sm text-gray-600">
                Color-coded severity indicators for quick assessment
              </p>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <Card className="border-2 border-gray-200 shadow-lg mb-12">
          <CardHeader className="bg-gradient-to-r from-gray-100 to-gray-50">
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center space-y-3">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <span className="font-bold text-blue-600">1</span>
                </div>
                <h4 className="font-semibold text-gray-900">Input Report</h4>
                <p className="text-sm text-gray-600">
                  Paste your medical report text
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                  <span className="font-bold text-indigo-600">2</span>
                </div>
                <h4 className="font-semibold text-gray-900">AI Analysis</h4>
                <p className="text-sm text-gray-600">
                  NLP extracts medical findings and conditions
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                  <span className="font-bold text-purple-600">3</span>
                </div>
                <h4 className="font-semibold text-gray-900">Visualization</h4>
                <p className="text-sm text-gray-600">
                  See AI-generated medical images with highlights
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        {!isAuthenticated && (
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">
              Ready to visualize medical diagnoses?
            </h3>
            <Button
              onClick={() => setShowAuthForm(true)}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
            >
              Get Started Now
            </Button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-blue-200 bg-white/50 backdrop-blur-sm py-8 mt-16">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-gray-600">
          <p>
            Medical Diagnosis Imaging Visualizer - AI-Powered Medical Analysis
          </p>
        </div>
      </footer>
    </div>
  );
}
