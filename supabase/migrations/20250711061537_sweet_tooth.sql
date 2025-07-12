/*
  # Create utility functions and triggers

  1. Functions
    - `update_updated_at_column()` - Function to automatically update updated_at timestamp
    - `calculate_study_streak()` - Function to calculate current study streak

  2. Triggers
    - Triggers to automatically update updated_at column on all tables

  3. Additional Features
    - Function to get user statistics
    - Function to calculate monthly consistency
*/

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_study_days_updated_at
    BEFORE UPDATE ON study_days
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_study_goals_updated_at
    BEFORE UPDATE ON study_goals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate study streak for a user
CREATE OR REPLACE FUNCTION calculate_study_streak(user_uuid uuid)
RETURNS integer AS $$
DECLARE
    streak_count integer := 0;
    current_date_check date := CURRENT_DATE;
    has_study_day boolean;
BEGIN
    LOOP
        -- Check if there's a study day for the current date
        SELECT EXISTS(
            SELECT 1 FROM study_days 
            WHERE user_id = user_uuid 
            AND date = current_date_check 
            AND status IN ('productive', 'partial')
        ) INTO has_study_day;
        
        -- If no study day found, break the loop
        IF NOT has_study_day THEN
            EXIT;
        END IF;
        
        -- Increment streak and move to previous day
        streak_count := streak_count + 1;
        current_date_check := current_date_check - INTERVAL '1 day';
    END LOOP;
    
    RETURN streak_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user study statistics
CREATE OR REPLACE FUNCTION get_user_study_stats(user_uuid uuid)
RETURNS json AS $$
DECLARE
    total_days integer;
    productive_days integer;
    partial_days integer;
    total_hours decimal;
    current_streak integer;
    result json;
BEGIN
    -- Get basic counts
    SELECT 
        COUNT(*),
        COUNT(*) FILTER (WHERE status = 'productive'),
        COUNT(*) FILTER (WHERE status = 'partial'),
        COALESCE(SUM(study_hours), 0)
    INTO total_days, productive_days, partial_days, total_hours
    FROM study_days 
    WHERE user_id = user_uuid;
    
    -- Get current streak
    SELECT calculate_study_streak(user_uuid) INTO current_streak;
    
    -- Build result JSON
    result := json_build_object(
        'total_study_days', total_days,
        'productive_days', productive_days,
        'partial_days', partial_days,
        'total_hours', total_hours,
        'current_streak', current_streak,
        'average_hours_per_day', CASE WHEN total_days > 0 THEN total_hours / total_days ELSE 0 END,
        'productive_percentage', CASE WHEN total_days > 0 THEN (productive_days + partial_days * 0.5) / total_days * 100 ELSE 0 END
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;