import { describe, expect, it } from "vitest";
import { getLanguage, isGoogleUrl, withLanguage } from "./google-search-url";

describe("isGoogleUrl", () => {
  it.each([
    "https://www.google.com/search?q=python",
    "https://google.com/",
    "https://www.google.com.tr/search?q=python",
    "https://www.google.co.uk/search?q=python",
    "https://www.google.de/search?q=python",
  ])("accepts %s", (url) => {
    expect(isGoogleUrl(new URL(url))).toBe(true);
  });

  it.each([
    "https://mail.google.com/mail/u/0/",
    "https://www.google.com.evil.example/search",
    "https://notgoogle.com/search",
    "https://example.com/?q=google.com",
  ])("rejects %s", (url) => {
    expect(isGoogleUrl(new URL(url))).toBe(false);
  });
});

describe("getLanguage", () => {
  const url = new URL("https://www.google.com/search?q=python&hl=en&lr=lang_tr");

  it("reads the interface language", () => {
    expect(getLanguage(url, "hl")).toBe("en");
  });

  it("strips the lang_ prefix from the page language", () => {
    expect(getLanguage(url, "lr")).toBe("tr");
  });

  it("returns null when the parameter is missing", () => {
    expect(getLanguage(new URL("https://www.google.com/search?q=python"), "lr")).toBeNull();
  });
});

describe("withLanguage", () => {
  const url = new URL("https://www.google.com/search?q=python+wikipedia&hl=tr#top");

  it("replaces the interface language and keeps the rest of the URL", () => {
    expect(withLanguage(url, "hl", "en").href).toBe("https://www.google.com/search?q=python+wikipedia&hl=en#top");
  });

  it("adds the lang_ prefix to the page language", () => {
    expect(withLanguage(url, "lr", "zh-TW").searchParams.get("lr")).toBe("lang_zh-TW");
  });

  it("removes the parameter when the language is null", () => {
    expect(withLanguage(url, "hl", null).href).toBe("https://www.google.com/search?q=python+wikipedia#top");
  });

  it("does not mutate the given URL", () => {
    withLanguage(url, "hl", "en");
    expect(url.searchParams.get("hl")).toBe("tr");
  });
});
