import { db } from 'hatchable';
export const access='user';
export const methods=['GET','POST'];
const roles=['AI/ML Developer','Frontend Developer','Backend Developer','UI/UX Designer','Hardware/IoT Developer','Researcher','Data Analyst','Cloud/DevOps'];
export default async function(req,res){
 const uid=String(req.user.id);
 if(req.method==='POST'){
  const competition=String(req.body?.competition||'').trim().slice(0,160);
  const role=String(req.body?.role||'').trim();
  if(!competition||!roles.includes(role))return res.status(400).json({error:'Choose a hackathon and a valid role.'});
  const {rows:profiles}=await db.query('SELECT skills, projects, achievements, discoverable, skill_score FROM student_profiles WHERE user_id=$1',[uid]);
  const profile=profiles[0];
  if(!profile)return res.status(409).json({error:'Complete your student profile first.'});
  if(profile.discoverable!==true)return res.status(403).json({error:'Turn on teammate discovery in your profile before joining automatic matching.'});
  const score=Math.max(0,Math.min(1000,Number(profile.skill_score)||0));
  await db.query(`INSERT INTO hackathon_team_signups(user_id,competition_name,selected_role,skill_score,status,updated_at) VALUES($1,$2,$3,$4,'waiting',now()) ON CONFLICT(user_id,competition_name) DO UPDATE SET selected_role=EXCLUDED.selected_role,skill_score=EXCLUDED.skill_score,status='waiting',team_key=NULL,updated_at=now()`,[uid,competition,role,score]);
  const {rows:candidates}=await db.query(`SELECT s.id,s.user_id,s.selected_role,s.skill_score FROM hackathon_team_signups s JOIN student_profiles p ON p.user_id=s.user_id WHERE s.competition_name=$1 AND s.user_id<>$2 AND s.status='waiting' AND p.discoverable=true AND s.selected_role<>$3 ORDER BY ABS(s.skill_score-$4) ASC,s.created_at ASC LIMIT 1`,[competition,uid,role,score]);
  if(!candidates.length)return res.json({status:'waiting',message:'You are in the matching pool. STANCE will pair you when a student with a different role joins this hackathon.'});
  const candidate=candidates[0];
  const teamKey='team-'+crypto.randomUUID();
  await db.query("UPDATE hackathon_team_signups SET team_key=$1,status='matched',updated_at=now() WHERE id=$2 OR (user_id=$3 AND competition_name=$4)",[teamKey,candidate.id,uid,competition]);
  const {rows:team}=await db.query('SELECT selected_role,skill_score FROM hackathon_team_signups WHERE team_key=$1 ORDER BY id',[teamKey]);
  return res.json({status:'matched',team:team.map((m,i)=>({label:'Student '+(i+1),role:m.selected_role,skillScore:m.skill_score})),teamKey,scoreBasis:'SkillScore closeness and complementary role selection. Only opted-in profiles are included.'});
 }
 const {rows}=await db.query('SELECT competition_name,selected_role,status,skill_score FROM hackathon_team_signups WHERE user_id=$1 ORDER BY updated_at DESC LIMIT 20',[uid]);
 return res.json({signups:rows});
}