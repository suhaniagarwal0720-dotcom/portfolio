const form = document.getElementById("chatForm");
const input = document.getElementById("chatInput");
const messages = document.getElementById("chatMessages");
const statusText = document.getElementById("chatStatus");
const sendButton = document.getElementById("chatSend");
function showMessage(text, kind) {
const p = document.createElement("p");
p.className = kind === "user" ? "user-message" : "bot-message";
p.textContent = text;
messages.appendChild(p);
messages.scrollTop = messages.scrollHeight;
}
form.addEventListener("submit", async (event) => {
event.preventDefault();
const question = input.value.trim();
if (!question) { statusText.textContent = "Please type a question."; return; }
if (!CONFIG.apiKey || CONFIG.apiKey === "YOUR_GROQ_API_KEY") {
statusText.textContent = "Add your Groq API key in config.js first.";
return;
}
showMessage(question, "user");
input.value = "";
sendButton.disabled = true;
statusText.textContent = "Thinking...";
try {
const response = await fetch(`${CONFIG.baseUrl}/chat/completions`, {
method: "POST",
headers: {
"Content-Type": "application/json",
"Authorization": `Bearer ${CONFIG.apiKey}`
},
body: JSON.stringify({
model: CONFIG.model,
temperature: 0.7,
messages: [
{ role: "system", content: "You are a friendly portfolio chatbot. Keep replies under 60words. If you do not know a personal detail, say so rather than inventing it." },
{ role: "user", content: question }
]
})
});
if (!response.ok) {
if (response.status === 401) throw new Error("Check your API key.");
if (response.status === 429) throw new Error("Too many requests. Wait and try again.");
throw new Error(`API request failed (HTTP ${response.status}).`);
}
const data = await response.json();
showMessage(data.choices?.[0]?.message?.content || "No reply received.", "bot");
statusText.textContent = "";
} catch (error) {
statusText.textContent = "Chat unavailable. " + error.message;
} finally {
sendButton.disabled = false;
}
});