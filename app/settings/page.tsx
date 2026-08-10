import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import SettingsHeader from "@/components/settings/SettingsHeader";
import SettingsSidebar from "@/components/settings/SettingsSidebar";
import SettingsContent from "@/components/settings/SettingsContent";
import ProfileCard from "@/components/settings/ProfileCard";

export default async function SettingsPage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    redirect("/sign-in");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:60px_60px] opacity-[0.05]" />

      {/* Purple Glow */}
      <div className="absolute left-1/2 top-40 h-[550px] w-[550px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[170px]" />

      {/* Blue Glow */}
      <div className="absolute right-0 top-0 h-[350px] w-[350px] rounded-full bg-sky-500/10 blur-[150px]" />

      <div className="relative mx-auto max-w-7xl space-y-8 px-4 py-24 sm:px-6 sm:py-28 lg:space-y-10 lg:px-8 lg:py-32">
        <SettingsHeader />

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Sidebar */}
          <SettingsSidebar />

          {/* Main Content */}
          <div className="space-y-8">
            <ProfileCard />

            <SettingsContent
              userEmail={
                user.primaryEmailAddress?.emailAddress ??
                ""
              }
            />
          </div>
        </div>
      </div>
    </main>
  );
}