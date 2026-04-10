import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Settings, Bell, Shield, Database, Cpu, Save } from "lucide-react";
import { Switch } from "./ui/switch";

export function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">System Settings</h2>
        <p className="text-muted-foreground">Configure AI parameters and system preferences.</p>
      </div>

      <div className="grid gap-6">
        {/* Profile Settings */}
        <Card className="bg-secondary/10 border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              User Profile
            </CardTitle>
            <CardDescription>Manage your account details and location.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue="Mohamed Sabry" className="bg-background border-border" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" defaultValue="Egypt" className="bg-background border-border" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Configuration */}
        <Card className="bg-secondary/10 border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Cpu className="w-5 h-5 text-primary" />
              AI Engine Configuration
            </CardTitle>
            <CardDescription>Fine-tune the predictive maintenance model.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Real-time Analysis</Label>
                <p className="text-xs text-muted-foreground">Automatically run analysis on sensor data stream.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Deep Visual Inspection</Label>
                <p className="text-xs text-muted-foreground">Enable high-precision image processing for wear detection.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="space-y-2">
              <Label>Confidence Threshold (%)</Label>
              <Input type="number" defaultValue="85" className="bg-background border-border w-32" />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="bg-secondary/10 border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Alert Notifications
            </CardTitle>
            <CardDescription>Configure how you receive maintenance alerts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Critical Wear Alerts</Label>
                <p className="text-xs text-muted-foreground">Notify when wear level reaches "Worn" state.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Weekly Performance Reports</Label>
                <p className="text-xs text-muted-foreground">Receive a summary of all analyses via email.</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="outline">Cancel</Button>
          <Button className="gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
