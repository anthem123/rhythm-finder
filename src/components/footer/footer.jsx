import "./footer.css";
import React from "react";

export default function Footer({
  tempo,
  metronomeText,
  metronomeOn,
  addRhythm,
  toggleMetronome,
}) {
  let msTempo = 0;
  if (tempo) {
    msTempo = 60000 / parseInt(tempo);
  }

  const animationStyle = metronomeOn
    ? {
        WebkitAnimation: `pulse ${msTempo}ms infinite`,
        MozAnimation: `pulse ${msTempo}ms infinite`,
        OAnimation: `pulse ${msTempo}ms infinite`,
        Animation: `pulse ${msTempo}ms infinite`,
      }
    : {};

  return (
    <footer>
      <div className="footer">
        <button
          className="clickable-button tap-input-button"
          onClick={addRhythm}
        >
          Tap Rhythm Here!
        </button>
        <button
          className="play-pause-button"
          style={animationStyle}
          onClick={toggleMetronome}
        >
          {metronomeText}
        </button>
      </div>
    </footer>
  );
}
