export type ProjectMembershipStatus = "pending" | "approved" | "rejected" | "suspended";

export type ProjectProfile = {
  id: string;
  auth_user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
  updated_at: string;
};

export type ProjectMembership = {
  id: string;
  user_id: string;
  status: ProjectMembershipStatus;
  created_at: string;
  updated_at: string;
};

export const membershipStatusLabels: Record<ProjectMembershipStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  suspended: "Suspended",
};
