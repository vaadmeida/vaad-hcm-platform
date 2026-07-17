import logo from "@/assets/vaad_icon.jpeg";

const SideBarHeader = () => {
  return (
    <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
      <img
        src={logo}
        alt="VAAD HR"
        className="h-10 w-10 object-contain rounded-full"
      />

      <div>
        <h1 className="text-base font-semibold tracking-wide text-white">
          VAAD HR
        </h1>

        <p className="text-xs text-gray-400">
          Human Resource Platform
        </p>
      </div>
    </div>
  );
};

export default SideBarHeader;