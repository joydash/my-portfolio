import LoginForm from "@/components/admin/LoginForm";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <div className="card w-full max-w-sm p-6 sm:p-8">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">{"//"} admin</p>
        <h1 className="mt-2 text-2xl font-semibold text-fg">Sign in</h1>
        {isSupabaseConfigured ? (
          <LoginForm />
        ) : (
          <p className="mt-4 text-sm text-muted">
            Supabase is not configured. Set <code className="font-mono text-accent">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code className="font-mono text-accent">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, then redeploy.
          </p>
        )}
      </div>
    </main>
  );
}
