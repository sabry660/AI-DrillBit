import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { History, Clock, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { motion } from "motion/react";

const MOCK_HISTORY = [
  { id: 1, date: "2026-04-10 14:20", wear: "Healthy", confidence: 98, life: 95, rig: "Rig Alpha-7" },
  { id: 2, date: "2026-04-09 09:15", wear: "Medium", confidence: 85, life: 45, rig: "Rig Alpha-7" },
  { id: 3, date: "2026-04-08 18:45", wear: "Worn", confidence: 92, life: 12, rig: "Rig Beta-3" },
  { id: 4, date: "2026-04-07 11:30", wear: "Healthy", confidence: 99, life: 88, rig: "Rig Alpha-7" },
];

export function HistoryPage() {
  const getWearColor = (level: string) => {
    switch (level) {
      case "Healthy": return "text-green-500";
      case "Medium": return "text-yellow-500";
      case "Worn": return "text-red-500";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Analysis History</h2>
          <p className="text-muted-foreground">Review past drill bit assessments and performance trends.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-secondary rounded-lg border border-border text-xs font-mono">
          <History className="w-3 h-3" />
          <span>{MOCK_HISTORY.length} Records</span>
        </div>
      </div>

      <div className="grid gap-4">
        {MOCK_HISTORY.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-secondary/10 border-border hover:bg-secondary/20 transition-colors cursor-pointer group">
              <CardContent className="p-4 flex items-center gap-6">
                <div className="p-3 rounded-xl bg-background border border-border group-hover:border-primary/50 transition-colors">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                </div>
                
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Timestamp</p>
                    <p className="text-sm font-medium">{item.date}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Wear Level</p>
                    <p className={`text-sm font-bold ${getWearColor(item.wear)}`}>{item.wear}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Confidence</p>
                    <p className="text-sm font-mono">{item.confidence}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Health Index</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${item.life > 70 ? "bg-green-500" : item.life > 30 ? "bg-yellow-500" : "bg-red-500"}`}
                          style={{ width: `${item.life}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono">{item.life}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="hidden md:block text-right">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Location</p>
                  <p className="text-xs font-medium">{item.rig}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
