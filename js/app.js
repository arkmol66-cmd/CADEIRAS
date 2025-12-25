// Util — hash simples (não é nível profissional, mas é melhor do que guardar a senha pura)
async function hash(texto) {
  const enc = new TextEncoder().encode(texto);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

// ---------- CONTAS ----------
async function criarConta(nome, email, senha, confirmar) {
  if (!nome || !email || !senha || !confirmar) {
    alert("Preencha todos os campos.");
    return false;
  }

  if (senha.length < 6) {
    alert("A senha precisa ter pelo menos 6 caracteres.");
    return false;
  }

  if (senha !== confirmar) {
    alert("As senhas não são iguais.");
    return false;
  }

  const contas = JSON.parse(localStorage.getItem("contas") || "[]");

  if (contas.find(c => c.email === email)) {
    alert("Já existe uma conta com esse e-mail.");
    return false;
  }

  const senhaHash = await hash(senha);

  contas.push({ nome, email, senha: senhaHash });
  localStorage.setItem("contas", JSON.stringify(contas));

  salvarUsuario(email, nome);
  return true;
}

async function login(email, senha) {
  if (!email || !senha) {
    alert("Digite e-mail e senha.");
    return false;
  }

  const contas = JSON.parse(localStorage.getItem("contas") || "[]");
  const senhaHash = await hash(senha);

  const conta = contas.find(c => c.email === email && c.senha === senhaHash);

  if (!conta) {
    alert("E-mail ou senha incorretos.");
    return false;
  }

  salvarUsuario(conta.email, conta.nome);
  return true;
}

// Recuperar senha — cria uma nova temporária
async function recuperarSenha(email) {
  const contas = JSON.parse(localStorage.getItem("contas") || "[]");
  const conta = contas.find(c => c.email === email);

  if (!conta) {
    alert("Nenhuma conta encontrada com esse e-mail.");
    return;
  }

  const nova = Math.random().toString(36).substring(2, 8); // senha simples
  conta.senha = await hash(nova);

  localStorage.setItem("contas", JSON.stringify(contas));

  alert("Sua nova senha é: " + nova + "\n(Anote — depois trocamos esse sistema!)");
}

// ---------- SESSÃO ----------
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

function exigirLogin() {
  if (!usuarioAtual()) window.location = "login.html";
}

// ---------- POSTS ----------
function salvarPost(texto) {
  if (!texto.trim()) return;

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

// ---------- CONVERSAS ----------
function salvarMensagem(email, texto) {
  if (!email || !texto.trim()) return;

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
