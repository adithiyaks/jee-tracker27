/*
  # Create study_days table

  1. New Tables
    - `study_days`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `date` (date, unique per user)
      - `status` (text, enum: 'productive', 'partial', 'unproductive')
      - `notes` (text)
      - `study_hours` (decimal)
      - `subjects_studied` (text array)
      - `mock_test_score` (integer, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `study_days` table
    - Add policies for users to manage their own study days
    - Add unique constraint on user_id and date

  3. Indexes
    - Index on user_id for faster queries
    - Index on date for date-based queries
    - Composite index on user_id and date
*/

CREATE TABLE IF NOT EXISTS study_days (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  status text CHECK (status IN ('productive', 'partial', 'unproductive')) NOT NULL,
  notes text DEFAULT '',
  study_hours decimal(4,2) DEFAULT 0,
  subjects_studied text[] DEFAULT '{}',
  mock_test_score integer CHECK (mock_test_score >= 0 AND mock_test_score <= 720),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Enable Row Level Security
ALTER TABLE study_days ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own study days"
  ON study_days
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own study days"
  ON study_days
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own study days"
  ON study_days
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own study days"
  ON study_days
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS study_days_user_id_idx ON study_days(user_id);
CREATE INDEX IF NOT EXISTS study_days_date_idx ON study_days(date);
CREATE INDEX IF NOT EXISTS study_days_user_date_idx ON study_days(user_id, date);
CREATE INDEX IF NOT EXISTS study_days_status_idx ON study_days(status);