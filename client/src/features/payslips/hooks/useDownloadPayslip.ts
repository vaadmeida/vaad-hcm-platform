import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { getPayslipDownloadApi } from "../api/payslip.api";

export const useDownloadPayslip = () => {
    return useMutation({
        mutationFn: getPayslipDownloadApi,

        onSuccess: ({ downloadUrl }) => {
            window.location.assign(downloadUrl);
        },

        onError: (error) => {
            const message = isAxiosError<{ message?: string }>(error)
                ? error.response?.data?.message
                : undefined;

            toast.error(message || "Unable to download payslip. Please try again.");
        },
    });
};