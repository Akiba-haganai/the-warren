import { defineField, defineType } from "sanity";

export const culturePhotoType = defineType({
  name: "culturePhoto",
  title: "Culture Photo",
  type: "document",
  fields: [
    defineField({
      name: "image",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Campus Life", value: "Campus Life" },
          { title: "Events", value: "Events" },
          { title: "Faith & Community", value: "Faith & Community" },
          { title: "People", value: "People" },
          { title: "Academics", value: "Academics" },
          { title: "Sports & Recreation", value: "Sports & Recreation" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
    }),
    defineField({
      name: "order",
      title: "Sort order",
      type: "number",
      description: "Lower numbers show first.",
      initialValue: 0,
    }),
  ],
  preview: {
    select: { title: "caption", media: "image" },
    prepare({ title, media }) {
      return { title: title || "Untitled photo", media };
    },
  },
});
