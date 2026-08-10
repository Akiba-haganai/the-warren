import { defineField, defineType } from "sanity";

export const topicType = defineType({
  name: "topic",
  title: "Topic",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required().min(2).max(60),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "isTrending",
      title: "Show on Home Page (Trending)",
      type: "boolean",
      description: "Pin this topic to the trending section on the home page.",
      initialValue: false,
    }),
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      description: "Optional: override the page title for SEO.",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      description: "Optional: override the meta description for SEO.",
    }),
  ],
});