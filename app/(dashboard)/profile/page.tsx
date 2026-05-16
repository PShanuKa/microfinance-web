"use client";

import React from "react";
import { useGetMeQuery } from "@/services/authApi";
import { PageHeader } from "@/components/Custom/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Building2, 
  KeyRound, 
  Calendar, 
  UserCircle2,
  ArrowLeft,
  BadgeCheck
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

export default function ProfilePage() {
  const router = useRouter();
  const { data: userData, isLoading } = useGetMeQuery();
  const user = userData?.user;

  if (isLoading) {
    return <div className="p-10 text-center font-medium text-slate-500">Loading profile data...</div>;
  }

  return (
    <div className="flex flex-col gap-6 w-full md:px-4 pb-10">
      <PageHeader 
        title="Profile Settings" 
        description="View your account details and security settings"
      >
        <Button variant="outline" onClick={() => router.back()} className="gap-2 rounded-xl">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <Card className="lg:col-span-1 border-none shadow-xl bg-card/60 backdrop-blur-md h-fit">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary border-4 border-white shadow-lg mb-4">
              <User size={48} strokeWidth={1.5} />
            </div>
            <CardTitle className="text-2xl font-black text-slate-800">{user?.fullname}</CardTitle>
            <div className="flex justify-center mt-2">
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 px-4 py-1 rounded-full font-bold uppercase text-[10px] tracking-wider">
                {user?.role?.replace("_", " ")}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="text-center pb-8">
             <p className="text-slate-500 text-sm font-medium">{user?.email}</p>
          </CardContent>
        </Card>

        {/* Details Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-800">
                <UserCircle2 className="w-5 h-5 text-primary" /> Personal Information
              </CardTitle>
              <CardDescription>Official account details as registered in the system</CardDescription>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <LabelItem icon={<User className="w-4 h-4" />} label="Full Name" />
                <p className="text-slate-800 font-bold ml-6">{user?.fullname}</p>
              </div>

              <div className="space-y-1">
                <LabelItem icon={<Mail className="w-4 h-4" />} label="Email Address" />
                <p className="text-slate-800 font-bold ml-6">{user?.email}</p>
              </div>

              <div className="space-y-1">
                <LabelItem icon={<ShieldCheck className="w-4 h-4" />} label="System Role" />
                <div className="flex items-center gap-2 ml-6">
                  <span className="text-slate-800 font-bold">{user?.role?.replace("_", " ")}</span>
                  <BadgeCheck className="w-4 h-4 text-emerald-500" />
                </div>
              </div>

              <div className="space-y-1">
                <LabelItem icon={<Building2 className="w-4 h-4" />} label="Assigned Branches" />
                <div className="flex flex-wrap gap-2 ml-6 mt-1">
                  {user?.branch?.length > 0 ? user.branch.map((b: string) => (
                    <Badge key={b} variant="secondary" className="font-bold text-[10px]">{b}</Badge>
                  )) : <span className="text-slate-400 italic text-sm">No branches assigned</span>}
                </div>
              </div>

              <div className="space-y-1">
                <LabelItem icon={<Calendar className="w-4 h-4" />} label="Account Created" />
                <p className="text-slate-800 font-bold ml-6">
                  {user?.createdAt ? format(new Date(user.createdAt), "PPP") : "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Security Card */}
          <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-800">
                <ShieldCheck className="w-5 h-5 text-amber-500" /> Security & Privacy
              </CardTitle>
              <CardDescription>Manage your account security and password</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-2xl bg-amber-50/50 border border-amber-100">
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                    <KeyRound size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Password Settings</h4>
                    <p className="text-sm text-slate-500 font-medium">It's a good idea to use a strong password that you're not using elsewhere</p>
                  </div>
                </div>
                <Button className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-8 rounded-xl shadow-lg shadow-amber-600/20 gap-2">
                  <KeyRound size={18} /> Reset Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function LabelItem({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <div className="flex items-center gap-2 text-slate-400 text-[10px] uppercase font-black tracking-widest">
      {icon}
      <span>{label}</span>
    </div>
  );
}
