import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import SettingsHeader from "@/components/settings/SettingsHeader";
import SettingsSidebar from "@/components/settings/SettingsSidebar";
import SettingsContent from "@/components/settings/SettingsContent";
import ProfileCard from "@/components/settings/ProfileCard";

type SettingsPageProps = {
  searchParams: Promise<{
    tab?: string;
  }>;
};

export default async function SettingsPage({
  searchParams,
}: SettingsPageProps) {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    redirect("/sign-in");
  }

  const params = await searchParams;
  const activeTab = params.tab || "general";

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Background Grid */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:60px_60px] opacity-[0.04]" />

      {/* Purple Glow */}
      <div className="pointer-events-none absolute left-1/2 top-40 h-[550px] w-[550px] -translate-x-1/2 rounded-full bg-violet-600/[0.08] blur-[170px]" />

      {/* Blue Glow */}
      <div className="pointer-events-none absolute right-0 top-0 h-[350px] w-[350px] rounded-full bg-sky-500/[0.05] blur-[150px]" />

      <div className="relative mx-auto max-w-7xl space-y-8 px-4 py-24 sm:px-6 sm:py-28 lg:space-y-10 lg:px-8 lg:py-32">
        {/* Header */}
        <SettingsHeader />

        {/* Settings Layout */}
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Sidebar */}
          <SettingsSidebar />

          {/* Main Content */}
          <div className="min-w-0">
            {/* Profile Card — Account tab only */}
            {activeTab === "account" && (
              <div className="mb-10">
                <ProfileCard />
              </div>
            )}

            {/* Tab Content */}
            <SettingsContent
              userEmail={
                user.primaryEmailAddress?.emailAddress ?? ""
              }
            />
          </div>
        </div>
      </div>
    </main>
  );
}