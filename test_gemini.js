const fetch = require('node-fetch'); // If not available, we can just use native node fetch if node v18+

async function testGemini() {
  const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyAD7dfhGFqMoxlBbpsFQGLQ6j2fDIgtwCk";
  const payload = {
    systemInstruction: {
      parts: [{ text: "You are a helpful AI." }]
    },
    contents: [
      { role: "user", parts: [{ text: "Hello" }] }
    ]
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
}

testGemini();
