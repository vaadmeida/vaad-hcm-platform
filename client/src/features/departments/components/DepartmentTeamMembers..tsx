import { UserPlus, MoreVertical } from "lucide-react";
import { useTeamMembers } from "../hooks/useTeamMembers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DepartmentTeamMembersProps {
  departmentId: string;
}

const DepartmentTeamMembers = ({
  departmentId,
}: DepartmentTeamMembersProps) => {
  const { data, isLoading, error } = useTeamMembers(departmentId);

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-white p-6">
        <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />

        <div className="mt-6 space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex items-center gap-3"
            >
              <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />

              <div className="space-y-2">
                <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
                <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border bg-white p-6">
        <p className="text-sm text-red-600">
          Failed to load team members.
        </p>
      </div>
    );
  }

  const members = data?.members ?? [];

  console.log("MANAGER DATA:", data?.manager);
console.log("MANAGER AVATAR URL:", data?.manager?.avatar_url);

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-secondary">
            Team Members
            <span className="ml-1 text-muted-foreground">
              ({members.length})
            </span>
          </h2>

          <p className="mt-0.5 text-xs text-muted-foreground">
            Employees in this department
          </p>
        </div>

        <button
          type="button"
          className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-medium text-white transition hover:bg-[#0d658e]"
        >
          <UserPlus className="h-3.5 w-3.5" />
          Add Member
        </button>
      </div>


      {/* Manager */}
      {data?.manager && (
        <div className="border-b border-gray-100 bg-gray-50/60 px-5 py-4">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Department Manager
          </p>

          <div className="flex items-center gap-3">

            {/* Avatar */}
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarImage
                src={data.manager?.avatar_url || undefined}
                alt={`${data.manager?.first_name} ${data.manager?.last_name}`}
              />

              <AvatarFallback className="bg-primary text-sm font-semibold text-white">
                {data.manager?.first_name?.[0]}
                {data.manager?.last_name?.[0]}
              </AvatarFallback>
            </Avatar>


            {/* Info */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-secondary">
                {data.manager.first_name} {data.manager.last_name}
              </p>

              <p className="truncate text-xs text-muted-foreground">
                {data.manager.job_title || "Department Manager"}
              </p>
            </div>

            {/* Status */}
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ${data.manager.status === "active"
                ? "bg-green-50 text-green-700"
                : "bg-gray-100 text-gray-600"
                }`}
            >
              {data.manager.status}
            </span>

            {/* Invisible spacer to align with member action buttons */}
            <div className="h-8 w-8 shrink-0" />
          </div>
        </div>
      )}
      {/* Members */}
      <div className="divide-y divide-gray-100">
        {members.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-sm font-medium text-secondary">
              No team members
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Add employees to this department to see them here.
            </p>
          </div>
        ) : (
          members.map((member) => {
            const initials = `${member.first_name[0] ?? ""}${member.last_name[0] ?? ""
              }`.toUpperCase();

            return (
              <div
                key={member.id}
                className="flex items-center gap-3 px-5 py-4 transition hover:bg-gray-50"
              >
                {/* Avatar */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-sm font-semibold text-[#1078A9]">
                  {member.avatar_url ? (
                    <img
                      src={member.avatar_url}
                      alt={`${member.first_name} ${member.last_name}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-secondary">
                    {member.first_name} {member.last_name}
                  </p>

                  <p className="truncate text-xs text-muted-foreground">
                    {member.job_title || "No job title"}
                  </p>
                </div>

                {/* Status */}
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ${member.status === "active"
                    ? "bg-green-50 text-green-700"
                    : "bg-gray-100 text-gray-600"
                    }`}
                >
                  {member.status}
                </span>

                {/* Actions */}
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DepartmentTeamMembers;