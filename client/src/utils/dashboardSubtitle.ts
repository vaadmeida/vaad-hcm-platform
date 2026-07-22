import { formatCurrentDate } from "./date";

export const dashboardSubtitle = {
  admin: `Here's your organization at a glance — ${formatCurrentDate()}`,

  hr: `Monitor your workforce, leave activity, and HR operations — ${formatCurrentDate()}`,

  manager: `Here's your team's overview — ${formatCurrentDate()}`,

  employee: `Track your profile, leave requests, and work updates — ${formatCurrentDate()}`,
};