document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );

  document
    .querySelectorAll(".scroll-reveal")
    .forEach((el) => observer.observe(el));
});

const track = document.querySelector(".carousel-track");
const slides = document.querySelectorAll(".carousel-slide");
const prevButton = document.querySelector(".carousel-button.prev");
const nextButton = document.querySelector(".carousel-button.next");

let index = 0;

function updateSlidePosition() {
  track.style.transform = `translateX(-${index * 100}%)`;
  updateButtonVisibility();
}

function nextSlide() {
  if (index < slides.length - 4) {
    index++;
    updateSlidePosition();
  }
}

function prevSlide() {
  if (index > 0) {
    index--;
    updateSlidePosition();
  }
}

function updateButtonVisibility() {
  prevButton.style.display = index === 0 ? "none" : "block";
  nextButton.style.display = index === slides.length - 4 ? "none" : "block";
}

prevButton.addEventListener("click", prevSlide);
nextButton.addEventListener("click", nextSlide);

// Initial state
updateSlidePosition();

// persona scrolling

const personaTrack = document.querySelector(
  "#persona-carousel .carousel-track",
);
const personaSlides = document.querySelectorAll(
  "#persona-carousel .carousel-slide",
);
const personaPrev = document.querySelector(
  "#persona-carousel .carousel-button.prev",
);
const personaNext = document.querySelector(
  "#persona-carousel .carousel-button.next",
);

let personaIndex = 0;

function updatePersonaPosition() {
  personaTrack.style.transform = `translateX(-${personaIndex * 100}%)`;
  personaPrev.style.display = personaIndex === 0 ? "none" : "block";
  personaNext.style.display =
    personaIndex === personaSlides.length - 1 ? "none" : "block";
}

personaPrev.addEventListener("click", () => {
  if (personaIndex > 0) {
    personaIndex--;
    updatePersonaPosition();
  }
});

personaNext.addEventListener("click", () => {
  if (personaIndex < personaSlides.length - 1) {
    personaIndex++;
    updatePersonaPosition();
  }
});

// Initialize on load
updatePersonaPosition();

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// skill section

function animateSkillsOnScroll() {
  const skillsSection = document.getElementById("skills");
  const skillsTop = skillsSection.getBoundingClientRect().top;
  const screenHeight = window.innerHeight;

  if (skillsTop < screenHeight * 0.8) {
    document.querySelectorAll(".skill-bar").forEach((bar) => {
      bar.style.width = bar.getAttribute("data-percent") + "%";
    });

    // Only trigger once
    window.removeEventListener("scroll", animateSkillsOnScroll);
  }
}

window.addEventListener("scroll", animateSkillsOnScroll);

// scroll on aimation
document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("heroVideo");
  const muteBtn = document.getElementById("muteBtn");

  // Video starts muted automatically (HTML 'muted' ensures autoplay)
  video.muted = true;

  // Try to autoplay muted
  video.play().catch(() => {
    console.warn("Autoplay might be blocked — waiting for user interaction.");
  });

  // Toggle mute/unmute on button click
  muteBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    // Toggle sound
    video.muted = !video.muted;

    // Update button text/icon
    muteBtn.textContent = video.muted ? "🔇 Unmute" : "🔊 Mute";

    // If user unmutes, make sure playback continues
    if (!video.muted) {
      video.play().catch(() => {});
    }
  });

  // Optional: click the video to pause/resume
  video.addEventListener("click", () => {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  });
});

const audio = document.getElementById("bgAudio");
const btn = document.getElementById("music-3d-btn");

function setVisualState(isPlaying) {
  if (isPlaying) {
    btn.classList.add("is-playing"); // Triggers float animation & particles
  } else {
    btn.classList.remove("is-playing"); // Stops everything
  }
}

// Auto-play attempt
window.addEventListener("load", () => {
  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        setVisualState(true);
      })
      .catch(() => {
        console.log("Auto-play blocked. Click to play.");
        setVisualState(false);
      });
  }
});

// Click Handler
btn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    setVisualState(true);
  } else {
    audio.pause();
    setVisualState(false);
  }
});

// music button ------

const audio = document.getElementById("bgAudio");
const btn = document.getElementById("music-3d-btn");

function setVisualState(isPlaying) {
  if (isPlaying) {
    btn.classList.add("is-playing");
  } else {
    btn.classList.remove("is-playing");
  }
}

// 1. Attempt Auto-Play on Load (Will likely fail, but worth a try)
window.addEventListener("load", () => {
  audio.volume = 1.0;
  audio
    .play()
    .then(() => {
      setVisualState(true);
    })
    .catch(() => {
      console.log("Auto-play blocked. Waiting for user interaction.");
    });
});

// 2. THE TRICK: Start music on the FIRST click anywhere on the website
document.body.addEventListener(
  "click",
  function startMusic() {
    if (audio.paused) {
      audio
        .play()
        .then(() => {
          setVisualState(true);
          // Remove this listener so it doesn't interfere later
          document.body.removeEventListener("click", startMusic);
        })
        .catch((e) => console.log(e));
    }
  },
  { once: true },
); // This ensures it only runs once

// 3. The Button Click (Manual Toggle)
// We use 'e.stopPropagation()' to prevent the document click from firing instantly
btn.addEventListener("click", (e) => {
  e.stopPropagation();
  if (audio.paused) {
    audio.play();
    setVisualState(true);
  } else {
    audio.pause();
    setVisualState(false);
  }
});

// chatbot js -------

(() => {
  // ✅ CHANGE THIS to your deployed endpoint
  const CHAT_ENDPOINT = "https://your-vercel-app.vercel.app/api/chat";

  const fab = document.getElementById("ai-fab");
  const panel = document.getElementById("ai-panel");
  const closeBtn = document.getElementById("ai-close");

  const messagesEl = document.getElementById("ai-messages");
  const input = document.getElementById("ai-input");
  const sendBtn = document.getElementById("ai-send");

  const history = []; // store { role: "user"|"assistant", content: "..." }

  function addMsg(text, who) {
    const div = document.createElement("div");
    div.className = `ai-msg ${who === "user" ? "ai-user" : "ai-bot"}`;
    div.textContent = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function open() {
    panel.classList.remove("hidden");
    if (messagesEl.children.length === 0) {
      addMsg(
        "Hey! Ask me anything about my projects, process, or tools.",
        "bot",
      );
    }
    setTimeout(() => input.focus(), 0);
  }

  function close() {
    panel.classList.add("hidden");
  }

  async function send() {
    const text = (input.value || "").trim();
    if (!text) return;

    input.value = "";
    addMsg(text, "user");
    history.push({ role: "user", content: text });

    // typing placeholder
    const typingId = `typing-${Date.now()}`;
    const typingEl = document.createElement("div");
    typingEl.className = "ai-msg ai-bot";
    typingEl.id = typingId;
    typingEl.textContent = "Typing…";
    messagesEl.appendChild(typingEl);
    messagesEl.scrollTop = messagesEl.scrollHeight;

    try {
      const resp = await fetch(CHAT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          conversationHistory: history,
        }),
      });

      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

      const data = await resp.json();
      const answer = data?.response || data?.text || "I didn’t get a response.";

      document.getElementById(typingId)?.remove();
      addMsg(answer, "bot");
      history.push({ role: "assistant", content: answer });
    } catch (e) {
      document.getElementById(typingId)?.remove();
      addMsg(
        "Something went wrong talking to the AI backend. Please try again.",
        "bot",
      );
      console.error(e);
    }
  }

  fab.addEventListener("click", open);
  closeBtn.addEventListener("click", close);

  sendBtn.addEventListener("click", send);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") send();
    if (e.key === "Escape") close();
  });
})();
