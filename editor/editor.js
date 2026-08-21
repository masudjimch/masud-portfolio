const WORKER="https://masud-portfolio-auth.masudj16.workers.dev";
const $=s=>document.querySelector(s);
const map={skill:["skillTemplate","skillsList"],service:["serviceTemplate","servicesList"],experience:["experienceTemplate","experienceList"],project:["projectTemplate","projectsList"]};
let sessionToken=null;
function add(t,v={}){const[a,b]=map[t],n=$("#"+a).content.cloneNode(true),i=n.querySelector(".item");Object.entries(v).forEach(([k,x])=>{const e=i.querySelector(`[data-field="${k}"]`);if(e)e.value=x??""});i.querySelector(".remove").onclick=()=>i.remove();$("#"+b).appendChild(n)}
document.querySelectorAll("[data-add]").forEach(b=>b.onclick=()=>add(b.dataset.add));
function fill(d){$("#editorForm").reset();["skills","services","experience","projects"].forEach(x=>$("#"+x+"List").innerHTML="");const p=d.profile||{},a=d.about||{},c=d.contact||{},s=c.socials||{},set=(n,v)=>$(`[name="${n}"]`).value=v??"";set("name",p.name);set("nickname",p.nickname);set("title",p.title);set("shortDescription",p.shortDescription);set("profileImage",p.image);set("aboutTitle",a.title);set("aboutDescription",a.description);set("email",c.email);set("facebook",s.Facebook);set("linkedin",s.LinkedIn);set("github",s.GitHub);(d.skills||[]).forEach(x=>add("skill",x));(d.services||[]).forEach(x=>add("service",x));(d.experience||[]).forEach(x=>add("experience",x));(d.projects||[]).forEach(x=>add("project",x))}
function list(id){return[...document.querySelectorAll("#"+id+"List .item")].map(i=>{const o={};i.querySelectorAll("[data-field]").forEach(e=>o[e.dataset.field]=e.type==="number"?Number(e.value||0):e.value);return o})}
function getData(){const f=$("#editorForm"),v=n=>f.elements[n].value.trim();return{profile:{name:v("name"),nickname:v("nickname"),title:v("title"),shortDescription:v("shortDescription"),image:v("profileImage")},about:{title:v("aboutTitle"),description:v("aboutDescription")},skills:list("skills"),services:list("services"),experience:list("experience"),projects:list("projects"),contact:{email:v("email"),socials:{Facebook:v("facebook"),LinkedIn:v("linkedin"),GitHub:v("github")}}}}
async function load(){try{const r=await fetch("../data/portfolio.json",{cache:"no-store"});if(!r.ok)throw Error();fill(await r.json());$("#status").textContent="Current website data loaded."}catch{$("#status").textContent="Could not load current data."}}
async function checkSession() {
  const tokenFromUrl = new URLSearchParams(location.hash.slice(1)).get("session");

  // নতুন login থেকে token এলে sessionStorage-এ রাখো
  if (tokenFromUrl) {
    sessionStorage.setItem("portfolioSession", tokenFromUrl);
    sessionToken = tokenFromUrl;

    // URL clean করো
    history.replaceState(null, "", location.pathname);
  } else {
    // Refresh হলেও আগের session ব্যবহার করো
    sessionToken = sessionStorage.getItem("portfolioSession");
  }

  if (!sessionToken) {
    $("#loginStatus").textContent = "Login required";
    return;
  }

  try {
    const r = await fetch(WORKER + "/session", {
      headers: {
        Authorization: "Bearer " + sessionToken
      }
    });

    if (r.ok) {
      $("#loginStatus").textContent = "Logged in ✓";
      $("#saveBtn").disabled = false;
      $("#saveBtnBottom").disabled = false;
    } else {
      sessionStorage.removeItem("portfolioSession");
      $("#loginStatus").textContent = "Session invalid";
    }
  } catch {
    $("#loginStatus").textContent = "Could not verify session";
  }
}
async function save(){if(!sessionToken)return;$("#status").textContent="Saving to GitHub…";try{const r=await fetch(WORKER+"/save",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+sessionToken},body:JSON.stringify({content:getData()})});const d=await r.json();if(!r.ok)throw Error(d.error||"Save failed");$("#status").textContent="Saved to GitHub ✓ Website will update shortly."}catch(e){$("#status").textContent="Save failed: "+e.message}}
function download(){const b=new Blob([JSON.stringify(getData(),null,2)],{type:"application/json"}),u=URL.createObjectURL(b),a=document.createElement("a");a.href=u;a.download="portfolio.json";a.click();URL.revokeObjectURL(u)}
$("#saveBtn").onclick=save;$("#saveBtnBottom").onclick=save;$("#downloadBtn").onclick=download;
load();checkSession();