// Tech Foundations site: a tiny reader for the session READMEs in this repo.
//
// Routes (in the URL hash):
//   #/                      all sessions, by week
//   #/start                 getting started
//   #/<folder>              a session's README
//   #/<folder>/<file>.md    any other Markdown file in the repo

(function () {
  const { repo, branch, weeks, resources } = window.TF;
  const app = document.getElementById("app");
  const GH = `https://github.com/${repo}`;
  const ZIP = `${GH}/archive/refs/heads/${branch}.zip`;
  const sessions = weeks.flatMap((w) => w.sessions.map((s) => ({ ...s, week: w.week, weekTitle: w.title })));
  document.getElementById("repo-link").href = GH;

  // ---------- helpers ----------
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const encPath = (p) => p.split("/").map(encodeURIComponent).join("/");
  const route = (p) => "#/" + encPath(p);
  const ghBlob = (p) => `${GH}/blob/${branch}/${encPath(p)}`;
  const ghTree = (p) => `${GH}/tree/${branch}/${encPath(p.replace(/\/$/, ""))}`;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* private mode: progress just isn't saved */ } },
  };
  const sessionFor = (p) => sessions.find((s) => p === s.folder || p.startsWith(s.folder + "/"));
  const docPath = (p) => (/\.md$/i.test(p) ? p : p.replace(/\/$/, "") + "/README.md");
  const resolve = (base, href) => decodeURIComponent(new URL(href, "https://x/" + encPath(base)).pathname.slice(1));

  function progress(path) {
    const total = Number(store.get(`tf:total:${path}`) || 0);
    if (!total) return null;
    let done = 0;
    for (let i = 0; i < total; i++) if (store.get(`tf:check:${path}:${i}`) === "1") done++;
    return { done, total };
  }

  // ---------- views ----------
  function home() {
    document.title = "Tech Foundations";
    const weekHtml = weeks
      .map((w) => {
        const cards = w.sessions
          .map((s) => {
            const p = progress(docPath(s.folder));
            const badge = p ? `<span class="progress ${p.done === p.total ? "complete" : ""}">${p.done}/${p.total} artifact</span>` : "";
            return `<a class="card" href="${route(s.folder)}">
              <span class="code">${esc(s.code)}</span>
              <span class="card-title">${esc(s.title)}</span>
              <span class="card-summary">${esc(s.summary)}</span>
              <span class="card-meta"><span>${s.minutes} min</span>${badge}</span>
            </a>`;
          })
          .join("");
        const note = w.note ? `<p class="week-note">${esc(w.note)}</p>` : "";
        const milestone = w.milestone
          ? `<div class="milestone"><strong>End of week ${w.week}: ${esc(w.milestone.title)}</strong><span>${esc(w.milestone.detail)}</span></div>`
          : "";
        return `<section class="week" id="week-${w.week}">
          <div class="week-head"><span class="week-num">Week ${w.week}</span><h2>${esc(w.title)}</h2></div>
          ${cards ? `<div class="cards">${cards}</div>` : ""}${note}${milestone}
        </section>`;
      })
      .join("");
    const res = resources
      .map((r) => `<a class="card small" href="${route(r.path)}"><span class="card-title">${esc(r.title)}</span><span class="card-summary">${esc(r.summary)}</span></a>`)
      .join("");

    app.innerHTML = `
      <section class="hero">
        <h1>Every session, every artifact, in one place.</h1>
        <p>Pick your session below. Each one has the guide you'll follow in class, the starter files, and a checklist of what to finish before you leave.</p>
        <div class="hero-actions">
          <a class="btn primary" href="#/start">New here? Start here</a>
          <a class="btn" href="${ZIP}">Download all files (.zip)</a>
        </div>
      </section>
      ${weekHtml}
      <section class="week"><div class="week-head"><span class="week-num">Extra</span><h2>Resources</h2></div><div class="cards">${res}</div></section>`;
  }

  function start() {
    document.title = "Getting started · Tech Foundations";
    app.innerHTML = `
      <article class="doc prose narrow">
        <h1>Getting started</h1>
        <p>Every session works the same way. Learn it once and you're set for the rest of the program.</p>

        <h2>1. Get the files (once)</h2>
        <p>Clone the repo with Git. That's the way we practice all program:</p>
        <pre><code class="language-bash">git clone ${GH}.git
cd tech-foundations</code></pre>
        <p>No Git yet? <a href="${ZIP}">Download the ZIP</a> and unzip it. Before each session, run <code>git pull</code> to get the newest files.</p>

        <h2>2. Install the tools (once)</h2>
        <ul>
          <li><strong>Node.js 18 or newer</strong>: <a href="https://nodejs.org" target="_blank" rel="noopener">nodejs.org</a> (pick LTS). Check with <code>node -v</code>.</li>
          <li><strong>VS Code</strong>: <a href="https://code.visualstudio.com" target="_blank" rel="noopener">code.visualstudio.com</a></li>
          <li><strong>Git</strong>: check with <code>git --version</code>.</li>
        </ul>
        <p>No session needs <code>npm install</code>. Some sessions need one extra tool (like Postman or Docker), and the guide tells you in its Setup section.</p>

        <h2>3. Open just the session folder</h2>
        <p>In VS Code: <strong>File → Open Folder</strong> and choose the session's folder (for example <code>t9a-apis-101</code>), not the whole repo. The commands in each guide expect to run from there.</p>

        <h2>4. Follow the guide</h2>
        <ol>
          <li><strong>Setup</strong>: a couple of minutes, before the trainer starts.</li>
          <li><strong>Guided Practice</strong>: the main work, usually in pairs or teams.</li>
          <li><strong>Application</strong>: try it on your own, then swap with someone.</li>
          <li><strong>Before you leave</strong>: run <code>npm run check</code>. It lists what's done and what's left.</li>
        </ol>
        <p>On this site, the checkboxes under <strong>Your artifact</strong> are clickable. Your progress is saved in this browser.</p>

        <h2>5. How it's assessed</h2>
        <p>Every guide ends with a rubric. <strong>Proficient</strong> is the goal. If you land at Limited or Emerging, you'll join a 30-minute clinic. That's practice, not punishment.</p>

        <h2>House rules</h2>
        <ul>
          <li>Never commit secrets: <code>.env</code> files, API keys, passwords.</li>
          <li>No real personal data in practice files. Make it up.</li>
          <li>Stuck for 10 minutes? Ask. Say what you expected, what happened, and what you tried.</li>
        </ul>
        <p><a class="btn primary" href="#/">See all sessions →</a></p>
      </article>`;
  }

  async function doc(path) {
    const file = docPath(path);
    const session = sessionFor(file);
    const dir = file.split("/").slice(0, -1).join("/");
    app.innerHTML = `<p class="loading">Loading…</p>`;

    let md;
    try {
      const res = await fetch(encPath(file), { cache: "no-cache" });
      if (!res.ok) throw new Error(res.status);
      md = await res.text();
    } catch {
      app.innerHTML = `<article class="doc prose narrow"><h1>Couldn't load this page</h1>
        <p><code>${esc(file)}</code> wasn't found. <a href="${ghBlob(file)}" target="_blank" rel="noopener">Try it on GitHub</a> or go <a href="#/">back to all sessions</a>.</p></article>`;
      return;
    }

    const html = DOMPurify.sanitize(marked.parse(md, { gfm: true }), { ADD_ATTR: ["target"] });
    const isReadme = session && file === docPath(session.folder);
    const crumbs = session
      ? `<a href="#/">Sessions</a><span>›</span><a href="#/#week-${session.week}" data-week="${session.week}">Week ${session.week}</a><span>›</span>${
          isReadme ? esc(session.code) : `<a href="${route(session.folder)}">${esc(session.code)}</a><span>›</span>${esc(file.slice(session.folder.length + 1))}`
        }`
      : `<a href="#/">Sessions</a><span>›</span>${esc(file)}`;
    const actions = session
      ? `<a class="btn" href="${ghTree(session.folder)}" target="_blank" rel="noopener">Open folder on GitHub ↗</a>
         <a class="btn" href="${ZIP}">Download all files (.zip)</a>`
      : `<a class="btn" href="${ghBlob(file)}" target="_blank" rel="noopener">View on GitHub ↗</a>`;
    const meta = session && isReadme ? `<span class="pill">${session.minutes} min</span><span class="pill">Folder: <code>${esc(session.folder)}</code></span>` : "";

    let pager = "";
    if (session && isReadme) {
      const i = sessions.indexOf(session);
      const prev = sessions[i - 1];
      const next = sessions[i + 1];
      pager = `<nav class="pager">${prev ? `<a href="${route(prev.folder)}"><small>Previous</small>${esc(prev.code)}: ${esc(prev.title)}</a>` : "<span></span>"}${
        next ? `<a class="next" href="${route(next.folder)}"><small>Next</small>${esc(next.code)}: ${esc(next.title)}</a>` : ""
      }</nav>`;
    }

    app.innerHTML = `
      <div class="doc-layout">
        <div class="doc-main">
          <div class="doc-head"><nav class="crumbs">${crumbs}</nav><div class="doc-actions">${meta}${actions}</div></div>
          <article class="doc prose">${html}</article>
          ${pager}
        </div>
        <aside class="toc" aria-label="On this page"></aside>
      </div>`;

    const article = app.querySelector("article.doc");
    document.title = `${(article.querySelector("h1") || {}).textContent || file} · Tech Foundations`;
    enhance(article, file, dir, session);
    app.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }

  // ---------- after a Markdown page renders ----------
  function enhance(article, file, dir, session) {
    // Links: .md files open here, other repo files open on GitHub, outside links in a new tab.
    article.querySelectorAll("a[href]").forEach((a) => {
      const href = a.getAttribute("href");
      if (/^(https?:|mailto:)/i.test(href)) {
        a.target = "_blank";
        a.rel = "noopener";
      } else if (href.startsWith("#")) {
        a.addEventListener("click", (e) => {
          e.preventDefault();
          const el = document.getElementById(href.slice(1));
          if (el) el.scrollIntoView({ behavior: "smooth" });
        });
      } else {
        const target = resolve(file, href);
        if (/\.md$/i.test(target)) {
          const s = sessionFor(target);
          a.href = route(s && target === docPath(s.folder) ? s.folder : target);
        } else {
          a.href = target.endsWith("/") ? ghTree(target) : ghBlob(target);
          a.target = "_blank";
          a.rel = "noopener";
        }
      }
    });

    // In "What's in here" tables, file paths in the first column become links.
    article.querySelectorAll("table").forEach((table) => {
      const first = table.querySelector("thead th");
      if (!first || !/^path$/i.test(first.textContent.trim())) return;
      table.querySelectorAll("tbody tr td:first-child code").forEach(async (code) => {
        const rel = code.textContent.trim();
        if (/\s/.test(rel)) return;
        const target = resolve(dir + "/", rel);
        const link = document.createElement("a");
        if (rel.endsWith("/")) {
          link.href = ghTree(target);
        } else {
          try {
            const r = await fetch(encPath(target), { method: "HEAD" });
            if (!r.ok) return;
          } catch {
            return;
          }
          link.href = /\.md$/i.test(target) ? route(target) : ghBlob(target);
        }
        if (!link.href.includes("#/")) {
          link.target = "_blank";
          link.rel = "noopener";
        }
        code.replaceWith(link);
        link.appendChild(code);
      });
    });

    // Headings get ids, and h2s build the "On this page" list.
    const toc = document.querySelector(".toc");
    const used = {};
    const items = [];
    article.querySelectorAll("h1, h2, h3").forEach((h) => {
      let id = h.textContent.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section";
      used[id] = (used[id] || 0) + 1;
      if (used[id] > 1) id += "-" + used[id];
      h.id = id;
      if (h.tagName === "H2") items.push(`<a href="#" data-id="${id}">${esc(h.textContent)}</a>`);
    });
    if (items.length > 2) {
      toc.innerHTML = `<p>On this page</p>${items.join("")}`;
      toc.querySelectorAll("a").forEach((a) =>
        a.addEventListener("click", (e) => {
          e.preventDefault();
          document.getElementById(a.dataset.id).scrollIntoView({ behavior: "smooth" });
        })
      );
    }

    // Code blocks: syntax highlighting + a copy button. Mermaid blocks become diagrams.
    const diagrams = [];
    article.querySelectorAll("pre > code").forEach((code) => {
      const lang = ((code.className.match(/language-(\S+)/) || [])[1] || "").toLowerCase();
      const pre = code.parentElement;
      if (lang === "mermaid") {
        const div = document.createElement("div");
        div.className = "mermaid";
        div.textContent = code.textContent;
        pre.replaceWith(div);
        diagrams.push(div);
        return;
      }
      if (lang && window.hljs && hljs.getLanguage(lang)) hljs.highlightElement(code);
      const btn = document.createElement("button");
      btn.className = "copy";
      btn.type = "button";
      btn.textContent = "Copy";
      btn.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(code.textContent);
          btn.textContent = "Copied!";
        } catch {
          btn.textContent = "Select + copy";
        }
        setTimeout(() => (btn.textContent = "Copy"), 1500);
      });
      pre.appendChild(btn);
    });
    if (diagrams.length) {
      import("https://cdn.jsdelivr.net/npm/mermaid@10.9.1/dist/mermaid.esm.min.mjs")
        .then(({ default: mermaid }) => {
          const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
          mermaid.initialize({ startOnLoad: false, theme: dark ? "dark" : "default" });
          return mermaid.run({ nodes: diagrams });
        })
        .catch(() => diagrams.forEach((d) => d.classList.add("mermaid-failed")));
    }

    // Task-list checkboxes are clickable and remembered in this browser.
    const boxes = [...article.querySelectorAll('li input[type="checkbox"]')];
    store.set(`tf:total:${file}`, String(boxes.length));
    boxes.forEach((box, i) => {
      const key = `tf:check:${file}:${i}`;
      box.disabled = false;
      box.checked = box.checked || store.get(key) === "1";
      box.closest("li").classList.add("task");
      box.addEventListener("change", () => store.set(key, box.checked ? "1" : "0"));
    });
  }

  // ---------- router ----------
  function render() {
    const raw = location.hash.replace(/^#\/?/, "");
    const path = raw.split("/").map((s) => decodeURIComponent(s)).join("/").replace(/\/$/, "");
    if (!path) home();
    else if (path === "start") start();
    else if (path.startsWith("#week-")) {
      home();
      document.getElementById(path.slice(1))?.scrollIntoView();
    } else doc(path);
  }

  window.addEventListener("hashchange", render);
  render();
})();
