-- Schema for LMOQF application
-- This file contains all the table definitions needed for the Supabase database
-- Using a simplified schema with just one workers table

-- Table: workers
-- Stores all worker information in a single table
CREATE TABLE workers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  location TEXT NOT NULL,
  skill TEXT NOT NULL,
  hourly_rate NUMERIC(10, 2),
  rating NUMERIC(3, 2),
  rating_count INTEGER DEFAULT 0,
  available BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: worker_availability
-- Tracks the availability status of workers
CREATE TABLE worker_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone_number TEXT NOT NULL UNIQUE REFERENCES workers(phone),
  is_available BOOLEAN DEFAULT false,
  available_since TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: skills
-- List of available skills that workers can select
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert some initial skills
INSERT INTO skills (name, category) VALUES
  ('Plumbing', 'Home Services'),
  ('Electrical', 'Home Services'),
  ('Carpentry', 'Construction'),
  ('Painting', 'Home Services'),
  ('Gardening', 'Outdoor'),
  ('Cleaning', 'Home Services'),
  ('Cooking', 'Food Services'),
  ('Driving', 'Transportation'),
  ('Babysitting', 'Childcare'),
  ('Tutoring', 'Education');

-- Create trigger function to update worker availability
CREATE OR REPLACE FUNCTION update_worker_availability()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the available field in workers table
  UPDATE workers 
  SET available = NEW.is_available, updated_at = NOW()
  WHERE phone = NEW.phone_number;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for worker_availability changes
CREATE TRIGGER trigger_update_worker_availability
AFTER INSERT OR UPDATE ON worker_availability
FOR EACH ROW EXECUTE FUNCTION update_worker_availability();

-- Create RLS policies for security
-- Enable Row Level Security
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE worker_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- Create policies for workers
CREATE POLICY "Allow public read access to workers"
  ON workers FOR SELECT
  USING (true);

-- Create policies for worker_availability  
CREATE POLICY "Allow public read access to worker_availability"
  ON worker_availability FOR SELECT
  USING (true);

-- Create policies for skills
CREATE POLICY "Allow public read access to skills"
  ON skills FOR SELECT
  USING (true);

-- Note: In a production environment, you should set up more restrictive policies
-- based on authenticated users and their roles/permissions