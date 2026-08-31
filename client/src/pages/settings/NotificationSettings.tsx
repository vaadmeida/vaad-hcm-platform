import { useState } from "react";

const NotificationSettings = () => {
    const [settings, setSettings] = useState({
        leaveRequests: true,
        leaveApprovals: true,
        documentExpiration: false,
    });

    const notifications = [
        {
            key: "leaveRequests",
            title: "Leave Requests",
            description: "When an employee submits a leave request.",
        },
        {
            key: "leaveApprovals",
            title: "Leave Approvals",
            description: "When a leave request is approved or rejected.",
        },
        {
            key: "documentExpiration",
            title: "Document Expiration",
            description: "When an employee document is about to expire.",
        },
    ] as const;

    const toggle = (key: keyof typeof settings) => {
        setSettings((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    return (
        <section className="rounded-xl border border-gray-200 bg-white">
            {/* Header */}
            <div className="border-b border-gray-200 px-6 py-5">
                <h2 className="text-lg font-semibold text-gray-900">
                    Notifications
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Choose the notifications you want to receive.
                </p>
            </div>

            {/* Notifications */}
            <div className="divide-y divide-gray-100">
                {notifications.map(({ key, title, description }) => {
                    const enabled = settings[key];

                    return (
                        <div
                            key={key}
                            className="flex items-center justify-between gap-6 px-6 py-5"
                        >
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-900">
                                    {title}
                                </p>

                                <p className="mt-1 text-sm text-gray-500">
                                    {description}
                                </p>
                            </div>
                            {/* Toggle */}
                            <button
                                type="button"
                                role="switch"
                                aria-checked={enabled}
                                aria-label={`Toggle ${title}`}
                                onClick={() => toggle(key)}
                                className={`inline-flex h-6 w-11 shrink-0 items-center rounded-full p-1 transition-colors ${enabled ? "bg-primary" : "bg-gray-300"
                                    }`}
                            >
                                <span
                                    className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${enabled ? "translate-x-5" : "translate-x-0"
                                        }`}
                                />
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="flex justify-end border-t border-gray-200 px-6 py-4">
                <button
                    type="button"
                    className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary/90"
                >
                    Save Changes
                </button>
            </div>
        </section>
    );
};

export default NotificationSettings;