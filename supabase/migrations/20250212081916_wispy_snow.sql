/*
  # Create routes table for GPS tracking

  1. New Tables
    - `routes`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `points` (jsonb, array of GPS coordinates)
      - `created_at` (timestamptz)
      - `user_id` (uuid, references auth.users)
  
  2. Security
    - Enable RLS on `routes` table
    - Add policies for authenticated users to:
      - Insert their own routes
      - Read their own routes
*/

CREATE TABLE IF NOT EXISTS routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  points jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users NOT NULL DEFAULT auth.uid()
);

ALTER TABLE routes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own routes"
  ON routes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own routes"
  ON routes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);