import axios from "axios";
import cheerio from "cheerio";

export async function getHTML(url) {
  const { data: html } = await axios.get(url);
  return html;
}

export async function getTwitterFollowers(html) {
  const $ = cheerio.load(html);
  const span = $('[data-nav="followers"] .ProfileNav-value');
  return span.data("count");
}

export async function getInstagramFollowers(html) {
  const $ = cheerio.load(html);
  const span = $('script[type="application/ld+json"]');
  const jsonData = JSON.parse(span.html());
  const followers =
    jsonData.mainEntityofPage.interactionStatistic.userInteractionCount;
  return parseInt(followers);
}

export async function getInstragramCount() {
  const html = await getHTML("https://www.instagram.com/realdonaldtrump/");
  const instagramCount = await getInstagramFollowers(html);
  return instagramCount;
}

export async function getTwitterCount() {
  const html = await getHTML("https://twitter.com/realDonaldTrump");
  const twitterCount = await getTwitterFollowers(html);
  return twitterCount;
}
