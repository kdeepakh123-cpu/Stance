ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS skill_score INTEGER NOT NULL DEFAULT 0;
CREATE TABLE IF NOT EXISTS hackathon_team_signups (
 id BIGSERIAL PRIMARY KEY,
 user_id TEXT NOT NULL,
 competition_name TEXT NOT NULL,
 selected_role TEXT NOT NULL,
 skill_score INTEGER NOT NULL DEFAULT 0,
 team_key TEXT,
 status TEXT NOT NULL DEFAULT 'waiting',
 created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 UNIQUE(user_id, competition_name)
);
CREATE INDEX IF NOT EXISTS hackathon_team_signups_match_idx ON hackathon_team_signups(competition_name, status, selected_role, skill_score DESC);
CREATE INDEX IF NOT EXISTS hackathon_team_signups_team_idx ON hackathon_team_signups(team_key) WHERE team_key IS NOT NULL;