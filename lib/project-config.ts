export type ProjectPhase = {
  id: string;
  name: string;
  start: string;
  end: string;
};

export type NavigationItem = {
  label: string;
  href: string;
};

export const projectConfig = {
  name: "Projected Histories",
  subtitle: "St Peter’s Goes Digital",
  location: "St Peter’s Precinct, South End, Gqeberha, South Africa",
  projectStatus: "TO BE CONFIRMED",
  currentPhase: "TO BE CONFIRMED",
  nextMilestone: "TO BE CONFIRMED",
  learningTheme: "Heritage + People + Art + Technology + Storytelling",
  phaseDates: [
    { id: "phase-1", name: "Phase 1", start: "14 September 2026", end: "30 September 2026" },
    { id: "phase-2", name: "Phase 2", start: "1 October 2026", end: "30 October 2026" },
    { id: "phase-3", name: "Phase 3", start: "1 November 2026", end: "30 November 2026" },
    { id: "phase-4", name: "Phase 4", start: "4 January 2027", end: "28 February 2027" },
    { id: "phase-5", name: "Phase 5", start: "1 March 2027", end: "19 March 2027" },
  ] satisfies ProjectPhase[],
};

export const navigationItems: NavigationItem[] = [
  { label: "Dashboard", href: "/" },
  { label: "My Work", href: "/my-work" },
  { label: "Tasks", href: "/tasks" },
  { label: "Workstreams", href: "/workstreams" },
  { label: "Timeline", href: "/timeline" },
  { label: "Documents", href: "/documents" },
  { label: "Meetings", href: "/meetings" },
  { label: "Team", href: "/team" },
  { label: "Suppliers", href: "/suppliers" },
  { label: "Risks & Issues", href: "/risks-and-issues" },
  { label: "Announcements", href: "/announcements" },
  { label: "Reports", href: "/reports" },
];
