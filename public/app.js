const toast = document.getElementById('toast');
let toastTimer;
function notify(message){toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2800)}
const dialog=document.getElementById('actionDialog');
function showDialog(title,text){document.getElementById('dialogTitle').textContent=title;document.getElementById('dialogText').textContent=text;if(!dialog.open)dialog.showModal()}
document.getElementById('closeDialog').addEventListener('click',()=>dialog.close());
document.getElementById('dialogOk').addEventListener('click',()=>dialog.close());
document.getElementById('notificationsBtn').addEventListener('click',()=>showDialog('You’re all caught up!','Your recent activity and updates are shown in the Recent Activity panel.'));
document.getElementById('profileBtn').addEventListener('click',()=>showDialog('Student Profile','View and update the profile details saved to your STANCE account.'));
document.querySelector('.mobile-menu').addEventListener('click',()=>document.querySelector('.sidebar').classList.toggle('open'));
document.querySelectorAll('[data-page]').forEach(button=>button.addEventListener('click',()=>{
 const page=button.dataset.page;
 document.querySelectorAll('.nav-item').forEach(item=>item.classList.toggle('active',item.dataset.page===page));
 document.querySelector('.sidebar').classList.remove('open');
 const dashboard=document.querySelector('.dashboard');
 const views=document.getElementById('pageViews');
 if(page==='Home'){dashboard.hidden=false;if(views)views.hidden=true;window.scrollTo({top:0,behavior:'smooth'});return}
 dashboard.hidden=true;
 if(views){views.hidden=false;views.querySelectorAll('.tab-page').forEach(panel=>panel.hidden=panel.dataset.tab!==page);window.scrollTo({top:0,behavior:'smooth'});notify(page+' opened.');}
 else notify('Loading '+page+'…');
}));
function searchCards(value){
 const query=value.trim().toLowerCase();
 let shown=0;
 document.querySelectorAll('.searchable').forEach(group=>{
   group.querySelectorAll('.competition-card,.recommended-card,.product-card').forEach(card=>{
     const match=!query||card.textContent.toLowerCase().includes(query);
     card.hidden=!match;if(match)shown++;
   });
 });
 if(query){notify(shown?('Found '+shown+' matching item'+(shown===1?'':'s')+'.'):'No exact matches found — try “AI”, “team”, “website” or “laptop”.')}
}
document.getElementById('heroSearchBtn').addEventListener('click',()=>{const q=document.getElementById('heroSearch').value;document.getElementById('globalSearch').value=q;searchCards(q)});
document.getElementById('heroSearch').addEventListener('keydown',e=>{if(e.key==='Enter'){document.getElementById('globalSearch').value=e.target.value;searchCards(e.target.value)}});
document.getElementById('globalSearch').addEventListener('input',e=>searchCards(e.target.value));
document.querySelectorAll('[data-action]').forEach(button=>button.addEventListener('click',()=>{
 const action=button.dataset.action;
 const messages={
  rewards:['SkillBits Rewards','Earn points by joining competitions, finishing projects, helping other students and receiving great service ratings.'],
  details:['EcoTech — Smart Agriculture Solution','This team needs a student interested in agriculture technology. Your profile matches 4 of 5 required skills, giving you a 96% compatibility score.'],
  join:['Team request sent!','Your interest in joining EcoTech has been recorded in this demo. In a connected STANCE account, the team lead would receive your request.'],
  book:['Service selected','This service has been selected. A complete STANCE marketplace can connect you with the student provider.'],
  buy:['Product selected','This listing has been selected. Review the seller and product details before completing a purchase.'],
  profile:['Student Profile','View and update the profile details saved to your STANCE account.'],
  redeem:['Redeem SkillBits','You have 2,450 SkillBits. Choose eligible rewards in the full STANCE rewards store.']
 };
 const item=messages[action];if(item)showDialog(item[0],item[1]);
}));
document.querySelectorAll('.quick-card').forEach(card=>card.addEventListener('click',()=>{}));
document.querySelectorAll('.nav-item').forEach(item=>item.addEventListener('click',()=>{}));
fetch('/tabs.html').then(response=>response.text()).then(markup=>{
 document.querySelector('.dashboard').insertAdjacentHTML('afterend',markup);
}).catch(()=>notify('Could not load tab pages. Please refresh.'));
document.addEventListener('click',event=>{
 const button=event.target.closest('[data-action]');if(!button)return;
 const action=button.dataset.action;
 const ai={
  // competitionAI uses the free local assessment below, not the paid AI endpoint.
  sih:['Smart India Hackathon 2026','Review the problem statement, confirm your team, select the problem statement and track your submission checklist.'],
  createProject:['Create a Project','Project creation form: add a title, problem statement, required skills, team size and expected timeline.'],
  projectJoin:['Project role application','Your interest has been noted in this prototype. A live version can send the project owner your profile and selected role.'],
  projectIdeas:['AI Project Idea Studio','Suggested ideas: Smart campus energy monitor, IoT plant health tracker, and accessible study planner. Each can be expanded into milestones and a technology roadmap.'],
  listService:['List a Service','Add a service title, description, sample work, delivery time and price to publish your student service.'],
  serviceAI:['AI Skill-to-Service Finder','Based on your Python, web development and UI/UX skills, try website development, Python tutoring, dashboard creation and portfolio design.'],
  sellItem:['Create Marketplace Listing','Add item photos, category, condition, price and pickup location. Meet buyers in a safe public campus location.'],
  marketSearch:['Marketplace Search','Search is ready in this prototype. Try books, laptops, notes or electronics.'],
  priceAI:['AI Price Estimator','For a useful estimate, enter the item model, age, condition and original price. AI can then suggest a reasonable listing range.'],
  teamScan:['AI Team Matcher','Your profile is strongest in Python and web development. A balanced team could add machine learning, electronics and product design skills. Match scores are illustrative in this demo.'],
  invite:['Invitation sent','Your teammate invitation is recorded in this demo.'],
  editPortfolio:['Edit Portfolio','Update your introduction, skills, project highlights, certificates and links.'],
  addProject:['Add a Project','Add the project title, your role, technologies used, project link and outcomes.'],
  addCertificate:['Add Certificate','Add the certificate name, issuing organization, completion date and credential link.'],
  portfolioAI:['AI Portfolio Builder','Suggested project summary: Built a student-focused solution using Python and IoT concepts. Add measurable results, your individual contribution and a demo link to make it stronger.'],
  skillAI:['Your Skill Improvement Plan','1. Deploy a Python or web project to the cloud. 2. Practise data structures weekly. 3. Document your work with screenshots and a README. 4. Request peer review.'],
  skillEvidence:['How Skill Score works','A responsible Skill Score should use verified projects, assessments, competition work and peer feedback—not just self-entered skills or participation.'],
  redeem:['SkillBits Rewards','You have 2,450 demo SkillBits. Browse eligible rewards and check the points required before redeeming.'],
  rewardAI:['Your Reward Plan','Choose a reward target first. Then combine verified project completion, competition participation and helpful community contributions to work towards it.'],
  chatSummary:['EcoTech Team · Chat Summary','The team has shared an API integration update. Review the latest branch and test the dashboard connection before the next review.'],
  newMessage:['New Message','Choose a student or team to start a conversation.'],
  sendMessage:['Message sent','Your message was added in this prototype.'],
  markRead:['Notifications updated','All visible notifications have been marked as read in this demo.'],
  notificationAI:['Your Priority List','1. Check the Smart India Hackathon deadline. 2. Respond to the Team Horizon invitation. 3. Review the Smart Agriculture project feedback.']
 };
 if(ai[action])showDialog(ai[action][0],ai[action][1]);
});

const stanceTasks={sih:'competition_match',projectIdeas:'project_ideas',teamScan:'team_match',skillAI:'skill_plan',portfolioAI:'portfolio_review',serviceAI:'service_ideas',rewardAI:'reward_plan',notificationAI:'skill_plan'};
let stanceProfile=null;
async function stanceLoadProfile(){
 try{
  const session=await window.hatchable.auth.getSession();
  if(!session||!session.user){location.replace('/login?next='+encodeURIComponent('/'));return;}
  const response=await fetch('/api/profile');
  if(!response.ok)throw new Error('Could not load your profile.');
  const data=await response.json();stanceProfile=data.profile;
  if(!stanceProfile){
   const saved=await fetch('/api/profile',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({display_name:'Student',branch:'Computer Science Engineering',study_year:'1st Year',institution:'efjkn',cgpa:7,skills:['Python'],interests:['Hackathons','Projects'],projects:[],achievements:[],discoverable:true})});
   const savedData=await saved.json();if(!saved.ok)throw new Error(savedData.error||'Could not restore your saved profile.');stanceProfile=savedData.profile;
  }
  const name=stanceProfile?.display_name||'Student';
  document.querySelectorAll('.profile-menu').forEach(el=>el.firstChild?.nodeType===3?el.firstChild.textContent=name+' ':null);
  const heading=document.querySelector('.profile-card h3');if(heading)heading.textContent=name;
  const banner=document.querySelector('.portfolio-banner h1');if(banner)banner.textContent=name;
  if(!stanceProfile)notify('Welcome! Create your student profile to unlock personalized STANCE features.');
 }catch(e){if(e.status===401)location.replace('/login');else notify(e.message||'Profile could not be loaded.');}
}
function stanceOpenProfile(){
 const d=document.getElementById('profileEditor'),f=document.getElementById('profileForm'),p=stanceProfile||{};
 for(const k of ['display_name','branch','study_year','institution','bio'])f.elements[k].value=p[k]||'';
 f.elements.skills.value=(p.skills||[]).join(', ');f.elements.interests.value=(p.interests||[]).join(', ');f.elements.discoverable.checked=!!p.discoverable;d.showModal();
}
document.addEventListener('click',e=>{
 const action=e.target.closest('[data-action]')?.dataset.action;
 if(action==='profile'||action==='editPortfolio'){e.preventDefault();stanceOpenProfile();}
 if(action==='competitionAI'){
  e.preventDefault();
  const p=stanceProfile||{};
  const skills=(p.skills||[]).map(x=>String(x).trim()).filter(Boolean);
  const interests=(p.interests||[]).map(x=>String(x).trim()).filter(Boolean);
  const year=String(p.study_year||'Not added');
  const cgpa=Number(p.cgpa);
  const missing=[];
  if(!p.branch)missing.push('Branch');if(!p.study_year)missing.push('Study year');if(!p.institution)missing.push('College');if(!Number.isFinite(cgpa)||!p.cgpa)missing.push('CGPA');if(!skills.length)missing.push('Skills');if(!(p.projects||[]).length)missing.push('Projects');
  const catalog=[['Smart India Hackathon 2026',['software','hardware','python','problem solving','iot','electronics']],['National Innovation Challenge',['innovation','technology','research','problem solving']],['Build for Bharat',['software','web development','python','javascript','app development']],['AI for Social Good Challenge',['ai','machine learning','python','data science']],['Smart Campus Buildathon',['iot','electronics','hardware','python','web development']],['Open Source Sprint',['python','javascript','web development','git','software']],['AI for Sustainable Future',['ai','machine learning','python','sustainability']],['Student Product Design Challenge',['design','ui/ux','prototyping','product design']],['Campus Coding League',['python','java','c','programming','data structures']]];
  const normal=skills.map(x=>x.toLowerCase());
  const ranked=catalog.map(([name,tags])=>{const hits=tags.filter(t=>normal.some(s=>s.includes(t)||t.includes(s)));return {name,hits};}).sort((x,y)=>y.hits.length-x.hits.length).slice(0,3);
  const fit=ranked.map((x,i)=>(i+1)+'. '+x.name+' — '+(x.hits.length?'Related skills: '+x.hits.join(', '):'Add relevant skills or project evidence to improve your fit.')).join('\n');
  const baseline=(/[1-4]/.test(year)&&Number.isFinite(cgpa)&&cgpa>=6)?'Meets STANCE demo baseline (year 1–4 and CGPA 6.0+). This is NOT an organiser eligibility decision.':'Does not yet meet or cannot confirm STANCE demo baseline (year 1–4 and CGPA 6.0+). This is NOT an organiser rule.';
  const steps=[];if(!skills.length)steps.push('Add skills you can demonstrate.');else steps.push('Build a small project that proves your strongest skill: '+skills[0]+'.');if(!(p.projects||[]).length)steps.push('Add a project with your role, tools and a demo or GitHub link.');if(missing.length)steps.push('Complete your profile: '+missing.join(', ')+'.');steps.push('Verify each competition’s current deadline and official branch, year, CGPA and team rules before applying.');
  const report='YOUR PROFILE\n'+(p.display_name||'Student')+' · '+(p.branch||'Branch not added')+' · '+year+'\nCGPA: '+(p.cgpa||'Not added')+'\nSkills: '+(skills.join(', ')||'Not added')+'\nInterests: '+(interests.join(', ')||'Not added')+'\n\nPROFILE GAPS\n'+(missing.join(', ')||'No basic profile fields are missing')+'\n\nSTANCE DEMO BASELINE\n'+baseline+'\n\nTOP SKILL-FIT SUGGESTIONS\n'+fit+'\n\nYOUR NEXT STEPS\n'+steps.map((x,i)=>(i+1)+'. '+x).join('\n')+'\n\nThese are rule-based suggestions from your saved profile, not AI predictions or confirmed organiser eligibility. Competition details and deadlines must be checked with the organiser.';
  showDialog('Your STANCE Competition Assessment',report);return;
 }
 if(action&&stanceTasks[action]){
  e.preventDefault();
  const btn=e.target.closest('[data-action]');btn.disabled=true;
  let context='';
  if(action==='competitionAI')context='Detailed eligibility and fit review for these illustrative listings: Smart India Hackathon 2026 (software/hardware); National Innovation Challenge (innovation/technology); Build for Bharat (software); AI for Social Good Challenge (AI/social impact); Smart Campus Buildathon (IoT); Open Source Sprint (software contribution); AI for Sustainable Future (AI/sustainability); Student Product Design Challenge (product design); Campus Coding League (programming). Use the saved profile as the source of student details. Apply year 1st–4th and CGPA >= 6.0 only as a STANCE demo baseline, never as organiser rules. For each listing discuss qualitative skill fit, not guaranteed eligibility. Return: profile snapshot, strengths, missing profile details, separate demo baseline check, best 3 skill-fit competitions with reasons and gaps, 3-step improvement plan, and organiser-rule verification checklist. Official deadlines, age, branch, year, CGPA, team-size and other restrictions are unknown unless supplied; do not invent percentages or facts.';
  else if(action==='projectIdeas')context=document.querySelector('[data-tab="Projects"] textarea')?.value||'';
  else if(action==='priceAI')context='Give general guidance on evaluating second-hand item prices; ask for item details.';
  fetch('/api/assistant',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({task:stanceTasks[action],context})})
   .then(async r=>{const d=await r.json();if(!r.ok)throw new Error(d.error||'AI request failed');showDialog('STANCE AI',d.answer);})
   .catch(err=>showDialog('STANCE AI',err.message))
   .finally(()=>btn.disabled=false);
 }
});
document.getElementById('profileClose')?.addEventListener('click',()=>document.getElementById('profileEditor').close());
document.getElementById('profileForm')?.addEventListener('submit',async e=>{
 e.preventDefault();const f=e.currentTarget,msg=document.getElementById('profileMsg'),fd=new FormData(f);
 const list=k=>String(fd.get(k)||'').split(',').map(x=>x.trim()).filter(Boolean);
 const payload={display_name:fd.get('display_name'),branch:fd.get('branch'),study_year:fd.get('study_year'),institution:fd.get('institution'),bio:fd.get('bio'),skills:list('skills'),interests:list('interests'),discoverable:f.elements.discoverable.checked};
 try{const r=await fetch('/api/profile',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});const d=await r.json();if(!r.ok)throw new Error(d.error||'Could not save profile.');stanceProfile=d.profile;msg.textContent='Profile saved successfully.';const h=document.querySelector('.profile-card h3');if(h)h.textContent=stanceProfile.display_name;const b=document.querySelector('.portfolio-banner h1');if(b)b.textContent=stanceProfile.display_name;notify('Your profile has been saved.');}
 catch(err){msg.textContent=err.message;}
});
const stanceProfileReady=stanceLoadProfile();

// Animated, anonymous team reveal for hackathon matching.
if(!document.getElementById('stanceTeamRevealStyles')){
 const style=document.createElement('style');style.id='stanceTeamRevealStyles';
 style.textContent='.stance-team-reveal{margin-top:14px;padding:18px;border:1px solid #e7e1ff;border-radius:16px;background:linear-gradient(145deg,#fbfaff,#f2efff);color:#242044;overflow:hidden;animation:stanceRevealIn .45s ease both}.stance-reveal-kicker{font-size:10px;font-weight:900;letter-spacing:1.7px;color:#7257db}.stance-team-reveal h3{font-size:21px;margin:8px 0 5px;color:#241c48}.stance-team-reveal p{font-size:12px;line-height:1.55;color:#696482;margin:0 0 14px}.stance-reveal-list{display:grid;gap:9px}.stance-reveal-member{display:flex;align-items:center;gap:11px;padding:11px;border:1px solid #e8e3f8;background:#fff;border-radius:12px;opacity:0;animation:stanceMemberIn .5s ease forwards;animation-delay:var(--reveal-delay)}.stance-reveal-avatar{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(145deg,#a58bff,#5944c9);color:white;font-weight:900}.stance-reveal-copy{display:grid;gap:3px;flex:1}.stance-reveal-copy strong{font-size:12px;color:#292247}.stance-reveal-copy span{font-size:11px;color:#62558f}.stance-reveal-copy small{font-size:10px;color:#88819f}.stance-reveal-check{width:24px;height:24px;display:grid;place-items:center;border-radius:50%;background:#e8f8ef;color:#23975d}.stance-reveal-note{display:grid;gap:4px;margin-top:12px;padding:11px;border-radius:10px;background:#ebe6ff;color:#4e417d;font-size:11px}.stance-reveal-note span,.stance-reveal-foot{font-size:10px;line-height:1.5;color:#71698d}.stance-reveal-foot{display:block;margin-top:10px}.stance-waiting{text-align:center}.stance-reveal-orbit{margin:0 auto 8px;width:48px;height:48px;border-radius:50%;display:grid;place-items:center;background:#e8e1ff;color:#7052df;font-size:30px;animation:stancePulse 1.5s ease-in-out infinite}.stance-waiting-status{display:inline-flex;align-items:center;gap:8px;padding:8px 12px;border-radius:20px;background:#fff;color:#695b99;font-size:10px}.stance-waiting-status span{width:7px;height:7px;border-radius:50%;background:#8b70ee;box-shadow:0 0 0 4px #eee9ff;animation:stancePulse 1.2s infinite}@keyframes stanceRevealIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}@keyframes stanceMemberIn{from{opacity:0;transform:translateX(18px)}to{opacity:1;transform:translateX(0)}}@keyframes stancePulse{50%{transform:scale(1.12);opacity:.7}}@media(prefers-reduced-motion:reduce){.stance-team-reveal,.stance-reveal-member,.stance-reveal-orbit,.stance-waiting-status span{animation:none;opacity:1}}.profile-editor:has(.stance-role-form){width:min(520px,calc(100% - 28px));max-width:520px;max-height:calc(100dvh - 28px);padding:0;border:1px solid #e9e3ff;border-radius:24px;background:#fff;box-shadow:0 28px 90px #17113b38;overflow-x:hidden;overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin}.profile-editor:has(.stance-role-form)::backdrop{background:#10102e88;backdrop-filter:blur(7px)}.stance-role-form{padding:28px;color:#211c42}.stance-role-head{display:flex;justify-content:space-between;gap:15px;align-items:flex-start;margin-bottom:22px}.stance-role-eyebrow{font-size:9px;font-weight:900;letter-spacing:2px;color:#8064df}.stance-role-head h2{font-size:25px;line-height:1.15;margin:8px 0 7px;color:#211c42}.stance-role-head p{font-size:12px;line-height:1.6;color:#77728e;margin:0;max-width:360px}.stance-close{border:0;width:34px;height:34px;border-radius:50%;background:#f2efff;color:#62528f;font-size:14px;flex-shrink:0}.stance-event-chip{display:flex;align-items:center;gap:12px;padding:13px 14px;border:1px solid #eae5fa;border-radius:14px;background:linear-gradient(110deg,#faf8ff,#f3f0ff);margin-bottom:19px}.stance-event-chip>span{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;background:#e8e0ff;color:#7355d7;font-size:20px}.stance-event-chip div{display:grid;gap:3px;flex:1}.stance-event-chip small{font-size:8px;letter-spacing:1px;color:#9088a8;font-weight:800}.stance-event-chip strong{font-size:12px;color:#2b254c}.stance-event-chip>b{font-size:8px;color:#26956a;background:#e5f8ef;padding:6px 8px;border-radius:20px}.stance-field{display:grid;gap:8px;font-size:11px;font-weight:800;color:#373052}.stance-field select{width:100%;height:46px;border:1px solid #ded8f2;border-radius:11px;background:#fff;padding:0 13px;color:#282247;font:inherit;font-size:12px;outline:none}.stance-field select:focus{border-color:#8064df;box-shadow:0 0 0 3px #8064df20}.stance-role-hint{display:flex;gap:8px;align-items:center;margin:10px 0 16px;color:#765bd1;font-size:11px}.stance-role-hint span{color:#817b98}.stance-join-btn{width:100%;height:46px;display:flex;align-items:center;justify-content:space-between;padding:0 16px;font-size:12px}.stance-join-btn b{font-size:18px}.stance-preview-btn{width:100%;margin-top:9px;height:42px;border:1px solid #e4def8;border-radius:11px;background:#fff;color:#6551b2;font-size:11px;font-weight:800}.stance-preview-btn:hover{background:#f8f6ff}.stance-privacy-note{text-align:center;font-size:9px;color:#9992ad;margin-top:16px}.stance-preview-stage{margin-top:16px;padding:15px;border:1px solid #e6e0fb;border-radius:16px;background:linear-gradient(145deg,#fbfaff,#f3f0ff);animation:stanceRevealIn .35s ease both}.stance-scan-head{display:flex;align-items:center;gap:9px}.stance-scan-head>div{display:grid;gap:3px;flex:1}.stance-scan-head b{font-size:12px;color:#29234a}.stance-scan-head small{font-size:9px;color:#88819f}.stance-scan-head>strong{font-size:10px;color:#7058c9}.stance-scan-pulse{width:10px;height:10px;border-radius:50%;background:#8569e7;box-shadow:0 0 0 5px #e9e2ff;animation:stancePulse 1s infinite}.stance-scan-track{height:5px;background:#e7e1f6;border-radius:9px;overflow:hidden;margin:13px 0}.stance-scan-track i{display:block;height:100%;width:0;background:linear-gradient(90deg,#9a7bf0,#5b43c7);border-radius:9px;transition:width .5s ease}.stance-scan-cards{display:grid;gap:7px}.stance-scan-person{display:flex;align-items:center;gap:9px;padding:9px;background:#fff;border:1px solid #eae6f5;border-radius:11px;opacity:0;animation:stanceMemberIn .4s ease forwards}.stance-scan-avatar{width:35px;height:35px;border-radius:11px;display:grid;place-items:center;background:#eee9ff;color:#6750c8;font-size:9px;font-weight:900}.stance-scan-person>div{display:grid;gap:2px;flex:1}.stance-scan-person b{font-size:10px;color:#30294f}.stance-scan-person small{font-size:9px;color:#685b98}.stance-scan-person em{font-size:8px;color:#9a94ad;font-style:normal}.stance-scan-person>strong{font-size:11px;color:#26956a}.stance-preview-complete{display:grid;gap:4px;padding:11px;margin-top:4px;border-radius:11px;background:#e9f8f0;color:#237c55;animation:stanceRevealIn .45s ease both}.stance-preview-complete b{font-size:11px}.stance-preview-complete span,.stance-preview-foot{font-size:9px;line-height:1.5}.stance-preview-foot{color:#89829e;margin-top:10px}.stance-privacy-note{line-height:1.5}.stance-cinematic{position:relative}.stance-radar{height:154px;width:154px;margin:18px auto 8px;position:relative;border-radius:50%;display:grid;place-items:center;background:radial-gradient(circle,#eee9ff 0 3%,#f8f6ff 4% 100%);border:1px solid #dcd3ff;overflow:hidden;transition:transform .6s ease,box-shadow .6s ease}.stance-radar-ring{position:absolute;width:48px;height:48px;border:1px solid #b7a6f1;border-radius:50%;animation:stanceRadarPulse 2s ease-out infinite}.stance-radar-ring.ring-two{animation-delay:1s}.stance-radar-sweep{position:absolute;inset:0;border-radius:50%;background:conic-gradient(from 0deg,transparent 0 72%,#9b80ed66 91%,transparent 100%);animation:stanceRadarSpin 2s linear infinite}.radar-core{z-index:2;width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:#7559d5;color:white;box-shadow:0 0 0 7px #e8e1ff,0 0 25px #9278ed88}.radar-dot{position:absolute;z-index:3;width:25px;height:25px;border-radius:50%;display:grid;place-items:center;background:#fff;border:1px solid #d8cff6;color:#6650b8;font-size:7px;font-weight:900;opacity:.2;transform:scale(.5);transition:all .5s ease}.dot-one{top:17px;left:62px}.dot-two{right:13px;top:62px}.dot-three{bottom:16px;left:62px}.dot-four{left:13px;top:62px}.radar-active .radar-dot{opacity:1;transform:scale(1);animation:stanceDotFloat 2.4s ease-in-out infinite}.radar-active .dot-two{animation-delay:.3s}.radar-active .dot-three{animation-delay:.6s}.radar-active .dot-four{animation-delay:.9s}.radar-found{box-shadow:0 0 0 7px #eee9ff,0 0 35px #8d70e966;transform:scale(1.04)}.radar-found .stance-radar-sweep{animation-duration:.7s}.stance-scan-caption{text-align:center;color:#7666ae;font-size:9px;min-height:15px;margin:4px 0 12px;animation:stanceCaption 1s ease infinite alternate}.stance-flip-in{transform-origin:center;animation:stanceCardFlip .7s cubic-bezier(.2,.8,.2,1) both;animation-delay:var(--card-delay)}.stance-match-score{animation:stanceScorePop .45s .35s both}.stance-constellation{height:105px;position:relative;display:grid;place-items:center;overflow:hidden}.stance-team-orbit{z-index:2;width:112px;height:78px;border-radius:50%;background:radial-gradient(circle,#fff,#eee8ff);border:1px solid #cfc2fa;box-shadow:0 0 0 8px #eee9ff80,0 0 28px #9b83e866;display:grid;align-content:center;justify-items:center;gap:2px;animation:stanceTeamBloom .8s cubic-bezier(.15,.8,.2,1) both}.stance-team-orbit span{font-size:16px;color:#7455d4}.stance-team-orbit b{font-size:9px;color:#34285f;letter-spacing:1px}.stance-team-orbit small{font-size:8px;color:#847a9e}.stance-constellation-line{position:absolute;width:85%;height:1px;background:linear-gradient(90deg,transparent,#a28ce8,transparent);transform:rotate(-7deg);animation:stanceLineDraw .8s ease both}.stance-grand-finale{animation:stanceFinale .65s cubic-bezier(.2,.9,.2,1) both}.stance-grand-finale button{justify-self:center;margin-top:7px;border:0;border-radius:18px;background:#fff;padding:7px 12px;color:#6850bd;font-size:9px;font-weight:800}.stance-confetti{position:absolute;z-index:4;top:38%;left:var(--confetti-x);width:5px;height:9px;border-radius:2px;background:#8c70e8;opacity:0;animation:stanceConfettiFall 1.8s ease-out var(--confetti-delay) both;transform:rotate(var(--confetti-rotate))}.stance-confetti:nth-of-type(3n){background:#d6a64f}.stance-confetti:nth-of-type(3n + 1){background:#70bfa1}.stance-preview-foot{position:relative;z-index:5}.stance-scan-confetti{position:absolute;z-index:6;left:50%;top:34%;width:6px;height:10px;border-radius:2px;background:#8b6be5;pointer-events:none;animation:stanceBurst 1.15s cubic-bezier(.12,.72,.25,1) var(--burst-delay) both;transform:rotate(var(--burst-angle))}.stance-scan-confetti:nth-child(3n){background:#e7b957}.stance-scan-confetti:nth-child(3n + 1){background:#69b99a}@keyframes stanceBurst{0%{opacity:0;translate:-50% -50%;scale:.3}12%{opacity:1}100%{opacity:0;translate:calc(-50% + var(--burst-x)) calc(-50% + var(--burst-y));scale:.65}}@keyframes stanceRadarSpin{to{transform:rotate(360deg)}}@keyframes stanceRadarPulse{0%{transform:scale(.5);opacity:.8}100%{transform:scale(2.7);opacity:0}}@keyframes stanceDotFloat{50%{margin-top:-5px;box-shadow:0 5px 15px #9278ed55}}@keyframes stanceCardFlip{0%{opacity:0;transform:perspective(500px) rotateX(-75deg) translateY(14px) scale(.92)}70%{opacity:1;transform:perspective(500px) rotateX(8deg) translateY(-2px)}100%{opacity:1;transform:perspective(500px) rotateX(0) translateY(0) scale(1)}}@keyframes stanceScorePop{0%{transform:scale(0);opacity:0}70%{transform:scale(1.25)}100%{transform:scale(1);opacity:1}}@keyframes stanceTeamBloom{0%{opacity:0;transform:scale(.2) rotate(-20deg)}75%{transform:scale(1.12) rotate(4deg)}100%{opacity:1;transform:scale(1) rotate(0)}}@keyframes stanceLineDraw{from{opacity:0;transform:scaleX(0) rotate(-7deg)}to{opacity:1;transform:scaleX(1) rotate(-7deg)}}@keyframes stanceConfettiFall{0%{opacity:1;translate:0 -20px;rotate:0deg}100%{opacity:0;translate:var(--confetti-x) 120px;rotate:240deg}}@keyframes stanceCaption{to{opacity:.55}}@keyframes stanceFinale{from{opacity:0;transform:translateY(14px) scale(.94)}to{opacity:1;transform:translateY(0) scale(1)}}@media(prefers-reduced-motion:reduce){.stance-radar-ring,.stance-radar-sweep,.radar-dot,.stance-scan-caption,.stance-flip-in,.stance-match-score,.stance-team-orbit,.stance-constellation-line,.stance-confetti,.stance-grand-finale{animation:none;opacity:1}}@media(max-width:520px){.stance-role-form{padding:21px}.stance-role-head h2{font-size:22px}}';
 document.head.appendChild(style);
}
// Hackathon role-based team matching. Names are deliberately never exposed.
document.addEventListener('click',async e=>{
 const trigger=e.target.closest('[data-action="hackathonJoin"]');
 if(!trigger)return;
 e.preventDefault();
 await stanceProfileReady;
 if(!stanceProfile){showDialog('Complete your profile','Save your student profile before joining the matching pool.');return;}
 const yearText=String(stanceProfile.study_year||'').toLowerCase();
 const yearMatch=yearText.match(/(1|2|3|4)/);
 const year=yearMatch?Number(yearMatch[1]):null;
 const cgpa=Number(stanceProfile.cgpa);
 const issues=[];
 if(!year||year<1||year>4)issues.push('Add your current study year (1st–4th year) to your profile.');
 if(!Number.isFinite(cgpa)||cgpa<6)issues.push('This demo competition baseline requires a CGPA of at least 6.0.');
 if(issues.length){showDialog('Eligibility check',issues.join(' '));return;}
 if(!stanceProfile.discoverable){showDialog('Enable teammate discovery','You meet the basic demo criteria. To find teammates, open your profile, turn on "Allow my profile to appear in teammate discovery", and save.');return;}
 let dlg=document.getElementById('hackathonRoleDialog');
 if(!dlg){
  dlg=document.createElement('dialog');dlg.id='hackathonRoleDialog';dlg.className='profile-editor';
  dlg.innerHTML='<form id="hackathonRoleForm" class="stance-role-form"><div class="stance-role-head"><div><span class="stance-role-eyebrow">STANCE TEAM MATCHER</span><h2>Build your hackathon team</h2><p>Choose your role. We’ll find students with skills that complete your team.</p></div><button type="button" id="hackathonRoleClose" class="stance-close">✕</button></div><div class="stance-event-chip"><span>◈</span><div><small>PARTICIPATING IN</small><strong class="stance-event-name">Hackathon</strong></div><b>ACTIVE</b></div><label class="stance-field">Your preferred role<select name="role" required><option value="">Select your role</option><option>AI/ML Developer</option><option>Frontend Developer</option><option>Backend Developer</option><option>UI/UX Designer</option><option>Hardware/IoT Developer</option><option>Researcher</option><option>Data Analyst</option><option>Cloud/DevOps</option></select></label><div class="stance-role-hint">✦ <span>Pick the role you want to contribute to your team.</span></div><button class="btn btn-primary stance-join-btn" type="submit"><span>Join matching pool</span><b>→</b></button><button type="button" class="stance-preview-btn" id="stancePreviewTeam">▶ Preview how your team reveal looks</button><div id="hackathonRoleMsg" role="status" aria-live="polite"></div><div class="stance-privacy-note">🔒 Your profile is only shown to students who opted into teammate discovery.</div><input type="hidden" name="competition"></form>';
  document.body.appendChild(dlg);
  dlg.querySelector('#hackathonRoleClose').addEventListener('click',()=>dlg.close());
  dlg.querySelector('#stancePreviewTeam').addEventListener('click',()=>{
   const role=dlg.querySelector('[name="role"]').value||'AI/ML Developer';
   const msg=dlg.querySelector('#hackathonRoleMsg');
   const demoNames=['Aarav Sharma','Ananya Rao','Rohan Mehta','Ishita Nair','Kabir Das','Meera Iyer','Aditya Kumar','Diya Shah','Arjun Reddy','Sana Khan'];
   const shuffledNames=[...demoNames].sort(()=>Math.random()-.5);
   const samples=[{label:shuffledNames[0],role:'Frontend Developer',skills:'React · HTML · CSS',score:92,icon:'FE'},{label:shuffledNames[1],role:'Backend Developer',skills:'Python · APIs · Node.js',score:88,icon:'BE'},{label:shuffledNames[2],role:'UI/UX Designer',skills:'Figma · Prototyping',score:85,icon:'UX'},{label:'You',role:role,skills:'Your selected role',score:94,icon:'YOU'}];
   msg.innerHTML='<section class="stance-preview-stage stance-cinematic"><div class="stance-scan-head"><span class="stance-scan-pulse"></span><div><b id="stanceScanTitle">Scanning the talent pool</b><small id="stanceScanSub">Comparing skills · roles · SkillScores</small></div><strong id="stanceScanCount">0/4</strong></div><div class="stance-scan-track"><i id="stanceScanBar"></i></div><div class="stance-radar"><div class="stance-radar-ring"></div><div class="stance-radar-ring ring-two"></div><div class="stance-radar-sweep"></div><span class="radar-core">✦</span><span class="radar-dot dot-one">FE</span><span class="radar-dot dot-two">BE</span><span class="radar-dot dot-three">UX</span><span class="radar-dot dot-four">YOU</span></div><div class="stance-scan-caption" id="stanceScanCaption">Searching for complementary roles...</div><div id="stanceScanCards" class="stance-scan-cards"></div><div id="stanceConstellation" class="stance-constellation" hidden><div class="stance-constellation-line"></div><div class="stance-team-orbit"><span>✦</span><b>YOUR TEAM</b><small>4 complementary roles</small></div></div><div class="stance-preview-foot">Illustrative students only — actual teammates appear when real opted-in students match.</div></section>';
   const cards=msg.querySelector('#stanceScanCards'),bar=msg.querySelector('#stanceScanBar'),count=msg.querySelector('#stanceScanCount'),radar=msg.querySelector('.stance-radar'),caption=msg.querySelector('#stanceScanCaption'),title=msg.querySelector('#stanceScanTitle');
   const reveal=(i)=>{
    if(i===0){title.textContent='Potential teammates detected';caption.textContent='Checking role compatibility...';}
    const person=samples[i],card=document.createElement('article');card.className='stance-scan-person stance-flip-in';card.style.setProperty('--card-delay',i*90+'ms');
    card.innerHTML='<span class="stance-scan-avatar">'+person.icon+'</span><div><b>'+person.label+'</b><small>'+person.role+'</small><em>'+person.skills+'</em></div><strong class="stance-match-score">'+person.score+'%</strong>';
    cards.appendChild(card);count.textContent=(i+1)+'/4';bar.style.width=((i+1)*25)+'%';caption.textContent='Matched '+person.role+' · '+person.score+'% compatibility';
    // Keep newly revealed names in view on shorter screens.
    card.scrollIntoView({block:'nearest',behavior:'smooth'});
    if(i===3){
     radar.classList.add('radar-found');title.textContent='All roles connected!';caption.textContent='Your team has a balanced mix of skills.';
     const constellation=msg.querySelector('#stanceConstellation');constellation.hidden=false;
     const done=document.createElement('div');done.className='stance-preview-complete stance-grand-finale';done.innerHTML='<b>✦ Your team is complete!</b><span>4 complementary roles · Ready for team confirmation</span><button type="button" id="stanceReplayReveal">↻ Replay reveal</button>';cards.appendChild(done);
     for(let n=0;n<22;n++){const conf=document.createElement('i');conf.className='stance-confetti';conf.style.setProperty('--confetti-x',(Math.random()*100)+'%');conf.style.setProperty('--confetti-delay',(Math.random()*.7)+'s');conf.style.setProperty('--confetti-rotate',(Math.random()*240)+'deg');msg.querySelector('.stance-preview-stage').appendChild(conf);}
     msg.querySelector('#stanceReplayReveal').addEventListener('click',()=>dlg.querySelector('#stancePreviewTeam').click());
    }
   };
   radar.classList.add('radar-active');
   // A celebratory burst fires as the scan finishes, before teammate cards appear.
   setTimeout(()=>{
    const stage=msg.querySelector('.stance-preview-stage');
    for(let n=0;n<42;n++){
     const bit=document.createElement('i');bit.className='stance-scan-confetti';
     bit.style.setProperty('--burst-angle',(n*360/42)+'deg');
     const distance=55+Math.random()*75,angle=n*2*Math.PI/42;
     bit.style.setProperty('--burst-x',(Math.cos(angle)*distance)+'px');
     bit.style.setProperty('--burst-y',(Math.sin(angle)*distance)+'px');
     bit.style.setProperty('--burst-delay',(Math.random()*.25)+'s');
     stage.appendChild(bit);
    }
    caption.textContent='We found potential teammates — revealing your matches!';
   },1050);
   samples.forEach((_,i)=>setTimeout(()=>reveal(i),2050+i*850));
  });
  dlg.querySelector('form').addEventListener('submit',async ev=>{
   ev.preventDefault();const form=ev.currentTarget,fd=new FormData(form),msg=dlg.querySelector('#hackathonRoleMsg'),submit=form.querySelector('button[type="submit"]');
   submit.disabled=true;msg.textContent='Finding a complementary teammate...';
   try{
    const response=await fetch('/api/hackathon-team',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({competition:fd.get('competition'),role:fd.get('role')})});
    const data=await response.json();if(!response.ok)throw new Error(data.error||'Matching could not be started.');
    if(data.status==='matched'){
     const people=data.team.map((x,i)=>'<article class="stance-reveal-member" style="--reveal-delay:'+i*180+'ms"><span class="stance-reveal-avatar">'+(i+1)+'</span><div class="stance-reveal-copy"><strong>'+x.label+'</strong><span>'+x.role+'</span><small>SkillScore '+x.skillScore+'</small></div><b class="stance-reveal-check">✓</b></article>').join('');
     msg.innerHTML='<section class="stance-team-reveal"><div class="stance-reveal-kicker">✦ MATCH COMPLETE</div><h3>Your team is taking shape!</h3><p>STANCE found a student with a complementary role for this hackathon.</p><div class="stance-reveal-list">'+people+'</div><div class="stance-reveal-note"><strong>Why this match?</strong><span>Different selected roles and SkillScore closeness help create a balanced team.</span></div><small class="stance-reveal-foot">Student labels are anonymous. Team confirmation should happen before you begin working together.</small></section>';
    }else{
     msg.innerHTML='<section class="stance-team-reveal stance-waiting"><div class="stance-reveal-orbit">⌁</div><h3>You’re in the matching pool!</h3><p>'+String(data.message||'STANCE will look for a student with a complementary role.').replace(/[<>&]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]))+'</p><div class="stance-waiting-status"><span></span> Waiting for another opted-in student</div></section>';
    }
   }catch(err){msg.textContent=err.message;}finally{submit.disabled=false;}
  });
 }
 const eventName=trigger.dataset.competition||'Hackathon';
 dlg.querySelector('[name="competition"]').value=eventName;
 dlg.querySelector('.stance-event-name').textContent=eventName;
 dlg.showModal();
});