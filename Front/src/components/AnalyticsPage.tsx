import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { BarChart3, TrendingUp, Activity, Zap, Shield, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { motion } from "motion/react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from "recharts";

const WEAR_TREND_DATA = [
  { time: "00:00", wear: 10, vibration: 1.2 },
  { time: "04:00", wear: 15, vibration: 1.4 },
  { time: "08:00", wear: 22, vibration: 1.8 },
  { time: "12:00", wear: 35, vibration: 2.5 },
  { time: "16:00", wear: 48, vibration: 3.1 },
  { time: "20:00", wear: 55, vibration: 3.8 },
  { time: "23:59", wear: 62, vibration: 4.2 },
];

const PERFORMANCE_DATA = [
  { name: "Bit A", efficiency: 88, wear: 12 },
  { name: "Bit B", efficiency: 72, wear: 35 },
  { name: "Bit C", efficiency: 94, wear: 8 },
  { name: "Bit D", efficiency: 65, wear: 58 },
];

export function AnalyticsPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">System Analytics</h2>
        <p className="text-muted-foreground">Deep dive into performance metrics and predictive trends.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Avg. Wear Rate" 
          value="4.2%" 
          trend="+0.5%" 
          up={true} 
          icon={<Activity className="w-4 h-4 text-primary" />} 
        />
        <StatCard 
          label="Prediction Accuracy" 
          value="94.8%" 
          trend="+1.2%" 
          up={true} 
          icon={<Shield className="w-4 h-4 text-green-500" />} 
        />
        <StatCard 
          label="Active Sensors" 
          value="128" 
          trend="Stable" 
          up={null} 
          icon={<Zap className="w-4 h-4 text-yellow-500" />} 
        />
        <StatCard 
          label="Maintenance Alerts" 
          value="3" 
          trend="-2" 
          up={false} 
          icon={<TrendingUp className="w-4 h-4 text-red-500" />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Wear Trend Chart */}
        <Card className="bg-secondary/10 border-border">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-widest">Wear Progression vs Vibration</CardTitle>
            <CardDescription>24-hour monitoring cycle</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={WEAR_TREND_DATA}>
                <defs>
                  <linearGradient id="colorWear" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                <XAxis dataKey="time" stroke="#525252" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#525252" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#171717", border: "1px solid #262626", borderRadius: "8px" }}
                  itemStyle={{ fontSize: "12px" }}
                />
                <Area type="monotone" dataKey="wear" stroke="#f97316" fillOpacity={1} fill="url(#colorWear)" />
                <Line type="monotone" dataKey="vibration" stroke="#3b82f6" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Efficiency Comparison */}
        <Card className="bg-secondary/10 border-border">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-widest">Bit Efficiency Comparison</CardTitle>
            <CardDescription>Current operational batch</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PERFORMANCE_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                <XAxis dataKey="name" stroke="#525252" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#525252" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#171717", border: "1px solid #262626", borderRadius: "8px" }}
                />
                <Bar dataKey="efficiency" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="wear" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ label, value, trend, up, icon }: { label: string, value: string, trend: string, up: boolean | null, icon: React.ReactNode }) {
  return (
    <Card className="bg-secondary/10 border-border">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="p-2 rounded-lg bg-background border border-border">
            {icon}
          </div>
          {up !== null && (
            <div className={`flex items-center gap-1 text-[10px] font-bold ${up ? "text-green-500" : "text-red-500"}`}>
              {up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {trend}
            </div>
          )}
        </div>
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold font-mono mt-1">{value}</p>
      </CardContent>
    </Card>
  );
}
