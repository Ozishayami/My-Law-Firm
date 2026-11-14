// The Trueworth Studio: the CMS where the team writes and publishes Insights articles.
// It is built into the website at /studio (see package.json "build").
import { defineConfig, buildLegacyTheme } from "sanity";
import { structureTool } from "sanity/structure";
import { article } from "./studio/schemas/article";

const teal = "#0d5e70";

export default defineConfig({
  name: "trueworth",
  title: "Trueworth",
  projectId: "7veoevjj",
  dataset: "production",
  // Served from /studio: the base path is set once, in sanity.cli.js (project.basePath).
  theme: buildLegacyTheme({
    "--brand-primary": teal,
    "--focus-color": teal,
    "--default-button-primary-color": teal,
    "--state-info-color": teal,
  }),
  plugins: [
    structureTool({
      title: "Content",
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Insights articles")
              .schemaType("article")
              .child(S.documentTypeList("article").title("Insights articles").defaultOrdering([{ field: "publishedAt", direction: "desc" }])),
          ]),
    }),
  ],
  schema: { types: [article] },
});
