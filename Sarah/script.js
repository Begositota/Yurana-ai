/* ================================================
   YURANANA AI — Chat Interface Scripts
   ================================================ */

document.addEventListener("DOMContentLoaded", () => {
  // ================================================
  // State Management
  // ================================================
  const STORAGE_KEY = "yurnana_conversations";
  let conversations = [];
  let activeConvoId = null;

  // ================================================
  // DOM References
  // ================================================
  const sidebar = document.getElementById("sidebar");
  const sidebarOverlay = document.getElementById("sidebarOverlay");
  const openSidebarBtn = document.getElementById("openSidebar");
  const closeSidebarBtn = document.getElementById("closeSidebar");
  const newChatBtn = document.getElementById("newChatBtn");
  const conversationList = document.getElementById("conversationList");
  const messagesContainer = document.getElementById("messagesContainer");
  const messagesArea = document.getElementById("messagesArea");
  const emptyState = document.getElementById("emptyState");
  const memoryBar = document.getElementById("memoryBar");
  const chatForm = document.getElementById("chatForm");
  const chatInput = document.getElementById("chatInput");
  const sendBtn = document.getElementById("sendBtn");

  // ================================================
  // AI Response Engine
  // ================================================
  const aiResponses = {
    anxious: {
      keywords: [
        "anxious",
        "anxiety",
        "worried",
        "worry",
        "scared",
        "fear",
        "panic",
        "nervous",
        "overwhelmed",
        "stressed",
        "stress",
      ],
      responses: [
        "I hear you, and I want you to know that feeling anxious is completely valid. Your body and mind have been through a lot. Let's try something together — can you take three slow breaths with me? Inhale for 4 counts, hold for 4, exhale for 6. 🌊\n\nYou don't have to face this moment alone. What specifically feels most overwhelming right now?",
        "Anxiety can feel like a storm that won't pass, but I want you to know — every storm runs out of rain. You've survived 100% of your hardest days so far. 💜\n\nWould it help to try a grounding exercise? Name 5 things you can see right now. Sometimes anchoring to the present can soften the grip of worry.",
        "That sounds really difficult, and I appreciate you sharing it with me. Anxiety often tries to convince us that the worst case is the only case — but your track record of surviving hard moments tells a different story.\n\nWhat's one small thing you could do for yourself right now? Even something as simple as drinking a glass of water counts. 🌿",
      ],
    },
    medication: {
      keywords: [
        "medication",
        "medicine",
        "pill",
        "missed",
        "forgot",
        "dose",
        "prescription",
        "taking",
        "adherence",
        "compliance",
      ],
      responses: [
        "Missing a dose happens to everyone — you're not failing. The fact that you're telling me shows how much you care about your health. 💊\n\nHere's what matters: check your medication guide or reach out to your care team about what to do next. Sometimes it's okay to take it late, sometimes it's not — they'll know best.\n\nWould you like me to help you set up a gentler reminder system?",
        "It takes courage to be honest about this. Missing medication doesn't make you a bad patient — it makes you human. The goal isn't perfection, it's progress.\n\nLet's think about what happened — was it a timing issue, a side effect concern, or just a hard day? Understanding the 'why' can help us build a better plan together. 🌱",
        "Thank you for sharing that with me. Many people with chronic conditions struggle with consistency — you're far from alone.\n\nWhat if we reframed this? Instead of focusing on the missed dose, let's celebrate that you're thinking about it and want to do better. That's the most important step. Would you like to explore what might help you stay more on track? 🎯",
      ],
    },
    consistent: {
      keywords: [
        "consistent",
        "consistency",
        "routine",
        "habit",
        "track",
        "streak",
        "progress",
        "stay on track",
        "motivation",
        "motivated",
      ],
      responses: [
        "Consistency isn't about being perfect every single day — it's about showing up for yourself more days than not. And you're here right now, which counts. 🌟\n\nLet's start small. What's one thing you'd like to be more consistent with? We'll build from there — no pressure, just gentle progress.",
        "Building consistency with a chronic condition is uniquely challenging because your body doesn't always cooperate with your plans. That's not your fault.\n\nHere's what I've seen work: anchor new habits to things you already do. For example, if you always have morning tea, that's a perfect moment for a medication check-in. What routines already feel natural to you? 💪",
        "I can see you really want to build better patterns, and that desire is powerful. Let's channel it wisely.\n\nResearch shows that the people who succeed long-term aren't the ones who never miss — they're the ones who always come back. You're already doing that. What does 'consistent' look like for you in an ideal week? 🎯",
      ],
    },
    progress: {
      keywords: [
        "progress",
        "track",
        "emotional",
        "mood",
        "feeling",
        "better",
        "worse",
        "improvement",
        "data",
        "insights",
      ],
      responses: [
        "Let's take a moment to look at how far you've come. Progress with chronic illness isn't always linear — it's more like a gentle upward wave. 📊\n\nFrom what I can see:\n• Your emotional resilience has been trending upward this week\n• You've logged your mood 5 out of 7 days — that's consistency!\n• Your average mood score is up 12% from last month\n\nWhat areas feel most meaningful to track?",
        "Tracking your emotional progress is such a powerful act of self-awareness. It helps you see patterns you might miss in the day-to-day.\n\nHere's a gentle reflection: What does progress mean to you? Is it fewer bad days, more good moments, or something else entirely? There's no wrong answer — only what feels true for you. 🌿",
        "I love that you want to understand your patterns better. That kind of self-awareness is a superpower.\n\nBased on your recent journey, I notice you tend to feel more at ease on days when you've had a morning routine. And your toughest days often follow disrupted sleep. These connections are gold — they give us clues about what supports you. ✨",
      ],
    },
    sad: {
      keywords: [
        "sad",
        "depressed",
        "down",
        "hopeless",
        "lonely",
        "alone",
        "crying",
        "cry",
        "hurt",
        "pain",
        "suffering",
        "grief",
        "loss",
      ],
      responses: [
        "I'm so sorry you're going through this. Sadness with chronic illness can feel especially heavy because you're grieving the life you had while fighting for the one ahead. That takes immense strength. 💜\n\nYou don't have to carry this alone. I'm here, and I'm listening. Would you like to talk about what's weighing on you most?",
        "Feeling sad in the middle of a chronic illness journey is not weakness — it's an honest response to a genuinely difficult experience. Your feelings deserve space.\n\nSometimes it helps to name it. If you could describe your sadness as a color or a weather pattern, what would it be? There's no rush. 🌧️",
        "I wish I could reach through and give you a warm hug right now. What you're feeling is real and valid.\n\nOn your hardest days, remember: you've survived every single one so far. That's not nothing — that's extraordinary. What's one tiny thing that's brought you comfort before, even for a moment? 🕯️",
      ],
    },
    sleep: {
      keywords: [
        "sleep",
        "insomnia",
        "tired",
        "fatigue",
        "exhausted",
        "rest",
        "nap",
        "awake",
        "can't sleep",
      ],
      responses: [
        "Sleep challenges are one of the most common — and most draining — parts of living with a chronic condition. Your body is working overtime, and rest becomes even more essential. 🌙\n\nWould you like to try a gentle wind-down routine together? Sometimes a body scan meditation can help signal to your nervous system that it's safe to rest.",
        "Fatigue with chronic illness isn't just being tired — it's a full-body exhaustion that most people don't understand. I want you to know: I see how hard you're working just to get through each day.\n\nLet's be gentle with expectations. What does 'enough rest' look like for you right now — not in an ideal world, but in this one? 🕊️",
        "Not being able to sleep when you're already exhausted is incredibly frustrating. Your mind and body are both trying to cope, and sometimes they get their signals crossed.\n\nHere's a small experiment: try the 4-7-8 breathing technique. Inhale for 4, hold for 7, exhale for 8. Even if sleep doesn't come right away, this can help your body feel safer. 💤",
      ],
    },
    grateful: {
      keywords: [
        "grateful",
        "thankful",
        "happy",
        "good",
        "great",
        "wonderful",
        "better",
        "hopeful",
        "optimistic",
        "joy",
        "blessed",
      ],
      responses: [
        "That makes my heart glow! 🌟 Moments of gratitude amidst the challenges are like anchors — they don't erase the storms, but they keep you grounded.\n\nWhat sparked this feeling? I'd love to help you hold onto it.",
        "I'm really glad to hear that. You deserve good days, and you deserve to celebrate them without guilt. Chronic illness doesn't cancel out joy — they coexist.\n\nWould you like to journal this moment? Capturing the good days can be a light to re-read on the harder ones. ✨",
        "This is beautiful. Hope and gratitude are not just feelings — they're evidence of your resilience. You've been through so much, and yet here you are, finding light.\n\nLet's savor this. What's one thing you'd like to carry from today into tomorrow? 🌷",
      ],
    },
    default: {
      responses: [
        "Thank you for sharing that with me. I'm listening with my whole heart. 💜\n\nLiving with a chronic condition means navigating a world that doesn't always understand — but I want you to know that here, you're seen completely. What would help you most right now?",
        "I appreciate you opening up. Whatever you're feeling right now is valid — there's no wrong way to experience your own journey.\n\nSometimes just putting thoughts into words can lighten the load. Would you like to explore what's on your mind, or would a gentle grounding exercise feel better? 🌿",
        "That takes courage to share, and I want you to know — you don't have to have it all figured out. Some days just getting through is enough, and that's not settling, that's wisdom.\n\nI'm here for whatever you need. Whether it's a listening ear, a breathing exercise, or help tracking how you're doing — just say the word. 🌊",
        "I hear you. Every person's journey with chronic illness is unique, and yours matters.\n\nLet's take this one step at a time. What feels most important for you to address right now? There's no rush — we have all the time you need. 🕊️",
        "You're being really open, and that's a sign of strength, not vulnerability. The path with chronic illness is rarely straight, but you don't have to walk it alone.\n\nWhat would feel most supportive right now? I can help you process emotions, build consistency strategies, or just be here in the quiet with you. 💙",
      ],
    },
  };

    
// Inside your chat.js submit handler
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;

  // 1. Add User Message to UI
  addMessageToUI("user", text);
  chatInput.value = "";

  // 2. Add "Thinking" state
  const thinkingMessageId = addMessageToUI("ai", "Thinking...");

  try {
    // 3. Call the API
    const response = await askGemini(text);
    
    // 4. Replace "Thinking" with actual response
    updateMessageInUI(thinkingMessageId, response);
  } catch (error) {
    updateMessageInUI(thinkingMessageId, "Sorry, I encountered an error.");
  }
});

    
    
  function getAIResponse(userMessage) {
    const lower = userMessage.toLowerCase();
    let bestMatch = null;
    let bestScore = 0;

    for (const [category, data] of Object.entries(aiResponses)) {
      if (category === "default") continue;
      const score = data.keywords.reduce(
        (acc, kw) => acc + (lower.includes(kw) ? 1 : 0),
        0,
      );
      if (score > bestScore) {
        bestScore = score;
        bestMatch = category;
      }
    }

    const pool =
      bestScore > 0
        ? aiResponses[bestMatch].responses
        : aiResponses.default.responses;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // ================================================
  // LocalStorage Persistence
  // ================================================
  function loadConversations() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      conversations = data ? JSON.parse(data) : [];
    } catch {
      conversations = [];
    }
  }

  function saveConversations() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch (e) {
      console.warn("Could not save to localStorage", e);
    }
  }

  // ================================================
  // Conversation Management
  // ================================================
  function createConversation(firstMessage = null) {
    const convo = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      title: firstMessage
        ? firstMessage.slice(0, 40) + (firstMessage.length > 40 ? "..." : "")
        : "New Conversation",
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    if (firstMessage) {
      convo.messages.push({
        role: "user",
        content: firstMessage,
        timestamp: Date.now(),
      });
      const aiReply = getAIResponse(firstMessage);
      convo.messages.push({
        role: "ai",
        content: aiReply,
        timestamp: Date.now(),
      });
    }

    conversations.unshift(convo);
    saveConversations();
    activeConvoId = convo.id;
    renderConversationList();
    renderMessages();
    return convo;
  }

  function deleteConversation(id) {
    conversations = conversations.filter((c) => c.id !== id);
    saveConversations();

    if (activeConvoId === id) {
      activeConvoId = conversations.length > 0 ? conversations[0].id : null;
      renderMessages();
    }

    renderConversationList();
  }

  function getActiveConversation() {
    return conversations.find((c) => c.id === activeConvoId) || null;
  }

  // ================================================
  // Rendering
  // ================================================
  function renderConversationList() {
    conversationList.innerHTML = "";

    if (conversations.length === 0) {
      conversationList.innerHTML = `
        <div class="px-3 py-6 text-center">
          <p class="text-xs text-yrn-muted">No conversations yet</p>
        </div>
      `;
      return;
    }

    conversations.forEach((convo) => {
      const isActive = convo.id === activeConvoId;
      const timeStr = formatRelativeTime(convo.updatedAt);
      const el = document.createElement("div");
      el.className = `convo-item flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer border border-transparent transition-all duration-200 ${isActive ? "active border-yrn-blue/15" : "hover:bg-white/[0.02]"}`;
      el.innerHTML = `
        <div class="w-8 h-8 rounded-lg ${isActive ? "bg-yrn-blue/15" : "bg-white/[0.03]"} flex items-center justify-center flex-shrink-0 transition-colors">
          <svg class="w-3.5 h-3.5 ${isActive ? "text-yrn-blue" : "text-yrn-muted"}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm ${isActive ? "text-yrn-text" : "text-yrn-secondary"} truncate font-medium">${escapeHTML(convo.title)}</p>
          <p class="text-[10px] text-yrn-muted mt-0.5">${timeStr} · ${convo.messages.length} messages</p>
        </div>
        <button class="convo-delete w-6 h-6 rounded-lg flex items-center justify-center text-yrn-muted hover:text-red-400 hover:bg-red-400/10 transition-all flex-shrink-0" data-delete="${convo.id}" title="Delete">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      `;

      el.addEventListener("click", (e) => {
        if (e.target.closest("[data-delete]")) {
          e.stopPropagation();
          deleteConversation(convo.id);
          return;
        }
        activeConvoId = convo.id;
        renderConversationList();
        renderMessages();
        closeSidebarMobile();
      });

      conversationList.appendChild(el);
    });
  }

  function renderMessages() {
    const convo = getActiveConversation();

    if (!convo || convo.messages.length === 0) {
      messagesArea.innerHTML = "";
      messagesArea.appendChild(createEmptyState());
      memoryBar.classList.add("hidden");
      return;
    }

    // Show memory bar
    memoryBar.classList.remove("hidden");

    messagesArea.innerHTML = "";

    // Timestamp separator
    const timeSep = document.createElement("div");
    timeSep.className = "timestamp-separator my-6";
    timeSep.innerHTML = `<span class="text-[10px] text-yrn-muted/50 font-medium whitespace-nowrap">${formatTimestamp(convo.createdAt)}</span>`;
    messagesArea.appendChild(timeSep);

    convo.messages.forEach((msg, i) => {
      const msgEl = createMessageElement(msg, i);
      messagesArea.appendChild(msgEl);
    });

    scrollToBottom();
  }

  function createEmptyState() {
    const div = document.createElement("div");
    div.id = "emptyState";
    div.className =
      "flex flex-col items-center justify-center min-h-[60vh] text-center px-4";
    div.innerHTML = `
      <div class="relative mb-8">
        <div class="w-20 h-20 rounded-3xl bg-gradient-to-br from-yrn-blue to-yrn-cyan flex items-center justify-center shadow-glow-lg-blue animate-float">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
        </div>
        <div class="absolute inset-0 w-20 h-20 rounded-3xl bg-yrn-blue/20 animate-ping-slow"></div>
      </div>
      <h2 class="text-2xl sm:text-3xl font-display font-bold text-yrn-text mb-3">Welcome back, Sarah</h2>
      <p class="text-yrn-secondary text-base max-w-md mb-10 leading-relaxed">I'm here to listen, support, and walk alongside you. How are you feeling today?</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
        <button class="suggestion-card group p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-left hover:bg-white/[0.04] hover:border-yrn-blue/20 transition-all duration-300" data-suggestion="I feel anxious about my health">
          <div class="flex items-start gap-3">
            <span class="text-xl mt-0.5">🌊</span>
            <div>
              <p class="text-sm text-yrn-text font-medium">I feel anxious about my health</p>
              <p class="text-xs text-yrn-muted mt-0.5">Explore your feelings safely</p>
            </div>
          </div>
        </button>
        <button class="suggestion-card group p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-left hover:bg-white/[0.04] hover:border-yrn-warm/20 transition-all duration-300" data-suggestion="I missed my medication today">
          <div class="flex items-start gap-3">
            <span class="text-xl mt-0.5">💊</span>
            <div>
              <p class="text-sm text-yrn-text font-medium">I missed my medication today</p>
              <p class="text-xs text-yrn-muted mt-0.5">Get back on track gently</p>
            </div>
          </div>
        </button>
        <button class="suggestion-card group p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-left hover:bg-white/[0.04] hover:border-yrn-cyan/20 transition-all duration-300" data-suggestion="Help me stay consistent">
          <div class="flex items-start gap-3">
            <span class="text-xl mt-0.5">🎯</span>
            <div>
              <p class="text-sm text-yrn-text font-medium">Help me stay consistent</p>
              <p class="text-xs text-yrn-muted mt-0.5">Build healthy routines</p>
            </div>
          </div>
        </button>
        <button class="suggestion-card group p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-left hover:bg-white/[0.04] hover:border-yrn-violet/20 transition-all duration-300" data-suggestion="Track my emotional progress">
          <div class="flex items-start gap-3">
            <span class="text-xl mt-0.5">📊</span>
            <div>
              <p class="text-sm text-yrn-text font-medium">Track my emotional progress</p>
              <p class="text-xs text-yrn-muted mt-0.5">See how far you've come</p>
            </div>
          </div>
        </button>
      </div>
    `;

    // Re-bind suggestion clicks
    div.querySelectorAll("[data-suggestion]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const text = btn.dataset.suggestion;
        handleSendMessage(text);
      });
      // Mouse tracking
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        btn.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
        btn.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
      });
    });

    return div;
  }

  function createMessageElement(msg, index, animate = false) {
    const wrapper = document.createElement("div");
    wrapper.className = `flex ${msg.role === "user" ? "justify-end" : "justify-start"} mb-4 ${animate ? "message-animate-in" : ""}`;

    if (msg.role === "ai") {
      wrapper.innerHTML = `
        <div class="msg-bubble flex gap-3">
          <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-yrn-blue to-yrn-cyan flex-shrink-0 flex items-center justify-center mt-1">
            <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
          </div>
          <div>
            <div class="ai-bubble px-5 py-4">
              <div class="text-[14px] text-yrn-text leading-relaxed whitespace-pre-wrap">${formatAIContent(msg.content)}</div>
            </div>
            <div class="flex items-center gap-2 mt-1.5 ml-1">
              <span class="text-[10px] text-yrn-muted/40">${formatTime(msg.timestamp)}</span>
              <button class="copy-btn text-yrn-muted/30 hover:text-yrn-muted transition-colors" data-content="${escapeAttr(msg.content)}" title="Copy">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              </button>
            </div>
          </div>
        </div>
      `;
    } else {
      wrapper.innerHTML = `
        <div class="msg-bubble">
          <div class="user-bubble px-5 py-4">
            <p class="text-[14px] text-yrn-text leading-relaxed">${escapeHTML(msg.content)}</p>
          </div>
          <div class="flex items-center justify-end gap-2 mt-1.5 mr-1">
            <span class="text-[10px] text-yrn-muted/40">${formatTime(msg.timestamp)}</span>
          </div>
        </div>
      `;
    }

    // Copy button
    const copyBtn = wrapper.querySelector(".copy-btn");
    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(copyBtn.dataset.content).then(() => {
          copyBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6EE7B7" stroke-width="2" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>`;
          setTimeout(() => {
            copyBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
          }, 2000);
        });
      });
    }

    return wrapper;
  }

  function createTypingIndicator() {
    const wrapper = document.createElement("div");
    wrapper.id = "typingIndicator";
    wrapper.className = "flex justify-start mb-4 message-animate-in";
    wrapper.innerHTML = `
      <div class="msg-bubble flex gap-3">
        <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-yrn-blue to-yrn-cyan flex-shrink-0 flex items-center justify-center mt-1">
          <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
        </div>
        <div class="ai-bubble px-5 py-4">
          <div class="flex items-center gap-1 h-5">
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
          </div>
        </div>
      </div>
    `;
    return wrapper;
  }

  // ================================================
  // Message Handling
  // ================================================
  function handleSendMessage(text) {
    if (!text.trim()) return;

    let convo = getActiveConversation();

    if (!convo) {
      convo = createConversation(text.trim());
      // The conversation was already created with messages, just render
      renderConversationList();
      renderMessages();
      chatInput.value = "";
      chatInput.style.height = "auto";
      sendBtn.disabled = true;
      return;
    }

    // Add user message
    convo.messages.push({
      role: "user",
      content: text.trim(),
      timestamp: Date.now(),
    });

    // Update title if first message
    if (convo.messages.length === 1) {
      convo.title =
        text.trim().slice(0, 40) + (text.trim().length > 40 ? "..." : "");
    }

    convo.updatedAt = Date.now();

    // Show user message
    const emptyEl = document.getElementById("emptyState");
    if (emptyEl) emptyEl.remove();

    memoryBar.classList.remove("hidden");

    const userMsgEl = createMessageElement(
      convo.messages[convo.messages.length - 1],
      0,
      true,
    );
    messagesArea.appendChild(userMsgEl);
    scrollToBottom();

    // Show typing indicator
    const typingEl = createTypingIndicator();
    messagesArea.appendChild(typingEl);
    scrollToBottom();

    // Simulate AI response delay
    const delay = 800 + Math.random() * 1200;
    setTimeout(() => {
      typingEl.remove();

      const aiResponse = getAIResponse(text.trim());
      convo.messages.push({
        role: "ai",
        content: aiResponse,
        timestamp: Date.now(),
      });
      convo.updatedAt = Date.now();
      saveConversations();

      const aiMsgEl = createMessageElement(
        convo.messages[convo.messages.length - 1],
        0,
        true,
      );
      messagesArea.appendChild(aiMsgEl);
      scrollToBottom();
      renderConversationList();
    }, delay);

    chatInput.value = "";
    chatInput.style.height = "auto";
    sendBtn.disabled = true;
  }

  // ================================================
  // Event Listeners
  // ================================================

  // Chat form submit
  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    handleSendMessage(chatInput.value);
  });

  // Input handling
  chatInput.addEventListener("input", () => {
    sendBtn.disabled = !chatInput.value.trim();
    // Auto-resize
    chatInput.style.height = "auto";
    chatInput.style.height = Math.min(chatInput.scrollHeight, 128) + "px";
  });

  // Enter to send (shift+enter for newline)
  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (chatInput.value.trim()) {
        handleSendMessage(chatInput.value);
      }
    }
  });

  // New chat button
  newChatBtn.addEventListener("click", () => {
    activeConvoId = null;
    renderMessages();
    renderConversationList();
    closeSidebarMobile();
    chatInput.focus();
  });

  // Sidebar toggle
  openSidebarBtn.addEventListener("click", () => {
    sidebar.classList.remove("-translate-x-full");
    sidebar.classList.add("translate-x-0");
    sidebarOverlay.classList.remove("opacity-0", "pointer-events-none");
    sidebarOverlay.classList.add("opacity-100", "pointer-events-auto");
  });

  closeSidebarBtn.addEventListener("click", closeSidebarMobile);
  sidebarOverlay.addEventListener("click", closeSidebarMobile);

  function closeSidebarMobile() {
    sidebar.classList.remove("translate-x-0");
    sidebar.classList.add("-translate-x-full");
    sidebarOverlay.classList.remove("opacity-100", "pointer-events-auto");
    sidebarOverlay.classList.add("opacity-0", "pointer-events-none");
  }

  // Suggestion card clicks (initial empty state)
  document.querySelectorAll("[data-suggestion]").forEach((btn) => {
    btn.addEventListener("click", () => {
      handleSendMessage(btn.dataset.suggestion);
    });
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      btn.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
      btn.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    });
  });

  // Keyboard shortcut
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeSidebarMobile();
    }
  });

  // ================================================
  // Utilities
  // ================================================
  function scrollToBottom() {
    requestAnimationFrame(() => {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });
  }

  function escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function escapeAttr(str) {
    return str
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;")
      .replace(/\n/g, "&#10;");
  }

  function formatAIContent(content) {
    // Convert newlines and preserve them, add gentle formatting
    return escapeHTML(content)
      .replace(/\n\n/g, '</p><p class="mt-3 ai-paragraph">')
      .replace(/\n/g, "<br>")
      .replace(/^(.+)$/, '<p class="ai-paragraph">$1</p>');
  }

  function formatTime(timestamp) {
    const d = new Date(timestamp);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function formatTimestamp(timestamp) {
    const d = new Date(timestamp);
    const now = new Date();
    const diff = now - d;

    if (diff < 86400000 && d.getDate() === now.getDate()) return "Today";
    if (diff < 172800000) return "Yesterday";
    return d.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function formatRelativeTime(timestamp) {
    const diff = Date.now() - timestamp;
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return Math.floor(diff / 60000) + "m ago";
    if (diff < 86400000) return Math.floor(diff / 3600000) + "h ago";
    if (diff < 604800000) return Math.floor(diff / 86400000) + "d ago";
    return new Date(timestamp).toLocaleDateString([], {
      month: "short",
      day: "numeric",
    });
  }

  // ================================================
  // Initialize
  // ================================================
  loadConversations();

  if (conversations.length > 0) {
    activeConvoId = conversations[0].id;
    renderConversationList();
    renderMessages();
  } else {
    renderConversationList();
    renderMessages();
  }

  // Focus input
  chatInput.focus();
});
