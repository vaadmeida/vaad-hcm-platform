const AuthBranding = () => {
  return (
    <section className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-linear-to-br from-[#1078A9] via-[#0D5F85] to-[#121417] p-12 text-white">
      {/* Decorative Blur */}
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-300/10 blur-3xl" />

      {/* Top */}
      <div className="relative z-10">
        <span className="inline-flex rounded-full bg-white/10 px-4 py-1 text-sm font-medium backdrop-blur">
          VAAD HR Platform
        </span>
      </div>

      {/* Center */}
      <div className="relative z-10 max-w-lg space-y-6">
        <h1 className="text-5xl font-bold leading-tight">
          Empowering Teams.
          <br />
          Simplifying HR.
        </h1>

        <p className="text-lg leading-8 text-slate-200">
          Manage employees, leave requests, departments, documents,
          and approvals from one secure platform built for modern organizations.
        </p>
      </div>

      {/* Bottom */}
      <div className="relative z-10 flex items-center justify-between text-sm text-slate-300">
        <span>Secure • Reliable • Scalable</span>

        <span>Version 1.0</span>
      </div>
    </section>
  );
};

export default AuthBranding;