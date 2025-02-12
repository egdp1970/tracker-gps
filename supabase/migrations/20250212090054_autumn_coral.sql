/*
  # Remove authentication requirements

  1. Changes
    - Drop existing RLS policies
    - Remove user_id column and references
    - Disable RLS on routes table
*/

-- Drop existing RLS policies
DROP POLICY IF EXISTS "Users can insert their own routes" ON routes;
DROP POLICY IF EXISTS "Users can read their own routes" ON routes;

-- Remove user_id column and references
ALTER TABLE routes DROP COLUMN IF EXISTS user_id;

-- Disable RLS
ALTER TABLE routes DISABLE ROW LEVEL SECURITY;