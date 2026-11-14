import { defineArrayMember, defineField, defineType } from "sanity";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { PRACTICES, ARTWORK } from "../options";

/** An Insights article. Published articles appear on the website after the next rebuild. */
export const article = defineType({
  name: "article",
  title: "Article",
  type: "document",
  icon: DocumentTextIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "details", title: "Details" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (r) => r.required().max(140),
    }),
    defineField({
      name: "standfirst",
      title: "Summary",
      description: "One sentence shown under the title and on article cards.",
      type: "text",
      rows: 2,
      group: "content",
      validation: (r) => r.required().max(220),
    }),
    defineField({
      name: "body",
      title: "Article",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Paragraph", value: "normal" },
            { title: "Intro paragraph (larger)", value: "lead" },
            { title: "Heading", value: "h2" },
            { title: "Subheading", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bullets", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
            annotations: [
              defineArrayMember({
                name: "link",
                title: "Link",
                type: "object",
                fields: [
                  defineField({
                    name: "href",
                    title: "Address",
                    type: "url",
                    validation: (r) => r.uri({ allowRelative: true, scheme: ["http", "https", "mailto", "tel"] }),
                  }),
                ],
              }),
            ],
          },
        }),
      ],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "practice",
      title: "Practice area",
      description: "Decides where the article is listed and the label on its card.",
      type: "string",
      group: "details",
      options: { list: PRACTICES, layout: "dropdown" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Date",
      type: "date",
      group: "details",
      initialValue: () => new Date().toISOString().slice(0, 10),
      options: { dateFormat: "D MMMM YYYY" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Web address",
      description: "The end of the article's address, e.g. trueworthlp.com/insights/virtual-assets-in-nigeria. Click Generate.",
      type: "slug",
      group: "details",
      options: { source: "title", maxLength: 90 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      description: "Optional. A wide photograph works best. If you leave this empty, the artwork below is used.",
      type: "image",
      group: "details",
      options: { hotspot: true },
    }),
    defineField({
      name: "artwork",
      title: "Artwork",
      description: "Used when there is no cover image.",
      type: "string",
      group: "details",
      options: { list: ARTWORK, layout: "radio" },
      initialValue: "photo",
      hidden: ({ parent }) => Boolean(parent?.coverImage?.asset),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "string",
      group: "details",
      initialValue: "Trueworth",
    }),
  ],
  orderings: [
    { title: "Newest first", name: "dateDesc", by: [{ field: "publishedAt", direction: "desc" }] },
  ],
  preview: {
    select: { title: "title", practice: "practice", date: "publishedAt", media: "coverImage" },
    prepare({ title, practice, date, media }) {
      const area = PRACTICES.find((p) => p.value === practice)?.title || "No practice area";
      return { title, subtitle: [area, date].filter(Boolean).join(" · "), media: media || DocumentTextIcon };
    },
  },
});
