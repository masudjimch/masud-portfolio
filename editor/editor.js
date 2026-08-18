const $ = (s) => document.querySelector(s);

const sample = {
  profile: {
    name: "Md. Moshiur Rahman",
    nickname: "Masud",
    title: "Doctor | Medical Educator | Tech-freak Thinker",
    shortDescription: "A doctor, medical educator and technology enthusiast exploring the intersection of healthcare, knowledge and digital innovation.",
    image: "assets/images/profile.jpg"
  },
  about: {
    title: "Where medicine, knowledge and technology meet curiosity.",
    description: "I am passionate about exploring the intersection of healthcare, education and technology."
  },
  skills: [
    {name:"Medical Education",level:90},
    {name:"Healthcare",level:90},
    {name:"Technology",level:85},
    {name:"AI & Digital Tools",level:80}
  ],
  experience: [
    {year:"Present",title:"Associate Professor, Anatomy",organization:"Ad-din Akij Medical College",description:"Teaching anatomy and contributing to medical education."}
  ],
  projects: [
    {title:"Future Medical Project",category:"Medical / Technology",description:"Your featured project description will go here.",image:"assets/images/project-1.jpg",link:"#"}
  ],
  contact:{email:"your-email@example.com",socials:{Facebook:"#",LinkedIn:"#",GitHub:"#"}}
};

function addItem(type, values = {}) {
  const map = {skill:["skillTemplate","skillsList"],experience:["experienceTemplate","experienceList"],project:["projectTemplate","projectsList"]};
  const [templateId,listId] = map[type];
  const node = $("#" + templateId).content.cloneNode(true);
  const item = node.querySelector(".repeat-item");
  Object.entries(values).forEach(([key,value]) => {
    const input = item.querySelector(`[data-field="${key}"]`);
    if (input) input.value = value ?? "";
  });
  item.querySelector(".remove").addEventListener("click", () => item.remove());
  $("#" + listId).appendChild(node);
}

document.querySelectorAll("[data-add]").forEach(btn => btn.addEventListener("click", () => addItem(btn.dataset.add)));

function fillForm(data) {
  $("#editorForm").reset();
  $("#skillsList").innerHTML = "";
  $("#experienceList").innerHTML = "";
  $("#projectsList").innerHTML = "";

  const p = data.profile || {}, a = data.about || {}, c = data.contact || {}, s = c.socials || {};
  const set = (name,value) => { const el = document.querySelector(`[name="${name}"]`); if(el) el.value = value ?? ""; };
  set("name",p.name); set("nickname",p.nickname); set("title",p.title);
  set("shortDescription",p.shortDescription); set("profileImage",p.image);
  set("aboutTitle",a.title); set("aboutDescription",a.description);
  set("email",c.email); set("facebook",s.Facebook); set("linkedin",s.LinkedIn); set("github",s.GitHub);

  (data.skills || []).forEach(x => addItem("skill",x));
  (data.experience || []).forEach(x => addItem("experience",x));
  (data.projects || []).forEach(x => addItem("project",x));
}

function values(listSelector) {
  return [...document.querySelectorAll(listSelector + " .repeat-item")].map(item => {
    const obj = {};
    item.querySelectorAll("[data-field]").forEach(el => obj[el.dataset.field] = el.type === "number" ? Number(el.value || 0) : el.value);
    return obj;
  });
}

function getData() {
  const f = $("#editorForm");
  const val = n => f.elements[n].value.trim();
  return {
    profile:{name:val("name"),nickname:val("nickname"),title:val("title"),shortDescription:val("shortDescription"),image:val("profileImage")},
    about:{title:val("aboutTitle"),description:val("aboutDescription")},
    skills:values("#skillsList"),
    experience:values("#experienceList"),
    projects:values("#projectsList"),
    contact:{email:val("email"),socials:{Facebook:val("facebook"),LinkedIn:val("linkedin"),GitHub:val("github")}}
  };
}

function download() {
  const blob = new Blob([JSON.stringify(getData(),null,2)], {type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href=url; a.download="portfolio.json"; a.click();
  URL.revokeObjectURL(url);
}

$("#downloadBtn").addEventListener("click",download);
$("#downloadBtnBottom").addEventListener("click",download);
$("#loadSample").addEventListener("click",()=>fillForm(sample));

$("#importFile").addEventListener("change", async e => {
  const file=e.target.files[0]; if(!file) return;
  try { fillForm(JSON.parse(await file.text())); }
  catch { alert("This file is not a valid portfolio.json file."); }
});

fillForm(sample);
