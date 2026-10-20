import { BarChart3, ClipboardList, Target } from "lucide-react";

import type { Department } from "../../types/departments.types";
import DepartmentPurposeCard from "./DepartmentPurposeCard";
import DepartmentListCard from "./DepartmentListCard";
import DepartmentAuthorityCard from "./DepartmentAuthorityCard";

interface DepartmentOverviewProps {
  department: Department;
}

const DepartmentOverview = ({
  department,
}: DepartmentOverviewProps) => {
  return (
    <div className="space-y-6">
      {/* Department Purpose */}
      <DepartmentPurposeCard
        purpose={department.role_purpose}
      />

      {/* Responsibilities, Outputs, and KPIs */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <DepartmentListCard
          title="Core Responsibilities"
          description="Key duties of this department"
          items={department.core_responsibilities ?? []}
          icon={ClipboardList}
        />

        <DepartmentListCard
          title="Key Outputs"
          description="Expected deliverables and results"
          items={department.key_outputs ?? []}
          icon={Target}
        />

        <DepartmentListCard
          title="Key Performance Indicators"
          description="How departmental performance is measured"
          items={department.kpis ?? []}
          icon={BarChart3}
        />

        <DepartmentAuthorityCard
          decisionAuthority={department.decision_authority}
          backupContinuity={department.backup_continuity}
        />
      </div>
    </div>
  );
};

export default DepartmentOverview;