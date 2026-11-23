import { browser } from "wxt/browser";
import { getLanguage, isGoogleUrl, type LanguageParam, withLanguage } from "@/utils/google-search-url";

type MessageName = Parameters<typeof browser.i18n.getMessage>[0];

const buttons = [...document.querySelectorAll<HTMLButtonElement>("button[data-param]")];
const resetIcons = [...document.querySelectorAll<HTMLElement>("[data-reset]")];

function translatePage(): void {
  for (const element of document.querySelectorAll<HTMLElement>("[data-i18n]")) {
    element.textContent = browser.i18n.getMessage(element.dataset.i18n as MessageName);
  }
}

function highlight(param: LanguageParam, language: string | null): void {
  for (const button of buttons) {
    if (button.dataset.param === param) {
      button.classList.toggle("active", button.dataset.language === language);
    }
  }
}

async function main(): Promise<void> {
  translatePage();

  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  if (tab?.id === undefined || tab.url === undefined) {
    return;
  }
  const tabId = tab.id;
  let url = new URL(tab.url);
  if (!isGoogleUrl(url)) {
    return;
  }

  highlight("hl", getLanguage(url, "hl"));
  highlight("lr", getLanguage(url, "lr"));

  async function select(param: LanguageParam, language: string | null): Promise<void> {
    highlight(param, language);
    // Sekme yeni adrese geçtikten sonra activeTab izni adresi yeniden okumaya yetmeyebilir;
    // art arda yapılan seçimlerin birbirini silmemesi için adresin son hali burada tutuluyor.
    url = withLanguage(url, param, language);
    await browser.tabs.update(tabId, { url: url.href });
  }

  for (const button of buttons) {
    button.addEventListener("click", () =>
      select(button.dataset.param as LanguageParam, button.dataset.language as string),
    );
  }
  for (const icon of resetIcons) {
    icon.addEventListener("click", () => select(icon.dataset.reset as LanguageParam, null));
  }
}

main();
