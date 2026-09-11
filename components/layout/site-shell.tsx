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
          "group flex items-center rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors",
          current
            ? "border-stone-900 bg-stone-900 text-stone-50"
            : "border-transparent bg-transparent text-stone-600 hover:border-stone-200 hover:bg-stone-100 hover:text-stone-900",
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
          ? "border-stone-900 bg-stone-900 text-stone-50"
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
    <div className="min-h-screen bg-[#f7f4ef] text-stone-800">
      <div className="mx-auto flex min-h-screen max-w-[1800px]">
        <aside className="hidden w-[280px] shrink-0 border-r border-stone-200 bg-[#f2efe9] p-5 lg:flex lg:flex-col">
          <div className="mb-8 flex items-center gap-3 border-b border-stone-200 pb-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-stone-800 bg-stone-900 text-sm font-semibold text-stone-50">
              PH
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500">
                PROJECT
              </p>
              <h1 className="text-lg font-semibold text-stone-900">{projectConfig.name}</h1>
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

          <div className="mt-6 rounded-2xl border border-stone-300 bg-stone-50 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500">
              Settings
            </p>
            <Link
              href="/settings"
              className="mt-2 inline-flex items-center rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-medium text-stone-700 transition-colors hover:border-stone-400 hover:text-stone-900"
            >
              Admin / Settings
            </Link>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-stone-200 bg-[#fbfaf8]/90 backdrop-blur supports-[backdrop-filter]:bg-[#fbfaf8]/80">
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
                  <p className="truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500">
                    {projectConfig.subtitle}
                  </p>
                  <p className="truncate text-sm text-stone-700">{projectConfig.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-medium text-stone-700"
                  aria-label="View notifications"
                >
                  Alerts <span className="ml-1 text-stone-400">(0)</span>
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-medium text-stone-700 transition-colors hover:border-stone-400 hover:text-stone-900"
                >
                  Logout
                </button>
                <div className="flex items-center gap-3 rounded-xl border border-stone-300 bg-white px-2.5 py-1.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-900 text-sm font-semibold text-stone-50">
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

      <div className="border-t border-stone-200 bg-white lg:hidden">
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
