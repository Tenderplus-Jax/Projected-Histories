"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { navigationItems, projectConfig } from "@/lib/project-config";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

function SidebarItem({ label, href, current }: { label: string; href: string; current: boolean }) {
  return (
    <li>
      <Link
        href={href}
        className={[
          "group relative flex items-center rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors",
          current
            ? "border-[var(--heritage-blue)] bg-[var(--heritage-blue)] text-white shadow-[0_8px_18px_rgba(15,91,122,0.25)]"
            : "border-transparent bg-transparent text-stone-300 hover:border-white/10 hover:bg-white/5 hover:text-white",
        ].join(" ")}
      >
        <span className="truncate">{label}</span>
      </Link>
    </li>
  );
}

function MobileNavItem({ label, href, current }: { label: string; href: string; current: boolean }) {
  return (
    <Link
      href={href}
      className={[
        "flex items-center justify-between rounded-xl border px-3 py-2 text-sm font-medium transition-colors",
        current
          ? "border-[var(--heritage-blue)] bg-[var(--heritage-blue)] text-white"
          : "border-stone-200 bg-white text-stone-700",
      ].join(" ")}
    >
      <span>{label}</span>
    </Link>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      router.push("/login");
      return;
    }

    const { error } = await supabase.auth.signOut();

    if (!error) {
      router.push("/login");
      router.refresh();
    }
  }

  return (
    <div className="site-shell min-h-screen text-stone-800">
      <div className="mx-auto flex min-h-screen max-w-[1800px]">
        <aside className="hidden w-[280px] shrink-0 border-r border-[var(--border)] bg-[rgba(18,24,28,0.98)] p-5 text-stone-100 lg:flex lg:flex-col">
          <div className="mb-8 flex items-center gap-3 border-b border-white/10 pb-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-[var(--heritage-blue)] text-sm font-semibold text-white shadow-[0_8px_18px_rgba(15,91,122,0.35)]">
              PH
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-300">
                PROJECT
              </p>
              <h1 className="text-lg font-semibold text-white">{projectConfig.name}</h1>
            </div>
          </div>

          <nav className="flex-1">
            <ul className="space-y-1.5">
              {navigationItems.map((item) => (
                <SidebarItem
                  key={item.href}
                  label={item.label}
                  href={item.href}
                  current={pathname === item.href}
                />
              ))}
            </ul>
          </nav>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-300">
              Settings
            </p>
            <Link
              href="/settings"
              className="mt-2 inline-flex items-center rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-stone-100 transition-colors hover:border-[var(--heritage-blue)]/60 hover:bg-[var(--heritage-blue)]/10"
            >
              Admin / Settings
            </Link>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-[var(--border)] bg-[rgba(255,255,255,0.78)] backdrop-blur supports-[backdrop-filter]:bg-[rgba(255,255,255,0.82)]">
            <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-stone-300 bg-white text-stone-700 lg:hidden"
                  aria-label="Open navigation menu"
                >
                  ☰
                </button>
                <div className="min-w-0">
                  <p className="truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--stone-600)]">
                    {projectConfig.subtitle}
                  </p>
                  <p className="truncate text-sm text-stone-700">{projectConfig.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-medium text-stone-700 shadow-[0_8px_16px_rgba(15,91,122,0.05)] hover:border-[var(--heritage-blue)]/30 hover:text-[var(--heritage-blue-deep)]"
                  aria-label="View notifications"
                >
                  Alerts <span className="ml-1 text-stone-400">(0)</span>
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-medium text-stone-700 shadow-[0_8px_16px_rgba(15,91,122,0.05)] transition-colors hover:border-[var(--heritage-blue)]/30 hover:text-[var(--heritage-blue-deep)]"
                >
                  Logout
                </button>
                <div className="flex items-center gap-3 rounded-xl border border-stone-300 bg-white px-2.5 py-1.5 shadow-[0_8px_18px_rgba(15,91,122,0.08)]">
                  <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[var(--charcoal)] text-sm font-semibold text-white">
                    PH
                  </div>
                  <div className="hidden text-left sm:block">
                    <p className="text-sm font-medium text-stone-900">Project Team</p>
                    <p className="text-xs text-stone-500">Workspace access</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </div>

      <div className="border-t border-[var(--border)] bg-[rgba(255,255,255,0.8)] lg:hidden">
        <nav className="flex gap-2 overflow-x-auto px-3 py-3" aria-label="Mobile navigation">
          {navigationItems.map((item) => (
            <MobileNavItem
              key={item.href}
              label={item.label}
              href={item.href}
              current={pathname === item.href}
            />
          ))}
        </nav>
      </div>
    </div>
  );
}
