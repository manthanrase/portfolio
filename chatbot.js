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
    <div class="panel" role="dialog" aria-label="Portfolio chat">
      <div class="header">
        <div class="title">
          <b>Ask about my work</b>
          <span>Projects, process, skills</span>
        </div>
        <button class="close" aria-label="Close">×</button>
      </div>
      <div class="messages"></div>
      <div class="hint">Try: “Tell me about UXLens-AI”</div>
      <div class="footer">
        <input type="text" placeholder="Type a question…" />
        <button class="send">Send</button>
      </div>
    </div>
    <button class="fab" aria-label="Open chat"><img src="AI-chat.svg" alt="" srcset="" ></button>
  `;

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

  fab.addEventListener("click", () => setOpen(true));
  closeBtn.addEventListener("click", () => setOpen(false));

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
