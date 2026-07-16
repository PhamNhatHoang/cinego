"use client";

import PublicHeader from "@/components/layouts/public/PublicHeader";
import PublicFooter from "@/components/layouts/public/PublicFooter";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-background text-foreground transition-colors duration-300">
      <PublicHeader />
      
      {/* Main Page Content */}
      <main className="flex-1 w-full">
        {children}
      </main>

      <PublicFooter />
    </div>
  );
}

