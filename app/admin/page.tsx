import { AdminDashboard } from "@/components/admin-dashboard";

export default function AdminPage() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY ?? "";

  return <AdminDashboard supabaseUrl={supabaseUrl} supabaseAnonKey={supabaseAnonKey} />;
}
