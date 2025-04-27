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
  available BOOLEAN DEFAULT false,
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