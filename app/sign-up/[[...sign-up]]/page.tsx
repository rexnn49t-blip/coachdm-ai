import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6">
      <SignUp
        appearance={{
          elements: {
            card: "bg-zinc-900 border border-zinc-800 shadow-xl",
            headerTitle: "text-white",
            headerSubtitle: "text-gray-400",
            socialButtonsBlockButton:
              "border border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700",
            formButtonPrimary:
              "bg-blue-600 hover:bg-blue-700 text-white",
            footerActionLink:
              "text-blue-500 hover:text-blue-400",
          },
        }}
      />
    </main>
  );
}