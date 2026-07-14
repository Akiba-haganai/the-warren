export interface Episode {
  id: string;
  title: string;
  description: string;
  youtubeId: string;      // YouTube video ID
  thumbnail: string;      // high‑quality thumbnail URL
  duration: string;       // e.g. "12:34"
  category: string;
  date: string;
}

export const episodes: Episode[] = [
  {
    id: "1",
    title: "Campus Hustle – How to Make Money as a CBU Student",
    description: "We talk to three students who are running side businesses while studying.",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    duration: "18:24",
    category: "Entrepreneurship",
    date: "2025-12-01",
  },
  {
    id: "2",
    title: "Faith & Focus – Staying Grounded in First Year",
    description: "A conversation with the CBU Christian Union about balancing faith and academics.",
    youtubeId: "9bZkp7q19f0",
    thumbnail: "https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg",
    duration: "22:10",
    category: "Faith",
    date: "2025-11-28",
  },
  // … add more episodes if you want
];