import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import AddOnboardingMaterialModal from "./AddOnboardingMaterialModal";



const OnboardingToolBar = () => {

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);


  return (

    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Onboarding Materials
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage documents, videos, and resources available to employees.
            </p>
          </div>

          <Button
            className="h-9 cursor-pointer gap-2 rounded-lg px-3 text-sm text-white"
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Material
          </Button>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

          <Input
            placeholder="Search onboarding materials..."
            className="h-9 rounded-lg border border-slate-300 bg-slate-100 pl-9 text-sm shadow-none transition-all focus:bg-white focus:ring-2 focus:ring-primary/15"
          />
        </div>
      </div>
      <AddOnboardingMaterialModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
      />
    </>

  );
};

export default OnboardingToolBar;