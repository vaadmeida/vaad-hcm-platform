ALTER TABLE "employees"
  ADD COLUMN "next_of_kin_name" VARCHAR(150),
  ADD COLUMN "next_of_kin_relationship" VARCHAR(50),
  ADD COLUMN "next_of_kin_phone" VARCHAR(20),
  ADD COLUMN "next_of_kin_email" VARCHAR(255),
  ADD COLUMN "next_of_kin_address" TEXT;
