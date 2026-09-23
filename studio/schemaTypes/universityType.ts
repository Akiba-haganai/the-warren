import { defineField, defineType } from "sanity";

export const universityType = defineType({
  name: "university",
  title: "University",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
    }),
    defineField({
      name: "shortDescription",
      title: "Short Description",
      type: "string",
    }),
  ],
});
