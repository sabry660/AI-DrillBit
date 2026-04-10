import React from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Activity, Gauge, Droplets, ArrowDown, Weight, Zap, Shield, ZapOff, Info, Plus, Minus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "./ui/tooltip";

interface ParameterInputProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  icon: React.ReactNode;
  unit?: string;
  min?: number;
  max?: number;
  description?: string;
}

function ParamField({ label, value, onChange, icon, unit, min = 0, max = Infinity, description }: ParameterInputProps) {
  const error = value < min ? `Min: ${min}` : value > max ? `Max: ${max}` : null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-muted-foreground">
          {icon}
          <div className="flex items-center gap-1">
            <Label className="text-[10px] uppercase tracking-widest font-mono">{label}</Label>
            {description && (
              <Tooltip>
                <TooltipTrigger className="p-0.5 hover:text-primary transition-colors">
                  <Info className="w-2.5 h-2.5" />
                </TooltipTrigger>
                <TooltipContent className="bg-secondary border-border text-xs max-w-[200px]">
                  <p>{description}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
        {error && <span className="text-[10px] text-destructive font-bold animate-pulse">{error}</span>}
      </div>
      <div className="relative flex items-center">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="absolute left-1 p-1 hover:text-primary transition-colors text-muted-foreground z-10"
        >
          <Minus className="w-3 h-3" />
        </button>
        <Input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className={`bg-secondary/50 border-border font-mono text-sm h-9 px-8 focus-visible:ring-primary text-center ${
            error ? "border-destructive/50 ring-1 ring-destructive/20" : ""
          }`}
        />
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          className="absolute right-8 p-1 hover:text-primary transition-colors text-muted-foreground z-10"
        >
          <Plus className="w-3 h-3" />
        </button>
        {unit && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground font-mono pointer-events-none">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

interface ParameterGridProps {
  values: any;
  onChange: (key: string, val: number) => void;
}

export function ParameterGrid({ values, onChange }: ParameterGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <ParamField
        label="SM Speed"
        value={values.smSpeed}
        onChange={(v) => onChange("smSpeed", v)}
        icon={<Gauge className="w-3 h-3" />}
        unit="RPM"
        min={0}
        max={500}
        description="Surface Motor Speed. Controls the rotation of the drill string."
      />
      <ParamField
        label="DP Pressure"
        value={values.dpPress}
        onChange={(v) => onChange("dpPress", v)}
        icon={<Activity className="w-3 h-3" />}
        unit="PSI"
        min={0}
        max={10000}
        description="Differential Pressure. The difference between internal and external pressure."
      />
      <ParamField
        label="MR Flow"
        value={values.mrFlow}
        onChange={(v) => onChange("mrFlow", v)}
        icon={<Droplets className="w-3 h-3" />}
        unit="GPM"
        min={0}
        max={2000}
        description="Mud Return Flow Rate. Measures the volume of drilling fluid returning from the well."
      />
      <ParamField
        label="RO Pen"
        value={values.roPen}
        onChange={(v) => onChange("roPen", v)}
        icon={<ArrowDown className="w-3 h-3" />}
        unit="FT/H"
        min={0}
        max={500}
        description="Rate of Penetration. The speed at which the drill bit breaks the rock."
      />
      <ParamField
        label="WO Bit"
        value={values.woBit}
        onChange={(v) => onChange("woBit", v)}
        icon={<Weight className="w-3 h-3" />}
        unit="KLB"
        min={0}
        max={200}
        description="Weight on Bit. The amount of downward force exerted on the drill bit."
      />
      <ParamField
        label="WBO Press"
        value={values.wboPress}
        onChange={(v) => onChange("wboPress", v)}
        icon={<Activity className="w-3 h-3" />}
        unit="PSI"
        min={0}
        max={10000}
        description="Wellbore Pressure. The pressure exerted by the fluid in the wellbore."
      />
      <ParamField
        label="Spec Energy"
        value={values.specificEnergy}
        onChange={(v) => onChange("specificEnergy", v)}
        icon={<Zap className="w-3 h-3" />}
        unit="KSI"
        min={0}
        max={1000}
        description="Mechanical Specific Energy. The energy required to remove a unit volume of rock."
      />
      <ParamField
        label="Drill Strength"
        value={values.drillingStrength}
        onChange={(v) => onChange("drillingStrength", v)}
        icon={<Shield className="w-3 h-3" />}
        unit="KSI"
        min={0}
        max={1000}
        description="Drilling Strength. Resistance of the formation to the drilling process."
      />
      <ParamField
        label="Vibration"
        value={values.vibration}
        onChange={(v) => onChange("vibration", v)}
        icon={<ZapOff className="w-3 h-3" />}
        unit="G"
        min={0}
        max={50}
        description="Drill String Vibration. Measured in G-force to detect potential bit bounce or whirl."
      />
    </div>
  );
}
