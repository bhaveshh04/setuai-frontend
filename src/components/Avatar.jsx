import { useEffect } from "react";

export default function Avatar({ text }) {
  // Optional: If you still want to handle actions when text arrives from Groq,
  // you can use this hook, though a pre-recorded embed cannot dynamically change its speech.
  useEffect(() => {
    if (text) {
      console.log("New tutor response text arrived:", text);
    }
  }, [text]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative group">
        {/* Main video container matching your original w-32 h-32 layout */}
        <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-indigo-500 shadow-lg bg-black flex items-center justify-center">
          
          {/* THE FIX: Swapped out the raw <video> tag for your working HeyGen Embed Iframe */}
          <iframe 
            src="https://app.heygen.com/embeds/3836513981e1419aba7b5caa0192cf48" 
            title="Avatar Video" 
            frameBorder="0" 
            allow="encrypted-media; fullscreen;" 
            allowFullScreen
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Label status matching your application theme */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center pointer-events-none z-10">
            <span className="text-[10px] text-white font-bold uppercase bg-black/60 px-2 py-0.5 rounded-full">
              SETU AI
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}