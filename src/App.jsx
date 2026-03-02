import { useState, useRef, useEffect } from "react";

// ── Data ────────────────────────────────────────────────────────────────────

const PARTS = {
  manager: [
    { id: "perfectionist", label: "The Perfectionist", desc: "pushes you to get everything right" },
    { id: "achiever",      label: "The High Achiever",  desc: "driven to succeed and perform" },
    { id: "critic",        label: "The Inner Critic",   desc: "points out mistakes to prevent failure" },
    { id: "pleaser",       label: "The People Pleaser", desc: "wants others to feel happy with you" },
    { id: "responsible",   label: "The Responsible One",desc: "carries everyone's burden" },
    { id: "planner",       label: "The Planner / Controller", desc: "needs certainty and structure" },
    { id: "strong",        label: "The Strong One",     desc: "avoids showing vulnerability" },
    { id: "caretaker",     label: "The Caretaker",      desc: "takes care of others before yourself" },
  ],
  firefighter: [
    { id: "procrastinator",label: "The Procrastinator", desc: "avoids what feels heavy or scary" },
    { id: "numbing",       label: "The Numbing Part",   desc: "scrolls, eats, works, or distracts" },
    { id: "defender",      label: "The Angry Defender", desc: "reacts quickly to protect you" },
    { id: "shutdown",      label: "The Shutdown Part",  desc: "withdraws or goes quiet" },
    { id: "rebel",         label: "The Rebel",          desc: "resists expectations or pressure" },
    { id: "saboteur",      label: "The Self-Saboteur",  desc: "derails things when they get intense" },
  ],
  identity: [
    { id: "doubter",    label: "The Doubter",           desc: "questions your abilities or direction" },
    { id: "burnedout",  label: "The Burned-Out One",    desc: "feels tired and depleted" },
    { id: "ambitious",  label: "The Ambitious One",     desc: "wants more growth and impact" },
    { id: "visionary",  label: "The Visionary",         desc: "imagines a different future" },
    { id: "riskaverse", label: "The Risk-Averse Part",  desc: "fears change or instability" },
    { id: "oldself",    label: "The Old Version of Me", desc: "attached to who you used to be" },
    { id: "emerging",   label: "The Emerging Self",     desc: "sensing something new unfolding" },
  ],
};

const TOPICS = [
  "A repeating pattern in my behavior",
  "A difficult decision",
  "Burnout or exhaustion",
  "Conflict in a relationship",
  "Identity or life transition",
  "Something else",
];

const CATEGORIES = [
  { id: "manager",     icon: "🛡️", label: "Something that tries to stay in control" },
  { id: "firefighter", icon: "🔥", label: "Something that reacts when overwhelmed" },
  { id: "identity",    icon: "🌱", label: "Something about identity or transition" },
  { id: "unsure",      icon: "✦",  label: "I'm not sure" },
];

const IFS_SYSTEM = `You are a warm, compassionate IFS-informed reflection guide — NOT a therapist.
Your role: help users gently get curious about a protective part of themselves.
Rules:
- Use spacious, non-clinical language. 2–3 sentences max.
- Always honor the part's positive, protective intent.
- Normalize — never pathologize.
- End every response with one open, curious question.
- Never push for trauma retrieval or deep childhood work.
- If distress signals appear, gently suggest pausing and breathing.`;

async function askClaude(system, userMsg) {
  try {
    const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || "http://localhost:5000";
    const res = await fetch(`${apiEndpoint}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        system,
        userMsg,
      }),
    });
    const data = await res.json();
    return data.content?.[0]?.text ?? "I'm here with you. Take all the time you need.";
  } catch {
    return "I'm here with you. Take all the time you need.";
  }
}

// ── Small Components ─────────────────────────────────────────────────────────

function GroundingBanner({ onClose }) {
  return (
    <div style={{
      position:"fixed",top:0,left:0,right:0,zIndex:100,
      background:"linear-gradient(135deg,#1a2e1a,#0f1f0f)",
      borderBottom:"1px solid rgba(140,190,130,0.3)",
      padding:"16px 24px",display:"flex",alignItems:"center",gap:14,
    }}>
      <span style={{fontSize:22}}>🌿</span>
      <div style={{flex:1}}>
        <div style={{fontSize:13,fontWeight:500,color:"#a8d8a0",marginBottom:2}}>Grounding pause</div>
        <div style={{fontSize:13,color:"rgba(220,235,215,0.7)"}}>Feel your feet on the floor. Take 3 slow breaths. You are safe.</div>
      </div>
      <button onClick={onClose} style={{background:"none",border:"none",color:"rgba(200,220,195,0.6)",fontSize:22,cursor:"pointer",lineHeight:1}}>×</button>
    </div>
  );
}

function AIBubble({ text, loading }) {
  return (
    <div style={{display:"flex",gap:12,margin:"24px 0",alignItems:"flex-start"}}>
      <div style={{
        width:32,height:32,borderRadius:"50%",flexShrink:0,
        background:"linear-gradient(135deg,rgba(140,185,130,0.25),rgba(100,155,90,0.1))",
        border:"1px solid rgba(140,185,130,0.35)",
        display:"flex",alignItems:"center",justifyContent:"center",
        fontSize:13,color:"#a8d8a0",marginTop:2,
      }}>◎</div>
      <div style={{
        background:"rgba(140,185,130,0.07)",border:"1px solid rgba(140,185,130,0.15)",
        borderRadius:"4px 14px 14px 14px",padding:"14px 18px",
        fontSize:14,lineHeight:1.7,color:"rgba(235,230,220,0.85)",
        flex:1,fontStyle:"italic",
      }}>
        {loading ? (
          <div style={{display:"flex",gap:5,alignItems:"center",padding:"4px 0"}}>
            {[0,1,2].map(i=>(
              <div key={i} style={{width:6,height:6,borderRadius:"50%",background:"rgba(140,185,130,0.5)",animation:`pulse 1.2s ${i*0.2}s infinite`}}/>
            ))}
          </div>
        ) : text}
      </div>
    </div>
  );
}

function ChoiceBtn({ selected, onClick, icon, label, sublabel }) {
  return (
    <button onClick={onClick} style={{
      background:selected?"rgba(140,185,130,0.12)":"rgba(255,255,255,0.03)",
      border:`1px solid ${selected?"rgba(140,185,130,0.45)":"rgba(255,255,255,0.07)"}`,
      borderRadius:10,padding:"14px 18px",
      color:selected?"#b8d8b0":"rgba(232,228,220,0.85)",
      fontSize:14,cursor:"pointer",textAlign:"left",
      display:"flex",alignItems:"center",gap:12,
      transition:"all 0.2s",width:"100%",
      transform:selected?"translateX(4px)":"translateX(0)",
    }}>
      {icon && <span style={{fontSize:18,flexShrink:0}}>{icon}</span>}
      <div style={{flex:1}}>
        <div style={{fontWeight:400}}>{label}</div>
        {sublabel && <div style={{fontSize:12,opacity:0.5,marginTop:2}}>{sublabel}</div>}
      </div>
      {selected && <span style={{color:"#8dc880",fontSize:16}}>✓</span>}
    </button>
  );
}

function SliderInput({ value, onChange }) {
  const color = value >= 7 ? "#e8a080" : value >= 4 ? "#d4c080" : "#8dc880";
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8,fontSize:12,color:"rgba(232,228,220,0.4)"}}>
        <span>0 — Not blended</span><span>10 — Fully merged</span>
      </div>
      <input type="range" min={0} max={10} value={value} onChange={e=>onChange(+e.target.value)}
        style={{width:"100%",accentColor:color,cursor:"pointer"}}/>
      <div style={{textAlign:"center",marginTop:10,fontSize:32,fontFamily:"Cormorant Garamond,serif",color}}>
        {value}<span style={{fontSize:12,marginLeft:8,color:"rgba(232,228,220,0.4)"}}>/10</span>
      </div>
      {value>=7 && (
        <div style={{marginTop:12,padding:"12px 16px",background:"rgba(232,160,128,0.08)",border:"1px solid rgba(232,160,128,0.2)",borderRadius:8,fontSize:13,color:"rgba(232,200,180,0.8)",lineHeight:1.6}}>
          💛 You're very merged with this part right now. See if it can give you just a little space — even 5%. Take a breath and notice: you are the one observing this part.
        </div>
      )}
    </div>
  );
}

function TextBox({ value, onChange, placeholder, rows=3 }) {
  return (
    <textarea rows={rows} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
      style={{width:"100%",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,padding:"14px 16px",color:"#e8e4dc",fontSize:14,lineHeight:1.7,resize:"vertical",outline:"none",fontFamily:"DM Sans,sans-serif",fontWeight:300,transition:"border-color 0.2s"}}
      onFocus={e=>e.target.style.borderColor="rgba(140,185,130,0.4)"}
      onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.1)"}
    />
  );
}

function Btn({ onClick, label="Continue", disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      marginTop:28,padding:"14px 36px",
      background:disabled?"rgba(140,185,130,0.05)":"rgba(140,185,130,0.14)",
      border:`1px solid ${disabled?"rgba(140,185,130,0.1)":"rgba(140,185,130,0.32)"}`,
      borderRadius:50,color:disabled?"rgba(140,185,130,0.25)":"#a8d8a0",
      fontSize:14,cursor:disabled?"not-allowed":"pointer",letterSpacing:1,transition:"all 0.2s",
    }}>{label} →</button>
  );
}

function Dots({ total, current }) {
  return (
    <div style={{display:"flex",gap:6,marginBottom:36}}>
      {Array.from({length:total}).map((_,i)=>(
        <div key={i} style={{height:5,borderRadius:3,transition:"all 0.4s",
          width:i===current?22:6,
          background:i<current?"rgba(140,185,130,0.45)":i===current?"#8dc880":"rgba(255,255,255,0.08)",
        }}/>
      ))}
    </div>
  );
}

function H({ children }) {
  return <h2 style={{fontFamily:"Cormorant Garamond,serif",fontWeight:300,fontSize:30,color:"#f0ebe0",lineHeight:1.3,marginBottom:8}}>{children}</h2>;
}
function Sub({ children }) {
  return <p style={{fontSize:14,color:"rgba(232,228,220,0.5)",marginBottom:32,lineHeight:1.7}}>{children}</p>;
}
function StepTag({ n, label }) {
  return (
    <div style={{marginBottom:10}}>
      <span style={{fontSize:11,letterSpacing:3,textTransform:"uppercase",color:"rgba(140,185,130,0.45)"}}>Step {n} &nbsp;·&nbsp; </span>
      <span style={{fontSize:11,letterSpacing:1,color:"rgba(232,228,220,0.28)",textTransform:"uppercase"}}>{label}</span>
    </div>
  );
}

// ── Step 5 sub-flow ──────────────────────────────────────────────────────────

function Step5({ d, set, partName, onNext }) {
  const [sub, setSub] = useState(0);
  const [aiText, setAiText] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [reflected, setReflected] = useState(false);

  const questions = [
    { key:"q1", q:`What does ${partName||"this part"} seem afraid would happen if it didn't do its job?` },
    { key:"q2", q:`What is it trying to protect you from?` },
    { key:"q3", q:`How long do you sense it's been doing this role?` },
    { key:"q4", q:`What does it need you — your Self — to understand?` },
  ];
  const cur = questions[sub];
  const val = d[cur.key];
  const isLast = sub === 3;

  const handleReflect = async () => {
    setAiLoading(true); setAiText(""); setReflected(false);
    const ctx = `Part: "${partName}". Topic: "${d.topic}". Q: ${cur.q}`;
    const txt = await askClaude(IFS_SYSTEM, `${ctx}\n\nUser shared: "${val}"`);
    setAiText(txt); setAiLoading(false); setReflected(true);
  };

  const handleAdvance = () => {
    if (isLast) {
      onNext();
    } else {
      setSub(s => s + 1);
      setAiText(""); setReflected(false);
    }
  };

  return (
    <div>
      <StepTag n="5" label={`Getting to Know the Part — Q${sub+1} of 4`}/>
      <H>Getting to know {partName||"this part"}</H>
      <Sub>Stay curious. There are no wrong answers.</Sub>

      <div style={{padding:"18px 20px",background:"rgba(140,185,130,0.05)",border:"1px solid rgba(140,185,130,0.14)",borderRadius:10,fontSize:15,fontFamily:"Cormorant Garamond,serif",fontStyle:"italic",color:"rgba(232,228,220,0.85)",marginBottom:18,lineHeight:1.65}}>
        {cur.q}
      </div>

      <TextBox value={val} onChange={v=>{ set(cur.key,v); setReflected(false); setAiText(""); }} placeholder="Take your time…" />

      {/* Step 1: Reflect button — appears once they've typed something */}
      {val.trim() && !reflected && !aiLoading && (
        <button onClick={handleReflect} style={{
          marginTop:18, padding:"12px 30px",
          background:"rgba(140,185,130,0.1)", border:"1px solid rgba(140,185,130,0.28)",
          borderRadius:50, color:"#a8d8a0", fontSize:14, cursor:"pointer", letterSpacing:1,
        }}>✦ Reflect with me</button>
      )}

      {/* AI loading / response */}
      {(aiText || aiLoading) && <AIBubble text={aiText} loading={aiLoading}/>}

      {/* Step 2: Advance button — only appears AFTER reflection is shown */}
      {reflected && !aiLoading && (
        <button onClick={handleAdvance} style={{
          marginTop:8, padding:"14px 36px",
          background:"rgba(140,185,130,0.14)", border:"1px solid rgba(140,185,130,0.32)",
          borderRadius:50, color:"#a8d8a0", fontSize:14, cursor:"pointer", letterSpacing:1,
        }}>
          {isLast ? "Continue to Appreciation →" : "Next question →"}
        </button>
      )}
    </div>
  );
}

// ── Summary Card ─────────────────────────────────────────────────────────────

function SummaryCard({ d, partName, exp, expLoading, onRestart }) {
  const topic = d.topic==="Something else" ? d.topicCustom : d.topic;
  const rows = [
    { label:"Part explored",         value:partName },
    { label:"Situation",             value:topic },
    { label:"Body sensation",        value:d.body },
    { label:"What it fears",         value:d.q1 },
    { label:"What it protects from", value:d.q2 },
    { label:"How long it's served",  value:d.q3 },
    { label:"What it needs",         value:d.q4 },
    { label:"Response to appreciation", value:d.appreciation },
  ].filter(r=>r.value?.trim());

  return (
    <div>
      <StepTag n="7" label="Parts Card Summary"/>
      <H>Your Parts of Me Reflection</H>
      <p style={{fontSize:13,color:"rgba(232,228,220,0.38)",marginBottom:28}}>A record of today's exploration</p>

      <div style={{background:"linear-gradient(160deg,rgba(20,30,20,0.9),rgba(12,18,12,0.95))",border:"1px solid rgba(140,185,130,0.18)",borderRadius:14,padding:"28px 26px",marginBottom:20}}>
        <div style={{fontSize:24,marginBottom:18}}>🌿</div>
        {rows.map(r=>(
          <div key={r.label} style={{marginBottom:18}}>
            <div style={{fontSize:10,letterSpacing:3,textTransform:"uppercase",color:"rgba(140,185,130,0.5)",marginBottom:4}}>{r.label}</div>
            <div style={{fontSize:14,color:"rgba(232,228,220,0.82)",lineHeight:1.65}}>{r.value}</div>
          </div>
        ))}
        <div style={{borderTop:"1px solid rgba(140,185,130,0.12)",paddingTop:18,marginTop:4}}>
          <div style={{fontSize:10,letterSpacing:3,textTransform:"uppercase",color:"rgba(140,185,130,0.5)",marginBottom:8}}>Small experiment this week</div>
          {expLoading ? (
            <div style={{display:"flex",gap:5}}>{[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:"rgba(140,185,130,0.4)",animation:`pulse 1.2s ${i*0.2}s infinite`}}/>)}</div>
          ) : (
            <div style={{fontSize:14,color:"#a8d8a0",lineHeight:1.65,fontStyle:"italic"}}>{exp}</div>
          )}
        </div>
      </div>

      <div style={{textAlign:"center",padding:"20px 16px",fontFamily:"Cormorant Garamond,serif",fontStyle:"italic",fontSize:17,color:"rgba(232,228,220,0.4)",lineHeight:1.8}}>
        Notice your breath.<br/>You are more than any single part.
      </div>

      <div style={{display:"flex",gap:12,marginTop:20}}>
        <button onClick={()=>window.print()} style={{flex:1,padding:"13px 0",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:50,color:"rgba(232,228,220,0.55)",fontSize:13,cursor:"pointer"}}>↓ Save / Print</button>
        <button onClick={onRestart} style={{flex:1,padding:"13px 0",background:"rgba(140,185,130,0.1)",border:"1px solid rgba(140,185,130,0.25)",borderRadius:50,color:"#a8d8a0",fontSize:13,cursor:"pointer"}}>↺ New session</button>
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────

export default function IFSExplorer() {
  const [step, setStep] = useState(0);
  const [grounding, setGrounding] = useState(false);
  const [exp, setExp] = useState("");
  const [expLoading, setExpLoading] = useState(false);
  const [aiText6, setAiText6] = useState("");
  const [aiLoading6, setAiLoading6] = useState(false);
  const topRef = useRef(null);

  const [d, setD] = useState({
    topic:"",topicCustom:"",category:"",part:"",partCustom:"",
    body:"",blend:5,q1:"",q2:"",q3:"",q4:"",appreciation:"",
  });
  const set = (k,v) => setD(p=>({...p,[k]:v}));

  useEffect(()=>{ topRef.current?.scrollIntoView({behavior:"smooth"}); },[step]);

  const partList = d.category && d.category!=="unsure" ? PARTS[d.category] : PARTS.manager;
  const partName = d.part==="custom" ? d.partCustom : (partList.find(p=>p.id===d.part)?.label ?? "");

  const generateExp = async () => {
    setExpLoading(true);
    const ctx = `Part: "${partName}". Topic: "${d.topic}". Fears: "${d.q1}". Protects from: "${d.q2}". Needs: "${d.q4}".`;
    const txt = await askClaude(IFS_SYSTEM+"\n\nSuggest ONE small, concrete, grounded weekly experiment — 1 sentence only, no bullets, no preamble.", ctx);
    setExp(txt); setExpLoading(false);
  };

  const reflect6 = async () => {
    setAiLoading6(true); setAiText6("");
    const ctx = `Part: "${partName}". Appreciation response: "${d.appreciation}"`;
    const txt = await askClaude(IFS_SYSTEM, ctx);
    setAiText6(txt); setAiLoading6(false);
  };

  const reset = () => {
    setD({topic:"",topicCustom:"",category:"",part:"",partCustom:"",body:"",blend:5,q1:"",q2:"",q3:"",q4:"",appreciation:""});
    setExp(""); setAiText6(""); setStep(0);
  };

  const TOTAL = 8;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:#0b0d0b;}
        textarea::placeholder{color:rgba(200,195,185,0.28);}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-thumb{background:rgba(140,185,130,0.18);border-radius:2px;}
        @keyframes pulse{0%,100%{opacity:0.3;transform:scale(0.8)}50%{opacity:1;transform:scale(1)}}
      `}</style>

      {grounding && <GroundingBanner onClose={()=>setGrounding(false)}/>}

      <div style={{minHeight:"100vh",background:"#0b0d0b",display:"flex",flexDirection:"column",alignItems:"center",paddingTop:grounding?80:0,paddingBottom:80,fontFamily:"DM Sans,sans-serif",backgroundImage:"radial-gradient(ellipse at 10% 15%,rgba(80,120,70,0.07) 0%,transparent 55%),radial-gradient(ellipse at 88% 85%,rgba(140,100,60,0.05) 0%,transparent 55%)"}}>

        <div ref={topRef} style={{width:"100%",maxWidth:580,padding:"36px 24px 0"}}>
          <div style={{fontSize:11,letterSpacing:5,textTransform:"uppercase",color:"rgba(140,185,130,0.38)",marginBottom:26}}>Parts of Me</div>
          <Dots total={TOTAL} current={step}/>
        </div>

        {/* Ground me button */}
        <div style={{width:"100%",maxWidth:580,padding:"0 24px",display:"flex",justifyContent:"flex-end",marginBottom:-4}}>
          <button onClick={()=>setGrounding(g=>!g)} style={{background:"none",border:"1px solid rgba(140,185,130,0.14)",borderRadius:20,padding:"5px 14px",fontSize:11,color:"rgba(140,185,130,0.45)",cursor:"pointer",letterSpacing:1}}>🌿 Ground me</button>
        </div>

        <div style={{width:"100%",maxWidth:580,padding:"24px 24px 0"}}>

          {/* ── Step 0: Welcome ── */}
          {step===0 && (
            <div>
              <div style={{fontSize:36,marginBottom:16}}>🌿</div>
              <StepTag n="0" label="Welcome"/>
              <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:42,fontWeight:300,color:"#f0ebe0",letterSpacing:1,marginBottom:6}}>Parts of Me</div>
              <H>A space to meet yourself</H>
              <Sub>This is a self-guided reflection tool inspired by Internal Family Systems (IFS). It is not therapy. At any moment you can pause, breathe, or stop.</Sub>
              <div style={{padding:"18px 20px",background:"rgba(232,160,100,0.07)",border:"1px solid rgba(232,180,120,0.16)",borderRadius:10,fontSize:13,color:"rgba(232,220,200,0.6)",lineHeight:1.8,marginBottom:28}}>
                ⚠️ If you are in crisis or feel unsafe, please reach out to a mental health professional or local crisis resource before continuing.
              </div>
              <ChoiceBtn icon="✓" label="I understand and would like to continue" selected={d.topic==="__agree__"} onClick={()=>set("topic","__agree__")}/>
              <Btn disabled={d.topic!=="__agree__"} onClick={()=>{set("topic","");setStep(1);}} label="Begin"/>
            </div>
          )}

          {/* ── Step 1: Topic ── */}
          {step===1 && (
            <div>
              <StepTag n="1" label="What Are You Exploring?"/>
              <H>What feels most present right now?</H>
              <Sub>Choose the theme that's calling for attention today.</Sub>
              <div style={{display:"flex",flexDirection:"column",gap:9}}>
                {TOPICS.map(t=><ChoiceBtn key={t} label={t} selected={d.topic===t} onClick={()=>set("topic",t)}/>)}
              </div>
              {d.topic==="Something else" && (
                <div style={{marginTop:14}}><TextBox value={d.topicCustom} onChange={v=>set("topicCustom",v)} placeholder="Describe what's present for you…" rows={2}/></div>
              )}
              <Btn disabled={!d.topic||(d.topic==="Something else"&&!d.topicCustom.trim())} onClick={()=>setStep(2)}/>
            </div>
          )}

          {/* ── Step 2: Category ── */}
          {step===2 && (
            <div>
              <StepTag n="2" label="Name the Energy"/>
              <H>When you think about this, what kind of energy shows up?</H>
              <Sub>Don't overthink — go with your first instinct.</Sub>
              <div style={{display:"flex",flexDirection:"column",gap:9}}>
                {CATEGORIES.map(c=><ChoiceBtn key={c.id} icon={c.icon} label={c.label} selected={d.category===c.id} onClick={()=>set("category",c.id)}/>)}
              </div>
              <Btn disabled={!d.category} onClick={()=>setStep(3)}/>
            </div>
          )}

          {/* ── Step 3: Part ── */}
          {step===3 && (
            <div>
              <StepTag n="3" label="Meet the Part"/>
              <H>Which of these feels most familiar?</H>
              <Sub>Select the one that resonates, or describe your own.</Sub>
              <div style={{display:"flex",flexDirection:"column",gap:9}}>
                {partList.map(p=><ChoiceBtn key={p.id} label={p.label} sublabel={p.desc} selected={d.part===p.id} onClick={()=>set("part",p.id)}/>)}
                <ChoiceBtn label="I'll describe my own" sublabel="in my own words" selected={d.part==="custom"} onClick={()=>set("part","custom")}/>
              </div>
              {d.part==="custom" && (
                <div style={{marginTop:14}}><TextBox value={d.partCustom} onChange={v=>set("partCustom",v)} placeholder="Give this part a name or describe it…" rows={2}/></div>
              )}
              <Btn disabled={!d.part||(d.part==="custom"&&!d.partCustom.trim())} onClick={()=>setStep(4)}/>
            </div>
          )}

          {/* ── Step 4: Unblending ── */}
          {step===4 && (
            <div>
              <StepTag n="4" label="Unblending"/>
              <H>Getting a little space from {partName||"this part"}</H>
              <Sub>Take a slow breath before you answer.</Sub>
              <div style={{marginBottom:28}}>
                <div style={{fontSize:13,color:"rgba(140,185,130,0.65)",marginBottom:10,letterSpacing:0.5}}>Where do you feel this part in your body?</div>
                <TextBox value={d.body} onChange={v=>set("body",v)} placeholder="e.g. tightness in my chest, a knot in my stomach…" rows={2}/>
              </div>
              <div>
                <div style={{fontSize:13,color:"rgba(140,185,130,0.65)",marginBottom:14,letterSpacing:0.5}}>How blended (merged) do you feel with this part right now?</div>
                <SliderInput value={d.blend} onChange={v=>set("blend",v)}/>
              </div>
              <Btn disabled={!d.body.trim()} onClick={()=>setStep(5)}/>
            </div>
          )}

          {/* ── Step 5: 4 Questions ── */}
          {step===5 && (
            <Step5 d={d} set={set} partName={partName} onNext={()=>setStep(6)}/>
          )}

          {/* ── Step 6: Appreciation ── */}
          {step===6 && (
            <div>
              <StepTag n="6" label="Appreciation"/>
              <H>Thank {partName||"this part"} for its care</H>
              <Sub>This part has been working hard to protect you. See if you can offer it a moment of genuine appreciation.</Sub>
              <TextBox value={d.appreciation} onChange={v=>set("appreciation",v)} placeholder="How does this part respond when you thank it?…"/>
              {d.appreciation.trim().length>8 && !aiText6 && !aiLoading6 && (
                <button onClick={reflect6} style={{marginTop:12,background:"none",border:"none",color:"rgba(140,185,130,0.6)",fontSize:13,cursor:"pointer",letterSpacing:0.5}}>✦ Reflect with me</button>
              )}
              {(aiText6||aiLoading6) && <AIBubble text={aiText6} loading={aiLoading6}/>}
              <Btn disabled={!d.appreciation.trim()} onClick={()=>{generateExp();setStep(7);}} label="See my reflection"/>
            </div>
          )}

          {/* ── Step 7: Summary ── */}
          {step===7 && (
            <SummaryCard d={d} partName={partName} exp={exp} expLoading={expLoading} onRestart={reset}/>
          )}

        </div>
      </div>
    </>
  );
}
