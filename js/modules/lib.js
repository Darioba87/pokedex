export const el = (css) => document.querySelector(css);
export const group = (css) => document.querySelectorAll(css);
export const create = (html) => document.createElement(html);

export async function loadJson(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to load JSON from ${url}: ${response.statusText}`);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("Network or JSON parsing error:", error);
    return null;
  }
}
