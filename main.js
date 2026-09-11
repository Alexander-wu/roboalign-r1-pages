/* ================================================================
 * RoboAlign-R1 project page — minimal vanilla JS
 * ================================================================ */

(function () {
  "use strict";

  // -------- Tabs --------
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabPanels = document.querySelectorAll(".tab-panel");

  function activateTab(id) {
    tabBtns.forEach(b => {
      const match = b.getAttribute("data-tab") === id;
      b.classList.toggle("active", match);
      b.setAttribute("aria-selected", match ? "true" : "false");
    });
    tabPanels.forEach(p => {
      p.classList.toggle("active", p.id === id);
    });
  }

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-tab");
      if (id) activateTab(id);
    });
  });

  // -------- SWR animated viewer: dataset + episode switching (MP4 video) --------
  const swrDatasetTabs = document.querySelectorAll(".swr-dataset-tab");
  const swrEpisodeTabs = document.getElementById("swrEpisodeTabs");
  const swrVideo = document.getElementById("swrVideo");
  const swrLoading = document.getElementById("swrLoading");

  if (swrEpisodeTabs && swrVideo) {
    // Dataset → episodes definition
    const SWR_DATASETS = {
      rt1: {
        label: "RT-1",
        episodes: [
          { name: "Episode 1", src: "static/videos/swr_compare_eps1.mp4", size: "486 KB" },
          { name: "Episode 2", src: "static/videos/swr_compare_eps2.mp4", size: "237 KB" },
          { name: "Episode 3", src: "static/videos/swr_compare_eps3.mp4", size: "174 KB" },
        ],
      },
      bridge: {
        label: "BridgeData V2",
        episodes: [
          { name: "Episode 1", src: "static/videos/swr_bridge_eps4.mp4",  size: "196 KB" },
          { name: "Episode 2", src: "static/videos/swr_bridge_eps17.mp4", size: "196 KB" },
          { name: "Episode 3", src: "static/videos/swr_bridge_eps44.mp4", size: "270 KB" },
        ],
      },
    };

    let currentDataset = "rt1";
    let currentSrc = swrVideo.querySelector("source")?.getAttribute("src") || "";

    function loadVideo(src, label) {
      if (!src || src === currentSrc) return;

      // show loading overlay + dim current video
      if (swrLoading) swrLoading.classList.add("show");
      swrVideo.classList.add("loading");
      swrVideo.setAttribute("aria-label", `SWR vs AR vs GT — ${label}`);

      // swap source and force reload
      const sourceEl = swrVideo.querySelector("source");
      if (sourceEl) sourceEl.setAttribute("src", src);
      swrVideo.setAttribute("src", src); // fallback

      const hideLoading = () => {
        swrVideo.classList.remove("loading");
        if (swrLoading) swrLoading.classList.remove("show");
        swrVideo.removeEventListener("canplay", hideLoading);
        swrVideo.removeEventListener("loadeddata", hideLoading);
      };
      swrVideo.addEventListener("canplay", hideLoading);
      swrVideo.addEventListener("loadeddata", hideLoading);

      swrVideo.load();
      const playPromise = swrVideo.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => { /* autoplay may be blocked; ignore */ });
      }

      currentSrc = src;

      // safety net: hide loader after 6s no matter what
      setTimeout(() => {
        swrVideo.classList.remove("loading");
        if (swrLoading) swrLoading.classList.remove("show");
      }, 6000);
    }

    function renderEpisodeTabs(datasetKey, selectIdx = 0) {
      const ds = SWR_DATASETS[datasetKey];
      if (!ds) return;
      swrEpisodeTabs.innerHTML = "";
      ds.episodes.forEach((ep, idx) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "swr-tab" + (idx === selectIdx ? " active" : "");
        btn.setAttribute("role", "tab");
        btn.setAttribute("data-src", ep.src);
        btn.setAttribute("aria-selected", idx === selectIdx ? "true" : "false");
        btn.innerHTML = `
          <i class="fa-solid fa-film"></i> ${ep.name}
          <span class="size-hint">${ep.size}</span>`;
        btn.addEventListener("click", () => {
          // toggle active among siblings
          swrEpisodeTabs.querySelectorAll(".swr-tab").forEach(t => {
            const isMe = t === btn;
            t.classList.toggle("active", isMe);
            t.setAttribute("aria-selected", isMe ? "true" : "false");
          });
          loadVideo(ep.src, `${ds.label} — ${ep.name}`);
        });
        swrEpisodeTabs.appendChild(btn);
      });
      // auto-load the selected episode
      const sel = ds.episodes[selectIdx];
      if (sel) loadVideo(sel.src, `${ds.label} — ${sel.name}`);
    }

    // initial population (RT-1 default, ep1 already hard-coded in <source>)
    renderEpisodeTabs(currentDataset, 0);

    // dataset tab handlers
    swrDatasetTabs.forEach(tab => {
      tab.addEventListener("click", () => {
        const key = tab.getAttribute("data-dataset");
        if (!key || key === currentDataset) return;
        currentDataset = key;
        swrDatasetTabs.forEach(t => {
          const isMe = t === tab;
          t.classList.toggle("active", isMe);
          t.setAttribute("aria-selected", isMe ? "true" : "false");
        });
        renderEpisodeTabs(currentDataset, 0);
      });
    });
  }

  // -------- Copy BibTeX --------
  const copyBtn = document.getElementById("copyBibBtn");
  const bibContent = document.getElementById("bibtex-content");
  if (copyBtn && bibContent) {
    copyBtn.addEventListener("click", async () => {
      const text = bibContent.innerText;
      try {
        await navigator.clipboard.writeText(text);
      } catch (err) {
        // fallback
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); } catch (e) { /* noop */ }
        document.body.removeChild(ta);
      }
      copyBtn.classList.add("copied");
      const label = copyBtn.querySelector("span");
      const oldText = label ? label.textContent : "";
      if (label) label.textContent = "Copied!";
      setTimeout(() => {
        copyBtn.classList.remove("copied");
        if (label) label.textContent = oldText || "Copy";
      }, 1600);
    });
  }

  // -------- Navbar shadow on scroll (subtle) --------
  const nav = document.querySelector(".navbar");
  if (nav) {
    const update = () => {
      if (window.scrollY > 8) {
        nav.style.boxShadow = "0 1px 10px rgba(14,22,38,0.08)";
      } else {
        nav.style.boxShadow = "none";
      }
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  // -------- Highlight nav link by section in view --------
  const navAnchors = document.querySelectorAll(".nav-links a");
  const sections = Array.from(navAnchors)
    .map(a => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navAnchors.forEach(a => {
            const match = a.getAttribute("href") === `#${id}`;
            a.style.color = match ? "var(--c-brand)" : "";
            a.style.background = match ? "var(--c-brand-soft)" : "";
          });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(s => obs.observe(s));
  }

  // ==================================================================
  // Judge Live Demo
  // ==================================================================
  const judgeRoot = document.getElementById("judge-demo");
  if (judgeRoot && window.JUDGE_CASES && window.JUDGE_DIMS) {
    const els = {
      caseTabs:   judgeRoot.querySelectorAll(".judge-case-tab"),
      instr:      document.getElementById("judgeInstruction"),
      initial:    document.getElementById("judgeInitial"),
      modelSw:    document.getElementById("judgeModelSwitch"),
      video:      document.getElementById("judgeVideo"),
      videoCap:   document.getElementById("judgeVideoCaption"),
      reasoning:  document.getElementById("judgeReasoning"),
      cursor:     document.getElementById("judgeCursor"),
      replay:     document.getElementById("judgeReplay"),
      skip:       document.getElementById("judgeSkip"),
      dimList:    document.getElementById("judgeDimList"),
      totalVal:   document.getElementById("judgeTotalVal"),
      totalStd:   document.getElementById("judgeTotalStd"),
    };

    let typingTimer = null;
    let activeCaseKey = "caseA";
    let activeModelKey = "digr";

    const getEntry = () => {
      const caseObj = window.JUDGE_CASES[activeCaseKey];
      return caseObj.entries.find(e => e.key === activeModelKey) || caseObj.entries[0];
    };

    // ---------- Score bars ----------
    function buildDimRows() {
      els.dimList.innerHTML = "";
      window.JUDGE_DIMS.forEach(dim => {
        const row = document.createElement("div");
        row.className = "judge-dim";
        row.dataset.dim = dim.key;
        row.innerHTML = `
          <div class="judge-dim-head">
            <i class="fa-solid ${dim.icon}"></i>
            <span class="judge-dim-name">${dim.label}</span>
            <span class="judge-dim-max">/ ${dim.max}</span>
          </div>
          <div class="judge-dim-bar">
            <div class="judge-dim-fill" style="width:0%"></div>
          </div>
          <div class="judge-dim-val">
            <span class="judge-dim-mean">—</span>
            <span class="judge-dim-std">—</span>
          </div>`;
        els.dimList.appendChild(row);
      });
    }

    function renderScores(animated) {
      const entry = getEntry();
      const duration = animated ? 900 : 0;
      window.JUDGE_DIMS.forEach(dim => {
        const row = els.dimList.querySelector(`[data-dim="${dim.key}"]`);
        if (!row) return;
        const sc = entry.scores[dim.key];
        const pct = Math.max(0, Math.min(100, (sc.mean / dim.max) * 100));
        const fill = row.querySelector(".judge-dim-fill");
        fill.style.transition = `width ${duration}ms cubic-bezier(.2,.8,.2,1)`;
        fill.style.background = entry.color;
        // Trigger reflow then set width
        void fill.offsetWidth;
        fill.style.width = pct.toFixed(1) + "%";
        row.querySelector(".judge-dim-mean").textContent = sc.mean.toFixed(1);
        row.querySelector(".judge-dim-std").textContent = "± " + sc.std.toFixed(2);
      });
      const t = entry.scores.total;
      els.totalVal.textContent = t.mean.toFixed(1);
      els.totalStd.textContent = "± " + t.std.toFixed(2);
      const totalBox = document.getElementById("judgeTotal");
      if (totalBox) totalBox.style.borderColor = entry.color;
    }

    // ---------- Typewriter ----------
    function stopTyping() {
      if (typingTimer) { clearInterval(typingTimer); typingTimer = null; }
      els.cursor && els.cursor.classList.remove("hidden");
    }
    function typewrite(text, speed = 14) {
      stopTyping();
      els.reasoning.textContent = "";
      els.cursor.classList.remove("hidden");
      let i = 0;
      typingTimer = setInterval(() => {
        // stream 1-3 chars per tick for a natural rhythm
        const step = 1 + (Math.random() < 0.3 ? 1 : 0) + (Math.random() < 0.1 ? 1 : 0);
        i = Math.min(text.length, i + step);
        els.reasoning.textContent = text.slice(0, i);
        // auto-scroll container
        els.reasoning.parentElement.scrollTop = els.reasoning.parentElement.scrollHeight;
        if (i >= text.length) {
          clearInterval(typingTimer);
          typingTimer = null;
          els.cursor.classList.add("hidden");
        }
      }, speed);
    }

    function loadEntry({ animateText = true, animateBars = true } = {}) {
      const caseObj = window.JUDGE_CASES[activeCaseKey];
      const entry = getEntry();

      els.instr.textContent = caseObj.instruction;
      els.initial.src = caseObj.initialImage;
      els.initial.alt = caseObj.title + " — initial frame";

      // video
      els.video.src = entry.video;
      els.video.setAttribute("aria-label", entry.name + " rollout");
      els.videoCap.textContent = entry.name;
      els.videoCap.style.color = entry.color;
      const playPromise = els.video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {});
      }

      // reasoning
      if (animateText) {
        typewrite(entry.reasoning, 14);
      } else {
        stopTyping();
        els.reasoning.textContent = entry.reasoning;
        els.cursor.classList.add("hidden");
      }

      // scores
      if (animateBars) {
        // reset widths to 0 first for a smooth animation
        els.dimList.querySelectorAll(".judge-dim-fill").forEach(f => {
          f.style.transition = "none";
          f.style.width = "0%";
        });
        setTimeout(() => renderScores(true), 80);
      } else {
        renderScores(false);
      }
    }

    // ---------- Model switch (wan vs. digr) ----------
    function buildModelSwitch() {
      const caseObj = window.JUDGE_CASES[activeCaseKey];
      els.modelSw.innerHTML = "";
      caseObj.entries.forEach(e => {
        const btn = document.createElement("button");
        btn.className = "judge-model-btn" + (e.key === activeModelKey ? " active" : "");
        btn.style.setProperty("--accent", e.color);
        btn.dataset.model = e.key;
        btn.innerHTML = `
          <span class="judge-model-dot"></span>
          <span class="judge-model-name">${e.name}</span>`;
        btn.addEventListener("click", () => {
          if (activeModelKey === e.key) return;
          activeModelKey = e.key;
          els.modelSw.querySelectorAll(".judge-model-btn").forEach(b => {
            b.classList.toggle("active", b.dataset.model === activeModelKey);
          });
          loadEntry();
        });
        els.modelSw.appendChild(btn);
      });
    }

    // ---------- Case switch (A vs. B) ----------
    els.caseTabs.forEach(tab => {
      tab.addEventListener("click", () => {
        const caseKey = tab.getAttribute("data-case");
        if (!caseKey || caseKey === activeCaseKey) return;
        activeCaseKey = caseKey;
        activeModelKey = "digr"; // reset to ours on each case switch
        els.caseTabs.forEach(t => t.classList.toggle("active", t === tab));
        buildModelSwitch();
        loadEntry();
      });
    });

    // ---------- Replay / Skip ----------
    if (els.replay) {
      els.replay.addEventListener("click", () => loadEntry({ animateText: true, animateBars: true }));
    }
    if (els.skip) {
      els.skip.addEventListener("click", () => {
        stopTyping();
        const entry = getEntry();
        els.reasoning.textContent = entry.reasoning;
        els.cursor.classList.add("hidden");
        renderScores(false);
      });
    }

    // ---------- Lazy init via IntersectionObserver ----------
    buildDimRows();
    buildModelSwitch();
    // initial quick (no-typing) render so the section is never blank
    loadEntry({ animateText: false, animateBars: false });

    if ("IntersectionObserver" in window) {
      let played = false;
      const io = new IntersectionObserver(entries => {
        entries.forEach(en => {
          if (en.isIntersecting && !played) {
            played = true;
            loadEntry({ animateText: true, animateBars: true });
            io.disconnect();
          }
        });
      }, { threshold: 0.25 });
      io.observe(judgeRoot);
    }
  }

})();
