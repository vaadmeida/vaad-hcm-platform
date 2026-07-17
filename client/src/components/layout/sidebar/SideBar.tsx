import SideBarFooter from "./SideBarFooter";
import SideBarHeader from "./SideBarHeader";
import SideBarMenu from "./SideBarMenu";

const SideBar = () => {
  return (
    <aside className="flex h-screen w-72 flex-col border-r bg-secondary text-white">
      <SideBarHeader />

      <SideBarMenu/>

      <SideBarFooter />
    </aside>
  );
};

export default SideBar;