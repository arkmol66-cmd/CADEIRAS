// Salvar usuário
function salvarUsuario(email, nome) {
  localStorage.setItem("usuario", JSON.stringify({ email, nome }));
}

function usuarioAtual() {
  return JSON.parse(localStorage.getItem("usuario"));
}

function sair() {
  localStorage.removeItem("usuario");
  window.location = "login.html";
}

// Bloquear páginas sem login
function exigirLogin() {
  if (!usuarioAtual()) window.location = "login.html";
}

// POSTS
function salvarPost(texto) {
  const posts = JSON.parse(localStorage.getItem("posts") || "[]");
  posts.unshift({
    texto,
    autor: usuarioAtual().nome,
    data: new Date().toLocaleString()
  });
  localStorage.setItem("posts", JSON.stringify(posts));
}

function listarPosts(el) {
  const posts = JSON.parse(localStorage.getItem("posts") || "[]");
  el.innerHTML = posts.map(p => `
    <div class="post">
      <b>${p.autor}</b><br>
      <small>${p.data}</small>
      <p>${p.texto}</p>
    </div>
  `).join("");
}

// CONVERSAS
function salvarMensagem(email, texto) {
  const convs = JSON.parse(localStorage.getItem("conversas") || "{}");
  if (!convs[email]) convs[email] = [];
  convs[email].push({
    autor: usuarioAtual().email,
    texto,
    data: new Date().toLocaleString()
  });
  localStorage.setItem("conversas", JSON.stringify(convs));
}

function listarMensagens(email, el) {
  const convs = JSON.parse(localStorage.getItem("conversas") || "{}");
  const msgs = convs[email] || [];
  el.innerHTML = msgs.map(m => `
    <div class="post">
      <b>${m.autor}</b><br>
      <small>${m.data}</small>
      <p>${m.texto}</p>
    </div>
  `).join("");
}
