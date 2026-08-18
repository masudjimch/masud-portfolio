async function loadPortfolio() {
  try {
    const response = await fetch('data/portfolio.json');
    if (!response.ok) throw new Error('Could not load portfolio data.');
    const data = await response.json();

    document.querySelectorAll('[data-name]').forEach(el => el.textContent = data.profile.name);
    document.querySelectorAll('[data-nickname]').forEach(el => el.textContent = data.profile.nickname);
    document.querySelectorAll('[data-title]').forEach(el => el.textContent = data.profile.title);
    document.querySelectorAll('[data-description]').forEach(el => el.textContent = data.profile.shortDescription);
    document.querySelector('[data-about-title]').textContent = data.about.title;
    document.querySelector('[data-about-description]').textContent = data.about.description;
    document.getElementById('profileImage').src = data.profile.image;

    const skills = document.getElementById('skillsContainer');
    skills.innerHTML = data.skills.map(s => `<div class="skill-item"><div class="skill-top"><span>${s.name}</span><span>${s.level}%</span></div><div class="skill-bar"><div class="skill-progress" style="width:${s.level}%"></div></div></div>`).join('');

    const services = document.getElementById('expertiseContainer');
    services.innerHTML = data.services.map((s,i) => `<article class="expertise-card ${i===1?'featured':''}"><div class="number">${s.number}</div><div class="icon">${s.icon}</div><h3>${s.title}</h3><p>${s.description}</p></article>`).join('');

    const experience = document.getElementById('experienceContainer');
    experience.innerHTML = data.experience.map(e => `<article class="experience-item"><div class="experience-year">${e.year}</div><div class="experience-content"><h3>${e.title}</h3><h4>${e.organization}</h4><p>${e.description}</p></div></article>`).join('');

    const projects = document.getElementById('projectContainer');
    projects.innerHTML = data.projects.map((p,i) => `<article class="project-card ${i===0?'project-large':''}"><img class="project-image" src="${p.image}" alt="${p.title}"><div class="project-overlay"></div><div class="project-content"><span class="project-number">PROJECT ${String(i+1).padStart(2,'0')}</span><h3>${p.title}</h3><p>${p.category}</p></div><a href="${p.link}" class="project-arrow" target="_blank" rel="noopener" aria-label="View ${p.title}">↗</a></article>`).join('');

    const email = document.querySelector('[data-email]');
    email.href = `mailto:${data.contact.email}`;
    email.textContent = data.contact.email;

    const social = document.getElementById('socialLinks');
    social.innerHTML = Object.entries(data.contact.socials).filter(([,url]) => url && url !== '#').map(([name,url]) => `<a href="${url}" target="_blank" rel="noopener">${name}</a>`).join('');
  } catch (error) {
    console.error(error);
  }
}
loadPortfolio();
