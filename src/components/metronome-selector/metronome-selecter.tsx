import "./metronome-selecter.css";
import React from "react";
import PropTypes from "prop-types";

export default function MetronomeSelecter({ tempo, onSelect }) {
  return (
    <button className="tempo-button" onClick={onSelect}>
      <span className="tempo-text">{tempo}</span>
      <span className="tempo-bpm">BPM</span>
    </button>
  );
}

MetronomeSelecter.propTypes = {
  tempo: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};
