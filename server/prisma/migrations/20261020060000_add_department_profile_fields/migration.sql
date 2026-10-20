ALTER TABLE "departments"
ADD COLUMN "reports_to" TEXT,
ADD COLUMN "role_purpose" TEXT,
ADD COLUMN "core_responsibilities" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "key_outputs" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "kpis" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "decision_authority" TEXT,
ADD COLUMN "backup_continuity" TEXT;