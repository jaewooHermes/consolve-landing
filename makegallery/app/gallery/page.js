"use client";

import { useState } from "react";
import { projects, SLOTS } from "../data/projects";

const TOTAL = projects.length;

export default function GalleryPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [flippedSlug, setFlippedSlug] = useState(null);

  const move = (direction) => {
    setActiveIndex((current) => (current + direction + TOTAL) % TOTAL);
    setFlippedSlug(null);
  };

  const handleCardClick = (slotIndex, cardIndex, slug) => {
    if (slotIndex === 0) {
      setFlippedSlug((current) => (current === slug ? null : slug));
      return;
    }
    setActiveIndex(cardIndex);
    setFlippedSlug(null);
  };

  return (
    <main className="reference-page">
      <section className="collage" aria-label="gallery layout">
        {SLOTS.map((slot, slotIndex) => {
          const cardIndex = (activeIndex + slotIndex) % TOTAL;
          const project = projects[cardIndex];
          const isActive = slotIndex === 0;
          const isFlipped = isActive && flippedSlug === project.slug;

          return (
            <button
              className={`image-frame ${slot.frameClass} ${isActive ? "is-active" : ""}`}
              key={slot.frameClass}
              onClick={() => handleCardClick(slotIndex, cardIndex, project.slug)}
              type="button"
              aria-label={
                isActive
                  ? `${project.name} — click to ${isFlipped ? "show poster" : "show screenshot"}`
                  : `Show ${project.name}`
              }
            >
              <span className={`flip-card-inner ${isFlipped ? "is-flipped" : ""}`}>
                <span className={`flip-face flip-front poster-card tone-${slot.tone}`}>
                  <span className="pixel-mark pixel-mark-top" />
                  <span className="poster-title">{project.label}</span>
                  <span className="pixel-mark pixel-mark-bottom" />
                </span>
                <span className="flip-face flip-back">
                  <img
                    src={project.image}
                    alt={`${project.name} screenshot`}
                    className="flip-back-image"
                  />
                  <span className="flip-back-caption">
                    <span className="flip-back-name">{project.name}</span>
                    <span className="flip-back-blurb">{project.blurb}</span>
                  </span>
                </span>
              </span>
            </button>
          );
        })}
      </section>

      <button
        className="slide-hit slide-prev"
        onClick={() => move(-1)}
        type="button"
        aria-label="previous slide"
      />
      <button
        className="slide-hit slide-next"
        onClick={() => move(1)}
        type="button"
        aria-label="next slide"
      />

      <span className="counter" aria-live="polite">
        {String(activeIndex + 1).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}
      </span>
    </main>
  );
}
