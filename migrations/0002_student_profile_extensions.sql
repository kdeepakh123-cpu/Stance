ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS bio TEXT NOT NULL DEFAULT '';
ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS achievements JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS discoverable BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS student_profiles_discoverable_idx ON student_profiles(discoverable) WHERE discoverable = true;