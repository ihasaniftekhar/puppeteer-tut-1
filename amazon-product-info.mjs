import puppeteer from "puppeteer";

const browser = await puppeteer.launch({
  headless: false,
  defaultViewport: false,
  userDataDir: "temporary",
});

const page = await browser.newPage();

await page.goto("https://www.amazon.com/");

const searchbar = await page.waitForSelector("#twotabsearchtextbox");

await searchbar.type("Gaming Accessories");

// const searchBtn = await page.waitForSelector("#nav-search-submit-button");

await page.click("input[type='submit']");

await page.waitForTimeout(2000);

const productHandles = await page.$$(
  "div.s-main-slot.s-result-list.s-search-results.sg-row > .s-result-item"
);

let productTitle = "Null";
let productPrice = "Null";
let productDesk = "Null";
let productImg = "Null";

const productDetails = [];

for (const product of productHandles) {
  try {
    productTitle = await page.evaluate(
      (e) => e.querySelector("h2 > a > span").textContent,
      product
    );
  } catch {}

  try {
    productImg = await page.evaluate(
      (e) => e.querySelector("div > span > a > div > img").getAttribute("src"),
      product
    );
  } catch {}

  try {
    productPrice = await page.evaluate(
      (e) => e.querySelector("span.a-offscreen").textContent,
      product
    );
  } catch {}

  if (productTitle != "Null") {
    productDetails.push({ productTitle, productImg, productPrice });
  }
}

console.log(productDetails);

browser.close();
