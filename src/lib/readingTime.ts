/**
 * Flattens Sanity PortableText blocks to calculate reading time.
 * Average reading speed: 225 words per minute.
 * Added visual processing time: 12 seconds per inline image.
 */
export function calculateReadingTime(blocks: any[]): number {
  if (!blocks || !Array.isArray(blocks)) return 1;

  let wordCount = 0;
  let imageCount = 0;

  blocks.forEach((block) => {
    if (block._type === "image") {
      imageCount++;
    } else if (block._type === "block" && block.children) {
      block.children.forEach((child: any) => {
        if (child._type === "span" && child.text) {
          // Split by whitespace to count words
          const words = child.text.trim().split(/\s+/).filter(Boolean);
          wordCount += words.length;
        }
      });
    }
  });

  const wordsPerMinute = 225;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  
  // 12 seconds = 0.2 minutes per image
  const imageTimeMinutes = imageCount * 0.2;
  
  return Math.max(1, Math.ceil(readingTimeMinutes + imageTimeMinutes));
}
