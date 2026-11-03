import { ai, db } from 'hatchable';

export const access = 'user';
export const methods = ['POST'];

const allowed = new Set(['competitions','projects','team','skills','portfolio','services','marketplace']);
export default async function (req, res) {
  const body = req.body || {};
  const feature = String(body.feature || '');
  if (!allowed.has(feature)) return res.status(400).json({ error: 'Unknown STANCE AI feature.' });
  const { rows } = await db.query(
    'SELECT display_name, branch, study_year, cgpa, skills, interests, projects, competitions FROM student_profiles WHERE user_id=$1 LIMIT 1',
    [String(req.user.id)]
  );
  if (!rows.length) return res.status(409).json({ error: 'Complete and save your student profile first.' });
  const profile = rows[0];
  const context = {
    branch: profile.branch || 'Not provided',
    year: profile.study_year || 'Not provided',
    cgpa: profile.cgpa,
    skills: profile.skills || [],
    interests: profile.interests || [],
    projects: profile.projects || [],
    competitions: profile.competitions || []
  };
  const tasks = {
    competitions: 'Recommend competition categories and explain fit, eligibility gaps, and a preparation checklist. Do not invent current event deadlines or claim verified eligibility.',
    projects: 'Suggest three practical student projects that fit the profile. Include problem, roles, suggested stack, and first milestones.',
    team: 'Describe the complementary roles and skills missing from a balanced team. Do not invent or expose other students or claim a real person has been matched.',
    skills: 'Assess strengths and gaps from evidence in this profile. Create a realistic 4-week improvement plan. Do not assign a numeric score without assessment evidence.',
    portfolio: 'Draft concise portfolio project descriptions based only on supplied project details. Identify missing facts instead of inventing outcomes.',
    services: 'Suggest student services this person could offer based on demonstrated skills, with beginner-friendly scope and indicative pricing caveats.',
    marketplace: 'Give a listing checklist and condition-based pricing factors for a used student item. Ask for item details if missing.'
  };
  try {
    const result = await ai.generateText({
      model: 'gpt',
      purpose: 'stance_'+feature,
      userId: String(req.user.id),
      system: 'You are STANCE, a careful student career and project assistant. Personalize using only the supplied profile. Never fabricate companies, events, dates, achievements, grades, prices, selection odds, or other students. State uncertainty. Give clear, practical steps.',
      prompt: 'Student profile (user supplied): '+JSON.stringify(context)+'\n\nTask: '+tasks[feature]+'\n\nAdditional request: '+String(body.prompt || '').slice(0, 1200),
      maxTokens: 1200,
      signal: AbortSignal.timeout(45000)
    });
    if (result.finishReason === 'length') return res.status(502).json({ error: 'The response was too long. Please try a shorter request.' });
    return res.json({ answer: result.text, feature });
  } catch (error) {
    return res.status(503).json({ error: 'STANCE AI is not configured or is temporarily unavailable. Check the AI provider setup in project settings.' });
  }
}