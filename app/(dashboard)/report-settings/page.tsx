"use client";

import React, { useState, useEffect } from "react";
import { CommonButton } from "@/components/common/Button";
import {
  Save,
  Mail,
  CalendarDays,
  CalendarRange,
  X,
  Plus,
  RefreshCcw,
  Info,
  AlertCircle,
  Clock,
  Send,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { PageHeader } from "@/components/Custom/PageHeader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  useReportSettingsQuery,
  useUpdateReportSettingsMutation,
} from "@/services/reportSettingsApi";
import { useDialogStore } from "@/store/useDialogStore";

export default function ReportSettingsPage() {
  const { data: settingsData, isLoading } = useReportSettingsQuery();
  const updateMutation = useUpdateReportSettingsMutation();
  const { setOpen } = useDialogStore();

  const [frequency, setFrequency] = useState<"WEEKLY" | "MONTHLY">("MONTHLY");
  const [emails, setEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState("");
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    if (settingsData?.settings) {
      const s = settingsData.settings;
      setFrequency(s.reportFrequency || "MONTHLY");
      setEmails(
        Array.isArray(s.reportEmails) ? s.reportEmails : []
      );
      setEmailEnabled(s.emailEnabled || false);
    }
  }, [settingsData]);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const addEmail = () => {
    const trimmed = emailInput.trim().toLowerCase();
    if (!trimmed) return;

    if (!isValidEmail(trimmed)) {
      setEmailError("Invalid email format");
      return;
    }
    if (emails.includes(trimmed)) {
      setEmailError("Email already added");
      return;
    }
    setEmails([...emails, trimmed]);
    setEmailInput("");
    setEmailError("");
  };

  const removeEmail = (email: string) => {
    setEmails(emails.filter((e) => e !== email));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addEmail();
    }
  };

  const handleSave = () => {
    const payload = {
      reportFrequency: frequency,
      reportEmails: emails,
      emailEnabled,
    };

    updateMutation.mutate(payload, {
      onSuccess: () => {
        setOpen({
          open: true,
          type: "success",
          title: "Settings Saved",
          message: "Report settings have been successfully updated.",
        });
      },
      onError: (err: any) => {
        setOpen({
          open: true,
          type: "error",
          title: "Save Failed",
          message:
            err?.response?.data?.error ||
            "Failed to save report settings. Please try again.",
        });
      },
    });
  };

  const handleReset = () => {
    if (settingsData?.settings) {
      const s = settingsData.settings;
      setFrequency(s.reportFrequency || "MONTHLY");
      setEmails(Array.isArray(s.reportEmails) ? s.reportEmails : []);
      setEmailEnabled(s.emailEnabled || false);
      setEmailInput("");
      setEmailError("");
    }
  };

  if (isLoading)
    return (
      <div className="p-10 text-center animate-pulse font-bold text-primary">
        Loading Report Settings...
      </div>
    );

  return (
    <div className="flex flex-col gap-6 w-full md:px-4 pb-10 max-w-7xl mx-auto">
      <PageHeader
        title="Report Settings"
        description="Configure automated report scheduling, email recipients, and notification preferences."
      />

      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Report Frequency */}
          <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden relative border-t-4 border-t-primary/50">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Clock className="h-16 w-16" />
            </div>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Report Frequency
              </CardTitle>
              <CardDescription>
                How often should reports be generated and emailed?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Weekly Option */}
                <button
                  type="button"
                  onClick={() => setFrequency("WEEKLY")}
                  className={`relative p-5 rounded-xl border-2 transition-all duration-300 text-left cursor-pointer group hover:shadow-lg ${
                    frequency === "WEEKLY"
                      ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                      : "border-slate-200 hover:border-slate-300 bg-background/50"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-colors ${
                      frequency === "WEEKLY"
                        ? "bg-primary text-white"
                        : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                    }`}
                  >
                    <CalendarDays className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-sm">Weekly</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Every Monday at 6:00 AM
                  </p>
                  <p className="text-[10px] text-muted-foreground/70 mt-0.5">
                    Covers Mon–Sun
                  </p>
                  {frequency === "WEEKLY" && (
                    <div className="absolute top-3 right-3 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                </button>

                {/* Monthly Option */}
                <button
                  type="button"
                  onClick={() => setFrequency("MONTHLY")}
                  className={`relative p-5 rounded-xl border-2 transition-all duration-300 text-left cursor-pointer group hover:shadow-lg ${
                    frequency === "MONTHLY"
                      ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                      : "border-slate-200 hover:border-slate-300 bg-background/50"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-colors ${
                      frequency === "MONTHLY"
                        ? "bg-primary text-white"
                        : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                    }`}
                  >
                    <CalendarRange className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-sm">Monthly</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    1st of each month at 6:00 AM
                  </p>
                  <p className="text-[10px] text-muted-foreground/70 mt-0.5">
                    Covers full previous month
                  </p>
                  {frequency === "MONTHLY" && (
                    <div className="absolute top-3 right-3 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                </button>
              </div>

              {/* Info Box */}
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-start gap-3">
                <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {frequency === "WEEKLY"
                    ? "Reports will be generated every Monday at 6:00 AM covering the previous Monday to Sunday. For example, on Monday Feb 10, reports will cover Feb 3–9."
                    : "Reports will be generated on the 1st of each month at 6:00 AM covering the entire previous month. For example, on Feb 1, reports will cover Jan 1–31."}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Email Toggle */}
          <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden relative border-t-4 border-t-emerald-500/50">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Send className="h-16 w-16" />
            </div>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Send className="h-5 w-5 text-emerald-500" />
                Email Notifications
              </CardTitle>
              <CardDescription>
                Enable or disable automated report email delivery.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-xl bg-background/50 border">
                <div className="space-y-1">
                  <Label className="text-sm font-bold">
                    Send Report Emails
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {emailEnabled
                      ? "Reports will be emailed automatically."
                      : "Email delivery is currently disabled."}
                  </p>
                </div>
                <Switch
                  checked={emailEnabled}
                  onCheckedChange={setEmailEnabled}
                />
              </div>

              <div
                className={`p-4 rounded-xl flex items-start gap-3 ${
                  emailEnabled
                    ? "bg-emerald-500/5 border border-emerald-500/10"
                    : "bg-amber-500/5 border border-amber-500/10"
                }`}
              >
                <AlertCircle
                  className={`h-5 w-5 shrink-0 mt-0.5 ${
                    emailEnabled ? "text-emerald-500" : "text-amber-500"
                  }`}
                />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {emailEnabled
                    ? `Reports will be sent ${frequency === "WEEKLY" ? "every Monday" : "on the 1st of each month"} to ${emails.length} recipient(s). Make sure SMTP is properly configured.`
                    : "Report generation is paused. Enable to start sending automated reports."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Email Recipients — Full Width */}
        <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden relative border-t-4 border-t-sky-500/50">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Mail className="h-16 w-16" />
          </div>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Mail className="h-5 w-5 text-sky-500" />
              Email Recipients
            </CardTitle>
            <CardDescription>
              Add multiple email addresses that will receive the reports.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Email Input */}
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="Enter email address and press Enter..."
                  value={emailInput}
                  onChange={(e) => {
                    setEmailInput(e.target.value);
                    setEmailError("");
                  }}
                  onKeyDown={handleKeyDown}
                  className={`h-11 bg-background/50 ${
                    emailError ? "border-red-400" : ""
                  }`}
                />
                {emailError && (
                  <p className="text-xs text-red-500 font-semibold mt-1">
                    {emailError}
                  </p>
                )}
              </div>
              <CommonButton
                type="button"
                variant="default"
                onClick={addEmail}
                leftIcon={<Plus className="h-4 w-4" />}
                className="h-11"
              >
                Add
              </CommonButton>
            </div>

            {/* Email Chips */}
            {emails.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {emails.map((email) => (
                  <div
                    key={email}
                    className="flex items-center gap-2 bg-sky-50 border border-sky-200 text-sky-800 px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 hover:bg-sky-100 group"
                  >
                    <Mail className="h-3.5 w-3.5 text-sky-500" />
                    <span>{email}</span>
                    <button
                      type="button"
                      onClick={() => removeEmail(email)}
                      className="w-5 h-5 rounded-full bg-sky-200 hover:bg-red-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl">
                <Mail className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground font-semibold">
                  No recipients added yet
                </p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  Add email addresses above to receive automated reports
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mt-2">
        <CommonButton
          type="button"
          variant="ghost"
          size="lg"
          onClick={handleReset}
          className="font-bold"
          leftIcon={<RefreshCcw className="h-4 w-4 mr-2" />}
        >
          Reset
        </CommonButton>
        <CommonButton
          type="button"
          size="lg"
          isLoading={updateMutation.isPending}
          onClick={handleSave}
          leftIcon={<Save className="h-5 w-5" />}
        >
          Save Configuration
        </CommonButton>
      </div>
    </div>
  );
}
