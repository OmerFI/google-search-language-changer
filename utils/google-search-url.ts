// hl: Google'ın arayüz dili, lr: sonuç olarak gösterilecek sayfaların dili.
export type LanguageParam = "hl" | "lr";

// google.com ile google.com.tr, google.co.uk, google.de gibi ülke alan adları.
const GOOGLE_HOSTNAME = /^(www\.)?google\.(com|com\.[a-z]{2}|co\.[a-z]{2}|[a-z]{2})$/;

export function isGoogleUrl(url: URL): boolean {
  return GOOGLE_HOSTNAME.test(url.hostname);
}

export function getLanguage(url: URL, param: LanguageParam): string | null {
  const value = url.searchParams.get(param);
  if (param === "lr" && value !== null) {
    return value.replace(/^lang_/, "");
  }
  return value;
}

// language null verilirse parametre kaldırılır ve Google varsayılanına döner.
export function withLanguage(url: URL, param: LanguageParam, language: string | null): URL {
  const result = new URL(url);
  if (language === null) {
    result.searchParams.delete(param);
  } else if (param === "lr") {
    result.searchParams.set(param, `lang_${language}`);
  } else {
    result.searchParams.set(param, language);
  }
  return result;
}
