const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');

if (menuBtn && navLinks) {
  menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
    });
  });
}

document.getElementById('year').textContent = new Date().getFullYear();


// ===============================
// PRIVATE PORTFOLIO EDIT BUTTON
// ===============================

const WORKER = "https://masud-portfolio-auth.masudj16.workers.dev";
const editPortfolioBtn = document.getElementById('editPortfolioBtn');

async function checkAdminSession() {
  if (!editPortfolioBtn) return;

  try {
    // বর্তমান browser URL-এ session token থাকলে সেটি নেওয়া
    const sessionToken =
      new URLSearchParams(location.hash.slice(1)).get("session");

    if (!sessionToken) return;

    const response = await fetch(WORKER + "/session", {
      headers: {
        Authorization: "Bearer " + sessionToken
      }
    });

    if (response.ok) {
      editPortfolioBtn.hidden = false;

      // URL থেকে session token লুকিয়ে ফেলা
      history.replaceState(null, "", location.pathname);
    }
  } catch (error) {
    console.log("Admin session not available.");
  }
}

checkAdminSession();