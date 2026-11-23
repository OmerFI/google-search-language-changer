import { defineConfig } from "wxt";

export default defineConfig({
  imports: false,
  manifestVersion: 3,
  manifest: ({ browser }) => ({
    name: "__MSG_extensionName__",
    description: "__MSG_extensionDescription__",
    default_locale: "en",
    homepage_url: "https://github.com/OmerFI/google-search-language-changer",
    permissions: ["activeTab"],
    ...(browser === "firefox" && {
      browser_specific_settings: {
        gecko: {
          // AMO'daki mevcut kaydın ID'si; değişirse mağaza bunu yeni bir eklenti sayar.
          id: "{6fb0f31f-0a75-4b37-8db8-80c6fc8e3ff4}",
          data_collection_permissions: { required: ["none"] },
        },
      },
    }),
  }),
});
