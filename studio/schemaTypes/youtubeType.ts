import { defineType, defineField } from "sanity";
import { Play } from "lucide-react";

export const youtubeType = defineType({
  name: "youtube",
  type: "object",
  title: "YouTube Video",
  icon: Play,
  fields: [
    defineField({
      name: "url",
      type: "url",
      title: "YouTube Video URL",
      description: "Paste the YouTube video link here (e.g. https://www.youtube.com/watch?v=...)",
      validation: (rule) => 
        rule.required().custom(url => {
          if (!url) return true;
          const isYouTubeUrl = url.includes("youtube.com") || url.includes("youtu.be");
          return isYouTubeUrl ? true : "Must be a valid YouTube URL";
        })
    }),
    defineField({
      name: "caption",
      type: "string",
      title: "Caption (Optional)",
      description: "Optional caption to display below the video",
    }),
  ],
  preview: {
    select: {
      title: 'caption',
      url: 'url'
    },
    prepare({ title, url }) {
      return {
        title: title || 'YouTube Video',
        subtitle: url,
        media: Play
      }
    }
  }
});
