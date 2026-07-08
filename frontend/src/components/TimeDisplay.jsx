import React, { useState, useEffect } from "react";

export default function TimeDisplay() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;

      setTime(`${hours}:${minutes} ${ampm}`);
      setDate(
        now
          .toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
          .toUpperCase()
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-28 right-8 md:right-16 lg:right-24 z-40">
      <div className="bg-surface-container/30 backdrop-blur-sm px-3 py-2 md:px-5 md:py-3 rounded-xl border border-outline-variant/10 flex flex-col items-end shadow-lg min-w-[100px] md:min-w-[140px]">
        <div className="flex items-center gap-3 mb-1.5">
          <span className="text-[10px] md:text-sm font-headline font-bold text-on-surface tracking-widest">
            {time || "--:-- --"}
          </span>
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
          </div>
        </div>
        <span className="text-[8px] md:text-[10px] font-headline font-light tracking-[0.2em] text-on-surface-variant uppercase">
          {date || "--- --, ----"}
        </span>
      </div>
    </div>
  );
}
