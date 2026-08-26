import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import ButtonLoader from "@/components/common/ButtonLoader";

interface RejectLeaveDialogProps {
  open: boolean;
  rejectionReason: string;
  isPending: boolean;
  onReasonChange: (reason: string) => void;
  onClose: () => void;
  onReject: () => void;
}

const RejectLeaveDialog = ({
  open,
  rejectionReason,
  isPending,
  onReasonChange,
  onClose,
  onReject,
}: RejectLeaveDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="bg-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reject Leave Request</DialogTitle>

          <DialogDescription>
            Please provide a reason for rejecting this leave request.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          <label
            htmlFor="rejection-reason"
            className="text-sm font-medium text-gray-900"
          >
            Rejection reason
          </label>

          <Textarea
            id="rejection-reason"
            value={rejectionReason}
            onChange={(e) => onReasonChange(e.target.value)}
            placeholder="Enter reason for rejection..."
            rows={4}
          />
        </div>

        <DialogFooter>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onReject}
            disabled={isPending || !rejectionReason.trim()}
            className="cursor-pointer rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? (
              <ButtonLoader text="Rejecting..." />
            ) : (
              "Reject Request"
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RejectLeaveDialog;