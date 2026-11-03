CREATE TABLE student_profiles (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL DEFAULT 'Student',
  institution TEXT DEFAULT '',
  branch TEXT DEFAULT '',
  study_year TEXT DEFAULT '',
  cgpa NUMERIC(3,2),
  skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  interests JSONB NOT NULL DEFAULT '[]'::jsonb,
  projects JSONB NOT NULL DEFAULT '[]'::jsonb,
  competitions JSONB NOT NULL DEFAULT '[]'::jsonb,
  profile_visible BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX student_profiles_visibility_idx ON student_profiles(profile_visible) WHERE profile_visible = true;

CREATE TABLE competition_participation (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  competition_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'interested',
  team_name TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX competition_participation_user_idx ON competition_participation(user_id);

CREATE TABLE project_applications (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  project_title TEXT NOT NULL,
  role_applied TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX project_applications_user_idx ON project_applications(user_id);

CREATE TABLE skillbits_transactions (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX skillbits_transactions_user_idx ON skillbits_transactions(user_id);