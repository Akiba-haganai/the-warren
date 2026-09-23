import { defineField, defineType } from "sanity";

export const campusType = defineType({
  name: "campus",
  title: "Campus",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Campus Name",
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
      name: "university",
      title: "University",
      type: "reference",
      to: [{ type: "university" }],
      validation: (rule) => rule.required(),
    }),
  ],
});
