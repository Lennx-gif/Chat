import { useState, useRef } from "react";
import { useThemeStore } from "../store/useThemeStore";
import { THEMES } from "../constants/index.js";
import { Send } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";

const PREVIEW_MESSAGES = [
  {id:1,content:"Hello, how are you?", isSent: false},
  {id:2,content:"I'm good, thanks! And you?", isSent: true},
  {id:3,content:"Doing well, just working on a project.", isSent: false},
];

const SettingsPage = () => {
  const {theme, setTheme} = useThemeStore();
  const scrollRef = useRef(null);
  const [scrollOffset, setScrollOffset] = useState({ x: 0, y: 0 });

  const handleScroll = (e) => {
    const target = e.target;
    setScrollOffset({
      x: target.scrollLeft,
      y: target.scrollTop
    });
  };

  const handleThemeChange = (e, newTheme) => {
    if (!document.startViewTransition) {
      setTheme(newTheme);
      return;
    }

    const x = e.clientX;
    const y = e.clientY;

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      setTheme(newTheme);
    });

    transition.ready.then(() => {
      document.documentElement.style.setProperty("--clip-x", x);
      document.documentElement.style.setProperty("--clip-y", y);
      document.documentElement.style.setProperty("--clip-radius", endRadius);
      
      transition.finished.finally(() => {
        document.documentElement.style.removeProperty("--clip-x");
        document.documentElement.style.removeProperty("--clip-y");
        document.documentElement.style.removeProperty("--clip-radius");
      });
    });
  };

  return (
    <div className="min-h-screen bg-base-200/50 backdrop-blur-xl relative overflow-y-auto pb-24 md:pb-10 pt-16 md:pt-28">
      <div className="max-w-4xl mx-auto p-4 space-y-8">
        <Card className="border border-base-content/5">
          <CardHeader>
            <CardTitle className="text-2xl font-black">Theme</CardTitle>
            <CardDescription>Choose a styling theme for your chat application</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Scrollable parallax container for themes */}
            <div 
              ref={scrollRef}
              onScroll={handleScroll}
              className="relative h-[260px] overflow-auto border border-base-content/5 rounded-3xl bg-base-300/10 scrollbar-thin shadow-inner"
            >
              {/* Parallax Background Layer */}
              <div 
                className="absolute -inset-10 bg-[radial-gradient(var(--fallback-bc,rgba(0,0,0,0.15))_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-25"
                style={{
                  transform: `translate(${-scrollOffset.x * 0.3}px, ${-scrollOffset.y * 0.3}px)`
                }}
              />

              {/* Content Layer (large size to force 2D scroll) */}
              <div className="w-[1280px] h-[300px] p-6 flex flex-col justify-center gap-6 relative z-10">
                <div className="flex gap-6">
                  {THEMES.slice(0, Math.ceil(THEMES.length / 2)).map((t) => (
                    <button
                      key={t}
                      className={`
                        w-32 h-24 shrink-0 flex flex-col items-center justify-between p-3.5 rounded-[1.25rem] transition-all active:scale-95 cursor-pointer
                        ${theme === t ? "bg-primary/15 border-2 border-primary shadow-lg shadow-primary/10" : "bg-base-100 hover:bg-base-content/5 border border-base-content/10 hover:border-base-content/25"}
                      `}
                      onClick={(e) => handleThemeChange(e, t)}
                    >
                      <div className="relative h-10 w-full rounded-xl overflow-hidden shadow-inner" data-theme={t}>
                        <div className="absolute inset-0 grid grid-cols-4 gap-px p-1 bg-base-300">
                          <div className="rounded bg-primary"></div>
                          <div className="rounded bg-secondary"></div>
                          <div className="rounded bg-accent"></div>
                          <div className="rounded bg-neutral"></div>
                        </div>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider truncate w-full text-center text-base-content/85">
                        {t}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="flex gap-6 pl-12"> {/* staggered offset */}
                  {THEMES.slice(Math.ceil(THEMES.length / 2)).map((t) => (
                    <button
                      key={t}
                      className={`
                        w-32 h-24 shrink-0 flex flex-col items-center justify-between p-3.5 rounded-[1.25rem] transition-all active:scale-95 cursor-pointer
                        ${theme === t ? "bg-primary/15 border-2 border-primary shadow-lg shadow-primary/10" : "bg-base-100 hover:bg-base-content/5 border border-base-content/10 hover:border-base-content/25"}
                      `}
                      onClick={(e) => handleThemeChange(e, t)}
                    >
                      <div className="relative h-10 w-full rounded-xl overflow-hidden shadow-inner" data-theme={t}>
                        <div className="absolute inset-0 grid grid-cols-4 gap-px p-1 bg-base-300">
                          <div className="rounded bg-primary"></div>
                          <div className="rounded bg-secondary"></div>
                          <div className="rounded bg-accent"></div>
                          <div className="rounded bg-neutral"></div>
                        </div>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider truncate w-full text-center text-base-content/85">
                        {t}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview Section */}
        <Card className="border border-base-content/5">
          <CardHeader>
            <CardTitle className="text-lg font-black">Preview</CardTitle>
            <CardDescription>Interactive mock preview of the selected theme</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-2xl border border-base-content/10 overflow-hidden bg-base-200/50 backdrop-blur-xl shadow-lg">
              <div className="p-4 bg-base-300/30">
                <div className="max-w-md mx-auto">
                  {/* Mock Chat UI */}
                  <div className="bg-base-100 rounded-3xl border border-base-content/5 shadow-xl overflow-hidden">
                    {/* Chat Header */}
                    <div className="px-6 py-4 border-b border-base-content/5 bg-base-100/50 backdrop-blur-md">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-2xl bg-primary flex items-center justify-center text-primary-content font-black text-xs">
                          LS
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-base-content leading-none">Lady Sanza</h3>
                          <p className="text-[9px] font-black text-green-500 uppercase tracking-widest mt-1">Online</p>
                        </div>
                      </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="p-6 space-y-6 min-h-[220px] max-h-[220px] overflow-y-auto bg-base-100">
                      {PREVIEW_MESSAGES.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`
                              max-w-[75%] rounded-[1.5rem] p-3.5 shadow-md relative overflow-hidden
                              ${message.isSent 
                                ? "bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/20 text-base-content rounded-br-none" 
                                : "bg-gradient-to-br from-base-content/10 to-base-content/5 border border-base-content/10 text-base-content rounded-bl-none"}
                            `}
                          >
                            <p className="text-xs font-semibold leading-relaxed">{message.content}</p>
                            <p className="text-[8px] font-black opacity-40 mt-2 text-right uppercase tracking-wider">
                              12:00 PM
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 border-t border-base-content/5 bg-base-100/50 backdrop-blur-md">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          className="w-full bg-base-content/5 border border-base-content/5 rounded-2xl py-2.5 px-4 text-xs font-semibold focus:outline-none placeholder:text-base-content/30"
                          placeholder="Type a message..."
                          defaultValue="This is a preview"
                          readOnly
                        />
                        <button className="size-9 rounded-xl bg-primary text-primary-content flex items-center justify-center shadow-md shadow-primary/10">
                          <Send size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;