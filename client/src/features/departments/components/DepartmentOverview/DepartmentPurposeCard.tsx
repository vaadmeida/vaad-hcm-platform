import { Target } from "lucide-react";

interface DepartmentPurposeCardProps {
  purpose: string | null;
}

const DepartmentPurposeCard = ({
  purpose,
}: DepartmentPurposeCardProps) => {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-[#1078A9]">
          <Target className="h-5 w-5" />
        </div>

        <div>
          <h3 className="font-semibold text-gray-900">
            Role Purpose
          </h3>
          <p className="text-sm text-gray-500">
            Why this department exists
          </p>
        </div>
      </div>

      {purpose?.trim() ? (
        <p className="mt-4 whitespace-pre-line text-sm leading-6 text-gray-700">
          {purpose}
        </p>
      ) : (
        <p className="mt-4 rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-500">
          No role purpose has been defined yet.
        </p>
      )}
    </section>
  );
};

export default DepartmentPurposeCard;