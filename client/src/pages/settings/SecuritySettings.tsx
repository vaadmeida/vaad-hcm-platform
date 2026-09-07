import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useChangePassword } from "@/features/auth/hooks/useChangePassword";
import type { ApiErrorResponse } from "@/features/auth/types/auth.types";
import { AxiosError } from "axios";
import { ChevronRight, Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const SecuritySettings = () => {

  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const { mutate: changePassword, isPending: isChangingPassword } = useChangePassword();

  const handleChangePassword = () => {
    changePassword(passwordData, {
      onSuccess: () => {
        toast.success("Password changed successfully");

        setPasswordData({
          current_password: "",
          new_password: "",
          confirm_password: "",
        });

        setIsChangePasswordOpen(false);
      },
      onError: (error: AxiosError<ApiErrorResponse>) => {
        const response = error.response?.data;

        const confirmPasswordError = (
          response?.detail as {
            confirm_password?: {
              _errors?: string[];
            };
          } | undefined
        )?.confirm_password?._errors?.[0];

        toast.error(
          confirmPasswordError ||
          response?.message ||
          "Failed to change password"
        );
      },
    });
  };

  return (
    <>
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
            <button
              type="button"
              onClick={() => setIsChangePasswordOpen(true)}
              className="flex w-full items-center justify-between px-6 py-5 text-left hover:bg-gray-50 cursor-pointer"
            >
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


      <Dialog
        open={isChangePasswordOpen}
        onOpenChange={setIsChangePasswordOpen}
      >
        <DialogContent className="max-w-md rounded-xl p-0 bg-white">
          <DialogHeader className="border-b border-gray-100 px-6 py-5">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-primary/10 p-2.5">
                <LockKeyhole
                  size={20}
                  className="text-primary"
                />
              </div>

              <div>
                <DialogTitle className="text-base font-semibold text-gray-900">
                  Change Password
                </DialogTitle>

                <DialogDescription className="mt-1 text-sm text-gray-500">
                  Update your password to keep your account secure.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleChangePassword()
            }}

            className="space-y-5 px-6 py-6"
          >
            {/* Current Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Current Password
              </label>

              <div className="relative">
                <Input
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordData.current_password}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      current_password: e.target.value,
                    }))
                  }
                  placeholder="Enter your current password"
                  className="h-11 pr-11"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowCurrentPassword((prev) => !prev)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showCurrentPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                New Password
              </label>

              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.new_password}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      new_password: e.target.value,
                    }))
                  }
                  placeholder="Enter your new password"
                  className="h-11 pr-11"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowNewPassword((prev) => !prev)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showNewPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              <p className="mt-1.5 text-xs text-gray-400">
                Password must be at least 8 characters.
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>

              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordData.confirm_password}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      confirm_password: e.target.value,
                    }))
                  }
                  placeholder="Confirm your new password"
                  className="h-11 pr-11"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((prev) => !prev)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsChangePasswordOpen(false)}
                className="h-10 px-5"
              >
                Cancel
              </Button>

              <Button
                disabled={isChangingPassword}
                type="submit"
                className="h-10 bg-primary px-5 hover:bg-primary-hover text-white"
              >
                {
                  isChangingPassword ? "Changing Password...." :
                    "Change Password"
                }
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>

  );
};

export default SecuritySettings;