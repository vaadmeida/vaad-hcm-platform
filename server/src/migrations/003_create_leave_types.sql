CREATE TABLE leave_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  default_days_per_year INT NOT NULL,
  requires_document BOOLEAN DEFAULT false,
  is_paid BOOLEAN DEFAULT true,
  carries_over BOOLEAN DEFAULT false,
  max_carryover_days INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);