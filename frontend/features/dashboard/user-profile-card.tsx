"use client";

import { User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Profile } from "@/types";

export function UserProfileCard({ profile }: { profile: Profile | undefined }) {
  return (
    <Card className="border-[#252840] bg-[#1a1d2e] shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg text-white">User Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#6dbf8f]/10 text-[#6dbf8f]">
            <User className="h-7 w-7" />
          </div>
          <div className="space-y-1 text-sm">
            <p className="text-base font-semibold text-white">
              {profile?.full_name || "Complete your profile"}
            </p>
            <p className="text-[#a0a8b8]">{profile?.email || "—"}</p>
            <p className="text-[#a0a8b8]">{profile?.phone_number || "No phone"}</p>
            <p className="text-[#a0a8b8]">
              {profile?.age ? `${profile.age} yrs` : "Age —"} · {profile?.gender || "Gender —"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
