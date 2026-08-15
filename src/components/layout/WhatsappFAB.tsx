import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { usePlayer } from "@/contexts/PlayerContext";

const links = [
  {
    label: "Join Channel",
    url: "https://whatsapp.com/channel/0029Vb8NY5f84OmCRIr9K91V",
  },
  {
    label: "Join Group",
    url: "https://chat.whatsapp.com/I4TtoTKBGB9I4eVv4VKXGs",
  },
];

export function WhatsAppFAB() {
  const [open, setOpen] = useState(false);
  const { currentEpisode } = usePlayer();

  return (
    <div className={`fixed right-6 z-50 flex flex-col items-end gap-3 transition-all duration-300 ${currentEpisode ? "bottom-24" : "bottom-6"}`}>
      {open && (
        <div className="flex flex-col gap-2 bg-card/90 backdrop-blur border border-border rounded-2xl p-3 shadow-elegant mb-2">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-full bg-green-500 text-white hover:bg-green-600 transition font-medium"
            >
              <MessageCircle className="h-4 w-4" />
              {link.label}
            </a>
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-glow hover:scale-105 transition"
        aria-label="WhatsApp"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}