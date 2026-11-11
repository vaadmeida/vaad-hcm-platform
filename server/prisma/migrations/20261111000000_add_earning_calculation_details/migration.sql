-- Add calculation fields if they do not already exist.
ALTER TABLE "AdditionalEarning"
ADD COLUMN IF NOT EXISTS "calculationType"
    "EarningCalculationType" NOT NULL DEFAULT 'FIXED',
ADD COLUMN IF NOT EXISTS "percentage" DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS "calculationBase" DECIMAL(15,2);