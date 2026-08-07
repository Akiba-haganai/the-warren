import { defineField, defineType } from "sanity";

export const storyType = defineType({
  name: "story",
  title: "Story",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required().min(3).max(200),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "author",
      title: "Legacy Author name",
      type: "string",
      readOnly: true,
      hidden: ({ document }) => !document?.author,
      validation: (rule) =>
        rule.custom((value, context) => {
          const document = context.document;
          if (!document?.authorProfile && !value) {
            return "Either an Author profile or legacy author name is required";
          }
          if (value && (value.length < 2 || value.length > 80)) {
            return "Legacy name must be between 2 and 80 characters";
          }
          return true;
        }),
    }),
    defineField({
      name: "authorProfile",
      title: "Author Profile",
      type: "reference",
      to: [{ type: "author" }],
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 2,
      validation: (rule) => rule.max(300),
    }),
    defineField({
      name: "mainImage",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "topics",
      title: "Topics",
      type: "array",
      of: [{ type: "reference", to: [{ type: "topic" }] }],
      validation: (rule) => rule.max(5),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "submittedViaForm",
      title: "Submitted via public form",
      type: "boolean",
      initialValue: false,
      readOnly: true,
      description:
        "True if this came in through /submit rather than being written directly here.",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "author", media: "mainImage" },
  },
});