import { db } from 'hatchable';
export const access = 'user';
export const methods = ['GET','PUT'];
export default async function(req,res){
 const uid=req.user.id;
 if(req.method==='GET'){
  const {rows}=await db.query('SELECT display_name, branch, study_year, institution, cgpa, bio, skills, interests, projects, achievements, discoverable, updated_at FROM student_profiles WHERE user_id=$1',[uid]);
  return res.json({profile:rows[0]||null});
 }
 const b=req.body||{};
 const clean=(v,max=120)=>typeof v==='string'?v.trim().slice(0,max):'';
 const list=(v,max=30)=>Array.isArray(v)?v.slice(0,max).map(x=>clean(x,80)).filter(Boolean):[];
 const profile={
  display_name:clean(b.display_name,80)||'Student',
  branch:clean(b.branch,100),study_year:clean(b.study_year,40),
  institution:clean(b.institution,120),cgpa:b.cgpa===null||b.cgpa===undefined||b.cgpa===''?null:(Number.isFinite(Number(b.cgpa))&&Number(b.cgpa)>=0&&Number(b.cgpa)<=10?Number(b.cgpa):null),bio:clean(b.bio,600),
  skills:list(b.skills),interests:list(b.interests),
  projects:Array.isArray(b.projects)?b.projects.slice(0,20):[],
  achievements:Array.isArray(b.achievements)?b.achievements.slice(0,20):[],
  discoverable:b.discoverable===true
 };
 await db.query(`INSERT INTO student_profiles(user_id,display_name,branch,study_year,institution,cgpa,bio,skills,interests,projects,achievements,discoverable,updated_at)
 VALUES($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9::jsonb,$10::jsonb,$11::jsonb,$12,now())
 ON CONFLICT(user_id) DO UPDATE SET display_name=EXCLUDED.display_name,branch=EXCLUDED.branch,study_year=EXCLUDED.study_year,institution=EXCLUDED.institution,cgpa=EXCLUDED.cgpa,bio=EXCLUDED.bio,skills=EXCLUDED.skills,interests=EXCLUDED.interests,projects=EXCLUDED.projects,achievements=EXCLUDED.achievements,discoverable=EXCLUDED.discoverable,updated_at=now()`,
 [uid,profile.display_name,profile.branch,profile.study_year,profile.institution,profile.cgpa,profile.bio,JSON.stringify(profile.skills),JSON.stringify(profile.interests),JSON.stringify(profile.projects),JSON.stringify(profile.achievements),profile.discoverable]);
 return res.json({ok:true,profile});
}