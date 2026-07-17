-- Document category enum
CREATE TYPE document_category AS ENUM (
    'identity',
    'contract',
    'compliance',
    'certificate',
    'onboarding',
    'other'
);

-- Document types
CREATE TABLE document_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL UNIQUE,
    category document_category NOT NULL,
    description TEXT,
    is_required BOOLEAN NOT NULL DEFAULT FALSE,
    has_expiry BOOLEAN NOT NULL DEFAULT FALSE,
    allowed_extensions TEXT[] NOT NULL DEFAULT ARRAY['pdf', 'jpg', 'jpeg', 'png'],
    max_size_mb INTEGER NOT NULL DEFAULT 5 CHECK (max_size_mb > 0),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);