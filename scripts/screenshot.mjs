import puppeteer from "puppeteer";
import { mkdirSync } from "node:fs";

const OUT = new URL("../screenshots/", import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

const BASE = "http://localhost:7655";
const W = 1280, H = 900;

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: W, height: H });

async function shot(name, setup) {
  await page.goto(BASE, { waitUntil: "networkidle0" });
  if (setup) await setup();
  await new Promise(r => setTimeout(r, 300));
  await page.screenshot({ path: OUT + name, fullPage: false });
  console.log("saved:", name);
}

// Dark mode — list view
await shot("dark-list.png", async () => {
  await page.evaluate(() => document.documentElement.setAttribute("data-theme","dark"));
});

// Dark mode — device detail (Dirty Mirror / Animal Factory)
await shot("dark-detail.png", async () => {
  await page.evaluate(() => {
    document.documentElement.setAttribute("data-theme","dark");
    const items = document.querySelectorAll(".result-item");
    for (const i of items) {
      if (i.querySelector(".device")?.textContent.includes("Dirty Mirror")) { i.click(); break; }
    }
  });
  await new Promise(r => setTimeout(r, 200));
});

// Light mode — list view
await shot("light-list.png", async () => {
  await page.evaluate(() => document.documentElement.setAttribute("data-theme","light"));
});

// Light mode — device detail
await shot("light-detail.png", async () => {
  await page.evaluate(() => {
    document.documentElement.setAttribute("data-theme","light");
    const items = document.querySelectorAll(".result-item");
    for (const i of items) {
      if (i.querySelector(".device")?.textContent.includes("Dirty Mirror")) { i.click(); break; }
    }
  });
  await new Promise(r => setTimeout(r, 200));
});

await browser.close();
console.log("Done →", OUT);
