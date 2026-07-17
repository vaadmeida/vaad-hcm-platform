CREATE TABLE employee_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id),
  document_type_id UUID NOT NULL REFERENCES document_types(id),
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_size_mb NUMERIC(5,2),
  status VARCHAR(20) DEFAULT 'pending',
  expiry_date DATE,
  notes TEXT,
  uploaded_by UUID REFERENCES employees(id),
  verified_by UUID REFERENCES employees(id),
  verified_at TIMESTAMP,
  uploaded_at TIMESTAMP DEFAULT NOW()
);