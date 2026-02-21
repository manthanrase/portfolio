(function () {
  const ENDPOINT = window.CHATBOT_ENDPOINT;
  if (!ENDPOINT) {
    console.warn("[chatbot] Missing window.CHATBOT_ENDPOINT");
    return;
  }

  // Basic markdown cleanup so you don't see ** everywhere
  function cleanText(t) {
    if (!t) return "";
    return String(t)
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/#+\s?/g, "")
      .trim();
  }

  const root = document.createElement("div");
  root.id = "mr-chatbot";
  root.innerHTML = `
    <div id="mr-chatbot">
  <div class="panel" aria-hidden="true">
    <div class="header">
      <div class="title">
        <b>Chat</b>
        <span>Ask about Manthan</span>
      </div>
      <button class="close" type="button" aria-label="Close">×</button>
    </div>

    <div class="messages" id="mr-messages"></div>

    <div class="footer">
      <input id="mr-input" type="text" placeholder="Type a message…" />
      <button class="send" id="mr-send" type="button">Send</button>
    </div>

    <div class="hint">Tip: click the bubble to open/close</div>
  </div>

  <button class="fab" aria-label="Open chat"><img src="AI-chat.svg" alt="" srcset="" ></button>
</div>
    
  `;
  // (() => {
  //   const root = document.getElementById("mr-chatbot");
  //   const fab = document.getElementById("mr-fab");
  //   const closeBtn = root?.querySelector(".close");
  //   const panel = root?.querySelector(".panel");

  //   if (!root || !fab || !panel) return;

  //   const STORAGE_KEY = "mr_chat_messages_v1";

  //   // --- Helpers
  //   const isOpen = () => root.classList.contains("open");

  //   const setOpen = (open) => {
  //     root.classList.toggle("open", open);
  //     panel.setAttribute("aria-hidden", open ? "false" : "true");
  //     fab.setAttribute("aria-expanded", open ? "true" : "false");
  //   };

  //   // Toggle on bubble click (open <-> close)
  //   fab.addEventListener("click", (e) => {
  //     e.preventDefault();
  //     setOpen(!isOpen());
  //   });

  //   // Close button should only close (not destroy)
  //   closeBtn?.addEventListener("click", (e) => {
  //     e.preventDefault();
  //     setOpen(false);
  //   });

  //   // Optional: close on Escape
  //   document.addEventListener("keydown", (e) => {
  //     if (e.key === "Escape" && isOpen()) setOpen(false);
  //   });

  //   // --- OPTIONAL: persist messages across refresh (remove if not needed)
  //   const messagesEl = document.getElementById("mr-messages");

  //   const saveMessages = () => {
  //     if (!messagesEl) return;
  //     const msgs = [...messagesEl.querySelectorAll(".msg")].map((node) => ({
  //       role: node.classList.contains("user") ? "user" : "bot",
  //       text: node.textContent || "",
  //     }));
  //     localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs));
  //   };

  //   const loadMessages = () => {
  //     if (!messagesEl) return;
  //     const raw = localStorage.getItem(STORAGE_KEY);
  //     if (!raw) return;
  //     try {
  //       const msgs = JSON.parse(raw);
  //       msgs.forEach((m) => appendMsg(m.role, m.text, false));
  //       scrollToBottom();
  //     } catch {}
  //   };

  //   const appendMsg = (role, text, shouldSave = true) => {
  //     if (!messagesEl) return;
  //     const div = document.createElement("div");
  //     div.className = `msg ${role}`;
  //     div.textContent = text;
  //     messagesEl.appendChild(div);
  //     scrollToBottom();
  //     if (shouldSave) saveMessages();
  //   };

  //   const scrollToBottom = () => {
  //     if (!messagesEl) return;
  //     messagesEl.scrollTop = messagesEl.scrollHeight;
  //   };

  //   // Load persisted chat
  //   loadMessages();

  //   // Example usage (remove if you already have chat send logic)
  //   // appendMsg("bot", "Hi! Ask me about Manthan’s work.", true);

  //   // Keep panel closed initially
  //   setOpen(false);

  //   // Expose helper if you want to append from your existing code:
  //   window.mrChatAppendMsg = appendMsg;
  // })();
  document.body.appendChild(root);

  const panel = root.querySelector(".panel");
  const fab = root.querySelector(".fab");
  const closeBtn = root.querySelector(".close");
  const messagesEl = root.querySelector(".messages");
  const input = root.querySelector("input");
  const sendBtn = root.querySelector("button.send");

  let conversationHistory = [];

  function addMessage(text, who) {
    const div = document.createElement("div");
    div.className = `msg ${who}`;
    div.textContent = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function setOpen(open) {
    root.classList.toggle("open", open);
    if (open) setTimeout(() => input.focus(), 50);
  }

  function isOpen() {
    return root.classList.contains("open");
  }

  function setOpen(open) {
    root.classList.toggle("open", open);
    panel.setAttribute("aria-hidden", open ? "false" : "true");
    if (open) setTimeout(() => input.focus(), 50);
  }

  // 🔁 Toggle when bubble clicked
  fab.addEventListener("click", () => {
    setOpen(!isOpen());
  });

  // ❌ Close button only closes
  closeBtn.addEventListener("click", () => {
    setOpen(false);
  });

  async function send() {
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    input.value = "";
    sendBtn.disabled = true;

    addMessage("Typing…", "bot");
    const typingEl = messagesEl.lastElementChild;

    try {
      const resp = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, conversationHistory }),
      });

      // LOG status + body text for debugging
      const raw = await resp.text();
      console.log("[chatbot] status:", resp.status);
      console.log("[chatbot] raw response:", raw);

      if (!resp.ok) {
        typingEl.textContent = `Server error (${resp.status}). Check console logs.`;
        return;
      }

      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        data = {};
      }

      const reply = cleanText(
        data?.response || data?.answer || data?.message || "",
      );
      conversationHistory.push({ role: "user", content: text });
      conversationHistory.push({ role: "assistant", content: reply });

      typingEl.textContent =
        reply || "I couldn’t find that in my portfolio data yet.";
    } catch (e) {
      console.error("[chatbot] fetch failed:", e);
      typingEl.textContent = "Network/CORS error. Check console.";
    } finally {
      sendBtn.disabled = false;
    }
  }

  sendBtn.addEventListener("click", send);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") send();
    if (e.key === "Escape") setOpen(false);
  });

  // Welcome message
  addMessage("Hey! I am Manthan. Ask me about my projects, or skills.", "bot");
})();
