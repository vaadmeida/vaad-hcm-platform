const AuthBranding = () => {
  return (
    <section className="relative hidden min-h-screen overflow-hidden lg:flex">
      <img
        src="https://cdn.prod.website-files.com/684a77fcc9386d728b27a8b6/68c2727606984962c154cc9b_Corpoladder%20content%20image%281%29%20%283%29.jpg"
        alt="Professionals collaborating"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-linear-to-br from-[#1078A9]/85 to-[#121417]/75" />

      <div className="relative z-10 flex min-h-screen w-full flex-col justify-between p-12">
        {/* Accent */}
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-white" />
          <span className="text-sm font-medium tracking-wide text-white/80">
            VAAD 
          </span>
        </div>

        {/* Main */}
        <div className="max-w-md">
          <div className="mb-6 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/80 backdrop-blur-sm">
            Human Capital Management Platform
          </div>

          <h1 className="text-5xl font-semibold leading-tight tracking-tight text-white">
            Empower your workforce.
          </h1>

          <p className="mt-4 text-lg text-white/75">
            Everything you need to manage your people effectively.
          </p>

          {/* Mini stat card */}
          <div className="mt-8 w-fit rounded-xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-md">
            <p className="text-xs uppercase tracking-wider text-white/50">
              Built for modern teams
            </p>
            <p className="mt-1 text-xl font-semibold text-white">
              People. Performance. Progress.
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-sm text-white/50">
          © {new Date().getFullYear()} VAAD
        </p>
      </div>
    </section>
  );
};

export default AuthBranding;