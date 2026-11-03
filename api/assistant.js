import { db, ai } from 'hatchable';
export const access = 'user';
export const methods = ['POST'];
const allowed=new Set(['competition_match','project_ideas','team_match','skill_plan','portfolio_review','service_ideas','reward_plan']);
export default async function(req,res){
 const body=req.body||{};
 const task=String(body.task||'');
 if(!allowed.has(task)) return res.status(400).json({error:'Choose a supported STANCE assistant.'});
 const {rows}=await db.query('SELECT display_name,branch,study_year,institution,bio,skills,interests,projects,achievements,discoverable FROM student_profiles WHERE user_id=$1',[req.user.id]);
 const p=rows[0];
 if(!p) return res.status(409).json({error:'Complete and save your student profile first.'});
 const safeProfile={display_name:p.display_name,branch:p.branch,study_year:p.study_year,institution:p.institution,bio:p.bio,skills:p.skills,interests:p.interests,projects:p.projects,achievements:p.achievements};
 const tasks={
 competition_match:'Create a detailed, practical student competition eligibility and fit report using only the supplied student profile and user context. Clearly separate (A) profile facts, (B) platform demo baseline checks, (C) skill-fit recommendations, and (D) official organiser rules that are unknown and must be verified. Never treat illustrative listings or demo baseline criteria as real organiser rules. Do not invent percentages, live events, deadlines, age limits, branch/year/CGPA restrictions, prizes, or guaranteed eligibility. Identify missing profile information instead of assuming it. Rank up to three listed competitions by qualitative skill fit with reasons, explain gaps, and give a short actionable improvement plan. Use clear headings and concise bullets.',
 project_ideas:'Suggest three practical student project ideas based on the profile, each with problem, features, suggested stack and first milestones.',
 team_match:'Describe complementary teammate skill roles needed for a balanced team. Never reveal or invent real people; recommend roles only.',
 skill_plan:'Create a realistic 4-week skill development plan based on the profile, with weekly milestones and evidence to build.',
 portfolio_review:'Review the profile and suggest concrete improvements to project descriptions, portfolio structure and evidence.',
 service_ideas:'Suggest student services the user could responsibly offer based on demonstrated skills, with a beginner-friendly starting scope.',
 reward_plan:'Suggest a fair, achievable contribution plan for earning platform points. Do not promise rewards or invent point balances.'
 };
 const prompt='Student profile JSON (user-provided): '+JSON.stringify(safeProfile)+'\nUser context: '+String(body.context||'').slice(0,1500);
 try{
  const result=await ai.generateText({purpose:'stance_'+task,model:'gpt',userId:req.user.id,system:'You are STANCE, a careful student career and collaboration assistant. Personalize advice only from the supplied profile. Clearly label assumptions. Never invent people, current opportunities, official deadlines, guaranteed outcomes, scores, or account balances. Return readable concise markdown.',prompt:tasks[task]+'\n'+prompt,maxTokens:1400,signal:AbortSignal.timeout(45000)});
  if(result.finishReason==='length') return res.status(502).json({error:'The response was too long. Please try a narrower request.'});
  return res.json({answer:result.text||'No recommendation was returned.'});
 }catch(e){console.error('STANCE AI failed',e);return res.status(502).json({error:'AI is temporarily unavailable. Check AI setup and try again.'});}
}