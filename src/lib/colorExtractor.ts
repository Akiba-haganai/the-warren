// src/lib/colorExtractor.ts
const colorCache: Record<string, string> = {};

export async function extractDominantColor(imageUrl: string, episodeId: string): Promise<string> {
  if (colorCache[episodeId]) return colorCache[episodeId];

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageUrl;

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 20;
        canvas.height = 20;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve("rgba(255, 109, 0, 0.15)");
          return;
        }

        ctx.drawImage(img, 0, 0, 20, 20);
        const data = ctx.getImageData(0, 0, 20, 20).data;

        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < data.length; i += 16) { // sample every 4th pixel
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }

        r = Math.floor(r / count);
        g = Math.floor(g / count);
        b = Math.floor(b / count);

        const rgba = `rgba(${r}, ${g}, ${b}, 0.25)`;
        colorCache[episodeId] = rgba;
        resolve(rgba);
      } catch {
        resolve("rgba(255, 109, 0, 0.15)");
      }
    };

    img.onerror = () => {
      resolve("rgba(255, 109, 0, 0.15)");
    };
  });
}
