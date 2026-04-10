import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Cpu, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  BarChart3, 
  Settings, 
  History, 
  LayoutDashboard,
  Loader2,
  ChevronRight,
  Info,
  Image as ImageIcon
} from "lucide-react";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./components/ui/card";
import { Toaster } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { toast } from "sonner";
import { ImageUpload } from "./components/ImageUpload";
import { ParameterGrid } from "./components/ParameterInput";
import { Gauge } from "./components/Gauge";
import { predictWear, type PredictionResult, type PredictionParams } from "./lib/gemini";

// New Page Imports
import { HistoryPage } from "./components/HistoryPage";
import { AnalyticsPage } from "./components/AnalyticsPage";
import { SettingsPage } from "./components/SettingsPage";

type Page = "dashboard" | "history" | "analytics" | "settings";

export default function App() {
  const [activePage, setActivePage] = useState<Page>("dashboard");
  const [params, setParams] = useState<PredictionParams>({
    smSpeed: 120,
    dpPress: 2500,
    mrFlow: 450,
    roPen: 45,
    woBit: 35,
    wboPress: 2200,
    specificEnergy: 150,
    drillingStrength: 85,
    vibration: 2.4,
    image: undefined,
  });

  const [isPredicting, setIsPredicting] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);

  const handleParamChange = (key: string, val: number) => {
    setParams((prev) => ({ ...prev, [key]: val }));
  };

  const handlePredict = async () => {
    setIsPredicting(true);
    try {
      const prediction = await predictWear(params);
      setResult(prediction);
      toast.success("Prediction completed successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsPredicting(false);
    }
  };

  const isInvalid = 
    params.smSpeed < 0 || params.smSpeed > 500 ||
    params.dpPress < 0 || params.dpPress > 10000 ||
    params.mrFlow < 0 || params.mrFlow > 2000 ||
    params.roPen < 0 || params.roPen > 500 ||
    params.woBit < 0 || params.woBit > 200 ||
    params.wboPress < 0 || params.wboPress > 10000 ||
    params.specificEnergy < 0 || params.specificEnergy > 1000 ||
    params.drillingStrength < 0 || params.drillingStrength > 1000 ||
    params.vibration < 0 || params.vibration > 50;

  const getWearColor = (level: string) => {
    switch (level) {
      case "Healthy": return "text-green-500";
      case "Medium": return "text-yellow-500";
      case "Worn": return "text-red-500";
      default: return "text-muted-foreground";
    }
  };

  const getWearIcon = (level: string) => {
    switch (level) {
      case "Healthy": return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "Medium": return <Info className="w-5 h-5 text-yellow-500" />;
      case "Worn": return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default: return null;
    }
  };

  const renderPage = () => {
    switch (activePage) {
      case "history": return <HistoryPage />;
      case "analytics": return <AnalyticsPage />;
      case "settings": return <SettingsPage />;
      default: return (
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Inputs */}
            <div className="lg:col-span-7 space-y-6">
              <Card className="bg-secondary/10 border-border">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    Drilling Parameters
                  </CardTitle>
                  <CardDescription>Input real-time sensor data for analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <ParameterGrid values={params} onChange={handleParamChange} />
                </CardContent>
              </Card>

              <Card className="bg-secondary/10 border-border">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-primary" />
                    Visual Inspection
                  </CardTitle>
                  <CardDescription>Upload a high-resolution image of the drill bit</CardDescription>
                </CardHeader>
                <CardContent>
                  <ImageUpload onImageSelect={(file) => setParams(p => ({ ...p, image: file || undefined }))} />
                </CardContent>
              </Card>

              <Button 
                size="lg" 
                className="w-full h-14 text-lg font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                onClick={handlePredict}
                disabled={isPredicting || isInvalid}
              >
                {isPredicting ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                    Analyzing Data...
                  </>
                ) : (
                  "RUN PREDICTIVE ANALYSIS"
                )}
              </Button>
            </div>

            {/* Right Column: Results */}
            <div className="lg:col-span-5 space-y-6">
              <AnimatePresence mode="wait">
                {result ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <Card className="bg-secondary/10 border-border overflow-hidden relative">
                      <div className={`absolute top-0 left-0 w-1 h-full ${
                        result.wearLevel === "Healthy" ? "bg-green-500" : 
                        result.wearLevel === "Medium" ? "bg-yellow-500" : "bg-red-500"
                      }`} />
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">Analysis Result</CardTitle>
                            <CardDescription>AI-generated wear assessment</CardDescription>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-secondary border border-border flex items-center gap-2`}>
                            {getWearIcon(result.wearLevel)}
                            <span className={getWearColor(result.wearLevel)}>{result.wearLevel}</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-8">
                        <div className="flex justify-center py-4">
                          <Gauge value={result.remainingUsefulLife} label="Health Index" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 rounded-xl bg-secondary/30 border border-border">
                            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Confidence</p>
                            <p className="text-2xl font-bold font-mono">{result.confidence}%</p>
                          </div>
                          <div className="p-4 rounded-xl bg-secondary/30 border border-border">
                            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Status</p>
                            <p className={`text-xl font-bold ${getWearColor(result.wearLevel)}`}>{result.wearLevel}</p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
                            <Info className="w-4 h-4" />
                            Technical Analysis
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed bg-secondary/20 p-4 rounded-lg border border-border/50 italic">
                            "{result.analysis}"
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-secondary/10 border-border">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary" />
                          Maintenance Forecast
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Est. Remaining Time</span>
                            <span className="font-mono font-bold">{(result.remainingUsefulLife * 1.5).toFixed(1)} Hours</span>
                          </div>
                          <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <motion.div 
                              className={`h-full ${
                                result.remainingUsefulLife > 70 ? "bg-green-500" : 
                                result.remainingUsefulLife > 30 ? "bg-yellow-500" : "bg-red-500"
                              }`}
                              initial={{ width: 0 }}
                              animate={{ width: `${result.remainingUsefulLife}%` }}
                              transition={{ duration: 1 }}
                            />
                          </div>
                          <p className="text-[10px] text-muted-foreground leading-tight">
                            *Forecast based on current drilling parameters and historical wear patterns.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-border rounded-3xl bg-secondary/5"
                  >
                    <div className="p-6 rounded-full bg-secondary mb-6">
                      <BarChart3 className="w-12 h-12 text-muted-foreground opacity-20" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Ready for Analysis</h3>
                    <p className="text-sm text-muted-foreground max-w-xs">
                      Input parameters and upload an image to generate a predictive wear assessment.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background text-foreground flex font-sans">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:flex w-64 border-r border-border flex-col p-6 gap-8 bg-secondary/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Cpu className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="font-bold text-sm tracking-tight leading-tight">
              DRILL BIT AI<br />
              <span className="text-muted-foreground font-normal text-[10px] uppercase tracking-widest">Monitoring System</span>
            </h1>
          </div>

          <nav className="flex flex-col gap-2">
            <NavItem 
              icon={<LayoutDashboard className="w-4 h-4" />} 
              label="Dashboard" 
              active={activePage === "dashboard"} 
              onClick={() => setActivePage("dashboard")}
            />
            <NavItem 
              icon={<History className="w-4 h-4" />} 
              label="History" 
              active={activePage === "history"} 
              onClick={() => setActivePage("history")}
            />
            <NavItem 
              icon={<BarChart3 className="w-4 h-4" />} 
              label="Analytics" 
              active={activePage === "analytics"} 
              onClick={() => setActivePage("analytics")}
            />
            <NavItem 
              icon={<Settings className="w-4 h-4" />} 
              label="Settings" 
              active={activePage === "settings"} 
              onClick={() => setActivePage("settings")}
            />
          </nav>

          <div className="mt-auto p-4 rounded-xl bg-primary/10 border border-primary/20">
            <p className="text-[10px] uppercase tracking-widest text-primary font-bold mb-2">System Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-medium">AI Core Online</span>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-background/50 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Operations</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground font-medium capitalize">{activePage}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-medium">Mohamed Sabry</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Egypt</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-secondary border border-border" />
            </div>
          </header>

          {/* Scrollable Area */}
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderPage()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
        <Toaster position="top-right" theme="dark" />
      </div>
    </TooltipProvider>
  );
}

function NavItem({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors w-full text-left ${
        active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
