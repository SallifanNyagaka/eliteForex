import { AdminLoginForm } from "@/components/admin-login-form";

export default function AdminLoginPage() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY ?? "";

  return (
    <main className="admin-auth-shell">
      <section className="admin-auth-card">
        <p className="eyebrow">Admin Access</p>
        <h1>Sign in to manage content</h1>
        <p className="admin-auth-copy">
          Use the Supabase Auth user you created, then manage landing page content from one secure place.
        </p>
        <AdminLoginForm supabaseUrl={supabaseUrl} supabaseAnonKey={supabaseAnonKey} />
      </section>
    </main>
  );
}
