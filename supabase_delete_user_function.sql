-- Function to delete a user and all their data
-- This should be run in your Supabase SQL Editor

CREATE OR REPLACE FUNCTION delete_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id uuid;
BEGIN
  -- Get the current user's ID
  user_id := auth.uid();
  
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- Delete all user data (cascade handles related records)
  DELETE FROM auth.users WHERE id = user_id;
  
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION delete_user() TO authenticated;
