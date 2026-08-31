import { ChevronRight, LockKeyhole, ShieldCheck } from "lucide-react";

const SecuritySettings = () => {
  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Security
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage your password and account security.
          </p>
        </div>

        <div className="divide-y divide-gray-100">
          <button className="flex w-full items-center justify-between px-6 py-5 text-left hover:bg-gray-50">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-gray-100 p-2.5">
                <LockKeyhole size={18} />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-900">
                  Change Password
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Update your account password.
                </p>
              </div>
            </div>

            <ChevronRight size={18} className="text-gray-400" />
          </button>

          <div className="flex items-center justify-between gap-6 px-6 py-5">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-gray-100 p-2.5">
                <ShieldCheck size={18} />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-900">
                  Two-Factor Authentication
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Add an extra layer of security to your account.
                </p>
              </div>
            </div>

            <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Enable
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white">
        <div className="px-6 py-5">
          <h3 className="text-sm font-semibold text-gray-900">
            Active Sessions
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Manage devices currently signed into your account.
          </p>

          <div className="mt-5 flex items-center justify-between rounded-lg border border-gray-200 p-4">
            <div>
              <p className="text-sm font-medium text-gray-900">
                Chrome • Windows
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Current session
              </p>
            </div>

            <span className="text-xs font-medium text-green-600">
              Active
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SecuritySettings;