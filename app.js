let users = JSON.parse(localStorage.getItem("cadeira_users") || "[]");
let posts = JSON.parse(localStorage.getItem("cadeira_posts") || "[]");
let current = JSON.parse(localStorage.getItem("cadeira_user") || "null");

function save() {
  localStorage.setItem("cadeira_users", JSON.stringify(users));
  localStorage.setItem("cadeira_posts", JSON.stringify(posts));
  localStorage.setItem("cadeira_user", JSON.stringify(current));
}

function toggleForms() {
  document.getElementById("registerBox").classList.toggle("hidden");
}

function register() {
  const name = regName.value.trim();
  const email = regEmail.value.trim();
  const pass = regPass.value;

  if (!name || !email || !pass) return alert("Preencha tudo.");

  if (users.find(u => u.email === email))
    return alert("Esse email já existe.");

  users.push({ name, email, pass });
  save();
  alert("Conta criada. Faça login.");
  toggleForms();
}

function login() {
  const email = loginEmail.value.trim();
  const pass = loginPass.value;

  const user = users.find(u => u.email === email && u.pass === pass);
  if (!user) return alert("Credenciais inválidas.");

  current = user;
  save();
  showApp();
}

function logout() {
  current = null;
  save();
  location.reload();
}

function showApp() {
  auth.classList.add("hidden");
  app.classList.remove("hidden");
  welcome.textContent = "Olá, " + current.name;
  renderFeed();
}

async function post() {
  const text = postText.value.trim();
  const file = photo.files[0];

  if (!text && !file) return alert("Escreva algo ou envie uma foto.");

  let imgBase64 = null;

  if (file) {
    imgBase64 = await fileToBase64(file);
  }

  posts.unshift({
    author: current.name,
    text,
    img: imgBase64,
    date: new Date().toLocaleString("pt-BR")
  });

  postText.value = "";
  photo.value = "";
  save();
  renderFeed();
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function renderFeed() {
  feed.innerHTML = posts
    .map(
      p => `
      <div class="post">
        <strong>${p.author}</strong><br/>
        <p>${p.text || ""}</p>
        ${p.img ? `<img src="${p.img}" />` : ""}
        <small>${p.date}</small>
      </div>`
    )
    .join("");
}

if (current) showApp();
