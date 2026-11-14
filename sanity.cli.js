// Sanity CLI settings for the Trueworth Studio (the CMS at /studio).
import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: { projectId: "7veoevjj", dataset: "production" },
  // The Studio is served from trueworthlp.com/studio.
  project: { basePath: "/studio" },
  // Bundle the Studio with the website instead of loading it from Sanity's CDN at runtime.
  deployment: { autoUpdates: false },
});
