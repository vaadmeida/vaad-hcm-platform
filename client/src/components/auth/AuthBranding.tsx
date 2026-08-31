import vaadLogo from "../../assets/vaad_logo.png";
const AuthBranding = () => {
  return (
    <section className="relative hidden min-h-screen overflow-hidden lg:flex">
      {/* Background Image */}
      <img
        src="https://cdn.prod.website-files.com/684a77fcc9386d728b27a8b6/68c2727606984962c154cc9b_Corpoladder%20content%20image%281%29%20%283%29.jpg"
        alt="Professionals collaborating in the workplace"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* VAAD Overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-[#1078A9]/85 via-[#1078A9]/65 to-[#121417]/70" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen w-full flex-col justify-between p-12 xl:p-16">

        {/* Brand */}
        <div>
          <img
            src={vaadLogo}
            alt="VAAD"
            className="h-10 w-auto object-contain"
          />

          <p className="mt-2 text-sm font-medium tracking-wide text-white/75">
            Human Capital Management
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-white/70">
            Your people. Your advantage.
          </p>

          <h1 className="text-5xl font-semibold leading-[1.08] tracking-tight text-white xl:text-6xl">
            Empower your workforce.
          </h1>

          <p className="mt-5 max-w-lg text-lg leading-8 text-white/80">
            Everything you need to manage people, simplify operations,
            and build a stronger organization.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-white/55">
          <span>Human Capital Management</span>

          <span>© {new Date().getFullYear()} VAAD</span>
        </div>
      </div>
    </section>
  );
};

export default AuthBranding;