-- Create calculation base enum
CREATE TYPE "CalculationBaseType" AS ENUM (
    'BASIC_SALARY',
    'GROSS_SALARY',
    'HOUSING_ALLOWANCE',
    'TRANSPORT_ALLOWANCE',
    'MEDICAL_ALLOWANCE',
    'MEAL_ALLOWANCE',
    'WARDROBE_ALLOWANCE',
    'CUSTOM_AMOUNT'
);

-- Add calculation base type to AdditionalEarning
ALTER TABLE "AdditionalEarning"
ADD COLUMN "calculationBaseType" "CalculationBaseType";