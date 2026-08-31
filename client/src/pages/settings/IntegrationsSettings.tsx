import { Link2 } from "lucide-react";

const IntegrationsSettings = () => {
  return (
    <section className="rounded-xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-6 py-5">
        <h2 className="text-lg font-semibold text-gray-900">
          Integrations
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Connect VAAD HR with other applications and services.
        </p>
      </div>

      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-gray-100 p-3">
              <Link2 size={20} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Google Workspace
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Connect Google services with VAAD HR.
              </p>
            </div>
          </div>

          <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Connect
          </button>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-gray-100 p-3">
              <Link2 size={20} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Slack
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Send HR notifications to Slack.
              </p>
            </div>
          </div>

          <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Connect
          </button>
        </div>
      </div>
    </section>
  );
};

export default IntegrationsSettings;