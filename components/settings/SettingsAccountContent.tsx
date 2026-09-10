"use client";

import { useSearchParams } from "next/navigation";

import ProfileCard from "./ProfileCard";

export default function SettingsAccountContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "general";

  if (activeTab !== "account") {
    return null;
  }

  return (
    <div className="mb-10">
      <ProfileCard />
    </div>
  );
}