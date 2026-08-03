import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UpdateEmployeeDTO } from "../../types/employee.types";

interface PayrollAndBankProps {
  form: UpdateEmployeeDTO;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

const PayrollAndBank = ({
  form,
  handleChange,
}: PayrollAndBankProps) => {
  return (
    <div className="w-full min-w-0">
      <div className="grid w-full min-w-0 grid-cols-1 gap-5 sm:grid-cols-2">

        {/* PAYE ID */}
        <div className="min-w-0 space-y-2">
          <Label htmlFor="paye_id">PAYE ID</Label>

          <Input
            id="paye_id"
            name="paye_id"
            value={form.paye_id ?? ""}
            onChange={handleChange}
            placeholder="Enter PAYE ID"
            className="w-full rounded-sm border-border text-sm text-secondary placeholder:text-gray-400"
          />
        </div>

        {/* Bank Name */}
        <div className="min-w-0 space-y-2">
          <Label htmlFor="bank_name">Bank Name</Label>

          <Input
            id="bank_name"
            name="bank_name"
            value={form.bank_name ?? ""}
            onChange={handleChange}
            placeholder="Enter bank name"
            className="w-full rounded-sm border-border text-sm text-secondary placeholder:text-gray-400"
          />
        </div>

        {/* Account Name */}
        <div className="min-w-0 space-y-2">
          <Label htmlFor="account_name">Account Name</Label>

          <Input
            id="account_name"
            name="account_name"
            value={form.account_name ?? ""}
            onChange={handleChange}
            placeholder="Enter account name"
            className="w-full rounded-sm border-border text-sm text-secondary placeholder:text-gray-400"
          />
        </div>

        {/* Account Number */}
        <div className="min-w-0 space-y-2">
          <Label htmlFor="account_number">Account Number</Label>

          <Input
            id="account_number"
            name="account_number"
            type="text"
            inputMode="numeric"
            value={form.account_number ?? ""}
            onChange={handleChange}
            placeholder="Enter account number"
            className="w-full rounded-sm border-border text-sm text-secondary placeholder:text-gray-400"
          />
        </div>

      </div>
    </div>
  );
};

export default PayrollAndBank;