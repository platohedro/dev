import { SiteHeader } from "@/app/components/SiteHeader";
import { AdminNotifier } from "@/app/components/AdminNotifier";

export const metadata = { robots: { index: false, follow: false } };

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
      <SiteHeader />
      <AdminNotifier />
      {children}
    </div>
  );
}
