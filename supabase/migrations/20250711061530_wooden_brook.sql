/*
  # Create study_goals table

  1. New Tables
    - `study_goals`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `goal_type` (text, e.g., 'daily_hours', 'weekly_days', 'monthly_target')
      - `target_value` (decimal)
      - `current_value` (decimal)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `study_goals` table
    - Add policies for users to manage their own goals

  3. Indexes
    - Index on user_id for faster queries
    - Index on goal_type for filtering
*/

CREATE TABLE IF NOT EXISTS study_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  goal_type text NOT NULL,
  target_value decimal(10,2) NOT NULL,
  current_value decimal(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE study_goals ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own study goals"
  ON study_goals
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own study goals"
  ON study_goals
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own study goals"
  ON study_goals
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own study goals"
  ON study_goals
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS study_goals_user_id_idx ON study_goals(user_id);
CREATE INDEX IF NOT EXISTS study_goals_goal_type_idx ON study_goals(goal_type);