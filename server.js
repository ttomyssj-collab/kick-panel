const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
app.use(express.static("public"));

let messages = [];
let top = {};

(async () => {
  const browser = await puppeteer.launch({
    headless: false, // importante
  });

  const page = await browser.newPage();

  // 👉 abrir tu Kick
  await page.goto("https://kick.com/valvall11");

  console.log("Bot abierto en Kick");

  // 🔥 escuchar chat desde DOM
  setInterval(async () => {
    const msgs = await page.evaluate(() => {
      let elements = document.querySelectorAll("[data-testid='chat-message']");
      let arr = [];

      elements.forEach(el => {
        arr.push(el.innerText);
      });

      return arr.slice(-10);
    });

    msgs.forEach(m => {
      if (!messages.includes(m)) {
        messages.push(m);

        let user = m.split(":")[0] || "anon";

        top[user] = (top[user] || 0) + 1;

        console.log(m);
      }
    });

  }, 3000);

})();

// 🏆 TOP
app.get("/api/top", (req,res)=>{
  const sorted = Object.entries(top)
    .sort((a,b)=>b[1]-a[1])
    .slice(0,5);

  res.json(sorted);
});

app.listen(3000, ()=>{
  console.log("Servidor listo en http://localhost:3000");
});