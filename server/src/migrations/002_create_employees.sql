CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    job_title VARCHAR(150),
    job_description TEXT,
    department_id UUID REFERENCES departments(id),
    manager_id UUID REFERENCES employees(id),
    status VARCHAR(20) DEFAULT 'probation',
    employment_type VARCHAR(50) DEFAULT 'full-time',
    hire_date DATE NOT NULL,
    probation_end_date DATE,
    work_email VARCHAR(255),
    owns_personal_computer BOOLEAN DEFAULT false,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'employee',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);




CREATE TRIGGER employees_updated_at
BEFORE UPDATE ON employees
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();