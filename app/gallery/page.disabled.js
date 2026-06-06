"use client";

import { useState } from "react";

const frames = [
  {
    className: "frame-main",
    label: "OFFICIAL BRAND STORE REPROGRAMMING",
    tone: "lime",
  },
  {
    className: "frame-sky",
    label: "CONTENT SYSTEMS FOR EARLY TEAMS",
    tone: "cyan",
  },
  {
    className: "frame-green",
    label: "MVP VALIDATION FAST",
    tone: "sage",
  },
  {
    className: "frame-stone",
    label: "COMMUNITY MVP MAPS",
    tone: "stone",
  },
  {
    className: "frame-edge",
    label: "FINISHED MVP SCREENS",
    tone: "cream",
  },
];

export default function GalleryPage() {
  const [activeIndex, setActiveIndex] = useState(0);

  const move = (direction) => {
    setActiveIndex((current) => (current + direction + frames.length) % frames.length);
  };

  return (
    <main className="reference-page">
      <section className="collage" aria-label="gallery layout">
        {frames.map((frame, index) => {
          const offset = index - activeIndex;

          return (
            <button
              className={`image-frame ${frame.className} ${index === activeIndex ? "is-active" : ""}`}
              key={frame.className}
              onClick={() => setActiveIndex(index)}
              style={{ "--offset": offset }}
              type="button"
            >
              <span className={`poster-card tone-${frame.tone}`}>
                <span className="poster-visual" />
                <span className="pixel-mark pixel-mark-top" />
                <span className="poster-copy">
                  <span className="poster-title">{frame.label}</span>
                  <span className="pixel-mark pixel-mark-bottom" />
                </span>
              </span>
            </button>
          );
        })}
      </section>

      <button className="slide-hit slide-prev" onClick={() => move(-1)} type="button" aria-label="previous slide" />
      <button className="slide-hit slide-next" onClick={() => move(1)} type="button" aria-label="next slide" />
    </main>
  );
}
