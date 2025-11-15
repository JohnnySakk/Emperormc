// Basic UI interactions: modal, hamburger, simple form validation
// Function to play UI sound
function playUISound() {
  if (uiSound) {
    uiSound.currentTime = 0;
    uiSound.play();
  }
}

// Function to open modal
function openModal() {
  if (!modalBackdrop) return;
  modalBackdrop.classList.add('show');
  modalBackdrop.setAttribute('aria-hidden','false');
  playUISound();
}

document.addEventListener("DOMContentLoaded", () => {
  // modal
  const modal = document.getElementById("modal");
  const modalClose = document.getElementById("modalClose");
  const loginBtns = document.querySelectorAll("#loginBtn, #loginBtn2, #loginBtn3, #loginBtn4");
  const registerBtns = document.querySelectorAll("#registerBtn, #registerBtn2, #registerBtn3, #registerBtn4");
  const modalTitle = document.getElementById("modalTitle");
  const switchAuth = document.getElementById("switchAuth");
const navMenu = document.getElementById('navMenu');
const menuToggle = document.getElementById('menuToggle');
const uiSound = document.getElementById('uiSound');
const modalBackdrop = document.getElementById('modalBackdrop'); // Add this if not already declared

function closeModal(){
  modalBackdrop.classList.remove('show');
  modalBackdrop.setAttribute('aria-hidden','true');
}

document.addEventListener('click', (ev) => {
  const t = ev.target;

  if(t.closest('#menuToggle')){
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    playUISound();
    return;
  }

  if(t.closest('.view-btn')){
    const id = t.closest('.view-btn').getAttribute('data-id');
    openModalForGame(id);
    return;
  }

  if(t === modalClose){
    closeModal();
    playUISound();
    return;
  }

  if(t === modalBackdrop){
    closeModal();
    playUISound();
    return;
  }

  const clickable = t.closest('a') || t.closest('button');
  if(clickable){

    playUISound();
  }
});

document.addEventListener('keydown', (ev) => {
  if(ev.key === 'Escape'){
    if(modalBackdrop.classList.contains('show')) {
      closeModal();
      playUISound();
    }
   
    if(navMenu.classList.contains('active')){
      navMenu.classList.remove('active');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded','false');
      playUISound();
    }
  }
});

paginationEl.addEventListener('click', (ev) => {
  const t = ev.target;
  if(t.tagName === 'BUTTON') playUISound();
});

searchInput.addEventListener('input', (e) => {
  filteredGames = filterGames(e.target.value);
  currentPage = 1;
  renderGames();
});

modalImage.addEventListener('error', () => {
  modalImage.src = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='400' height='200'><rect width='100%' height='100%' fill='#222'/><text x='50%' y='50%' fill='#666' font-size='20' text-anchor='middle' font-family='Segoe UI, Arial'>No image</text></svg>`);
});

(function init(){
  filteredGames = filterGames('');
  currentPage = 1;
  renderGames();
})();

document.addEventListener('click', (e) => {
  if (e.target.matches('.view-btn')) {
    const id = parseInt(e.target.dataset.id, 10);
    const game = games.find(g => g.id === id);
    if (game) {
      playUISound();
      modalImage.src = game.image;
      modalTitle.textContent = game.title;
      modalUploaded.textContent = 'Uploaded: ' + game.uploaded_at;


      modalConfig.innerHTML = `
        OS: ${escapeHtml(game.os)}<br>
        Processor: ${escapeHtml(game.processor)}<br>
        Memory: ${escapeHtml(game.memory)}<br>
        GPU: ${escapeHtml(game.gpu)}<br>
        Storage: ${escapeHtml(game.storage)}
      `;

      modalDownload.href = game.zip;
      modalBackdrop.classList.add('show');
    }
  }
});


modalClose.addEventListener('click', () => {
  playUISound();
  modalBackdrop.classList.remove('show');
});


modalBackdrop.addEventListener('click', (e) => {
  if (e.target === modalBackdrop) {
    playUISound();
    modalBackdrop.classList.remove('show');
  }
});

  function showModal(mode="login"){
    if(!modal) return;
    modal.classList.remove("hidden");
    modalTitle.textContent = mode === "login" ? "Login" : "Register";
    switchAuth.textContent = mode === "login" ? "Switch to Register" : "Switch to Login";
  }
  function hideModal(){ if(modal) modal.classList.add("hidden"); }

  loginBtns.forEach(b => b && b.addEventListener("click", ()=> showModal("login")));
  registerBtns.forEach(b => b && b.addEventListener("click", ()=> showModal("register")));
  modalClose && modalClose.addEventListener("click", hideModal);
  modal && modal.addEventListener("click", (e)=> { if(e.target === modal) hideModal(); });

  switchAuth && switchAuth.addEventListener("click", ()=> {
    const isLogin = modalTitle.textContent.toLowerCase().includes("login");
    showModal(isLogin ? "register" : "login");
  });

  const authForm = document.getElementById("authForm");
  authForm && authForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    // fake front-end "success" (replace with real backend integration later)
    alert("Submitted (front-end only). Hook this to your backend to authenticate/register users.");
    hideModal();
  });

  // support form
  const supportForm = document.getElementById("supportForm");
  supportForm && supportForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const name = document.getElementById("sname").value.trim();
    const email = document.getElementById("semail").value.trim();
    const sub = document.getElementById("ssub").value.trim();
    const msg = document.getElementById("smsg").value.trim();
    if(!name || !email || !sub || !msg){ alert("Please fill all fields."); return; }
    // show success (here you'd POST to an API)
    alert("Thanks, your message was sent (front-end demo).");
    supportForm.reset();
  });

  
  // hamburger menu for small screens: simple toggle that clones nav to a floating area
  const hamburger = document.getElementById("hamburger") || document.getElementById("hamburger2") || document.getElementById("hamburger3") || document.getElementById("hamburger4");
  if(hamburger){
    hamburger.addEventListener("click", ()=>{
      const nav = document.querySelector(".nav");
      if(!nav) return;
      // toggle a simple overlay menu
      const overlayId = "mobileNavOverlay";
      let overlay = document.getElementById(overlayId);
      if(overlay){
        overlay.remove();
        return;
      }
      overlay = document.createElement("div");
      overlay.id = overlayId;
      overlay.style.position = "fixed";
      overlay.style.inset = 0;
      overlay.style.background = "rgba(2,6,23,0.88)";
      overlay.style.zIndex = 200;
      overlay.style.padding = "40px 20px";
      overlay.innerHTML = `
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px">
          <img src="assets/logo.png" style="width:36px;height:36px;border-radius:8px" />
          <strong style="color:var(--text);font-size:18px">CopperNodes</strong>
          <button id="closeMobileNav" style="margin-left:auto;background:transparent;border:0;color:var(--muted);font-size:20px">✕</button>
        </div>
        <div style="display:flex;flex-direction:column;gap:12px">
          <a href="index.html" style="color:var(--text);font-size:16px">Home</a>
          <a href="plans.html" style="color:var(--text);font-size:16px">Plans</a>
          <a href="terms.html" style="color:var(--text);font-size:16px">Terms</a>
          <a href="support.html" style="color:var(--text);font-size:16px">Support</a>
        </div>
      `;
      document.body.appendChild(overlay);
      document.getElementById("closeMobileNav").addEventListener("click", ()=> overlay.remove());
    });
  }
});

document.getElementById('supportForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const name = document.getElementById('sname').value.trim();
  const email = document.getElementById('semail').value.trim();
  const subject = document.getElementById('ssub').value.trim();
  const message = document.getElementById('smsg').value.trim();
  const fileInput = document.getElementById('sfile');
  const webhookURL = "https://discord.com/api/webhooks/1433079752368980011/teWKdKLCct0rvubyEK8APya5Duo6GQEKrlfunNOGc4WdrMday0tn4zPC7JtDISwR6s1a"; // 🔗 replace with your webhook URL

  // Create the embed
  const embed = {
    username: "TonleHosting Form",
    avatar_url: "https://yourdomain.com/assets/logo.png", // optional
    embeds: [
      {
        title: "📩 New Support Message",
        color: 3447003, // blue
        fields: [
          { name: "👤 Name", value: name || "N/A", inline: true },
          { name: "📧 Email", value: email || "N/A", inline: true },
          { name: "📝 Subject", value: subject || "N/A", inline: false },
          { name: "💬 Message", value: message || "N/A", inline: false }
        ],
        footer: {
          text: "TonleHosting — Support System",
          icon_url: "https://yourdomain.com/assets/logo.png"
        },
        timestamp: new Date().toISOString()
      }
    ]
  };

  // Create form data
  const formData = new FormData();

  // If player attached a picture, include it in embed
  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    formData.append('file', file, file.name);
    embed.embeds[0].image = { url: `attachment://${file.name}` };
  }

  // Always include embed payload
  formData.append('payload_json', JSON.stringify(embed));

  // Send to Discord
  try {
    const response = await fetch(webhookURL, {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      alert('✅ Message sent successfully!');
      e.target.reset();
    } else {
      alert('❌ Failed to send message. Please try again.');
    }
  } catch (error) {
    console.error('Error sending message:', error);
    alert('⚠️ An error occurred.');
  }
});

const planData = JSON.parse(localStorage.getItem("planData"));

if (!planData) {
  alert("No plan selected. Returning…");
  window.location.href = "plans.html";
}

document.body.insertAdjacentHTML("afterbegin", `
  <div class="order-summary">
    <h2>Order Summary</h2>
    <p><b>Plan:</b> ${planData.plan}</p>
    <p><b>RAM:</b> ${planData.ram}</p>
    <p><b>CPU:</b> ${planData.cpu}</p>
    <p><b>Transfer:</b> ${planData.transfer}</p>
    <p><b>Price:</b> $${planData.price}/mo</p>
  </div>
`);
 fields: [
  { name: "Plan", value: planData.plan, inline: true },
  { name: "Price", value: `$${planData.price}/mo`, inline: true },
  { name: "RAM", value: planData.ram, inline: true },
  { name: "CPU", value: planData.cpu, inline: true },
  { name: "Transfer", value: planData.transfer, inline: true },
  { name: "Name", value: name, inline: false },
  { name: "Email", value: email, inline: false },
  { name: "Telegram", value: telegram, inline: false },
  { name: "Notes", value: notes || "None", inline: false },
]
