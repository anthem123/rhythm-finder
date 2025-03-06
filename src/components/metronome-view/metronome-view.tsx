import "./metronome-view.css";
import React from "react";
import TempoSlider from "./tempo-slider/tempo-slider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

export default function MetronomeView({
  tempo,
  setTempo,
  metronomeOn,
  toggleMetronome,
  onClose,
}) {

  const bpmTapTimes: Array<number> = [];

  const handleBpmTap = () => {
    // Get timestamp in seconds
    const now = new Date().getTime() / 1000;
    bpmTapTimes.push(now);
    // If more than 3 seconds have passed reset the list
    if (now > bpmTapTimes[bpmTapTimes.length - 1] + 3) {
      bpmTapTimes.length = 0;
    }

    // If more than 10 entries have been added remove the first entry
    if (bpmTapTimes.length > 10) {
      bpmTapTimes.shift();
    }
    if (bpmTapTimes.length >= 2) {
      // Calculate the differences between each pair of timestamps
      const diffs: Array<number> = [];
      for (let i = 1; i < bpmTapTimes.length; i++) {
        diffs.push((bpmTapTimes[i] - bpmTapTimes[i - 1]));
      }

      const average = diffs.reduce((a, b) => a + b, 0) / diffs.length;

      setTempo(Math.round(60 / average));
    }
  };

  return (
    <div className="metronome-holder">
      <div className="tempo-top-bar">
        <span className="tempo-title">Set Tempo</span>
        <button onClick={onClose} className="metronome-close-button">
          <FontAwesomeIcon
            icon={faXmark}
            className="metronome-close-button-icon"
          />
        </button>
      </div>
      <TempoSlider
        tempo={tempo}
        setTempo={setTempo}
        metronomeOn={metronomeOn}
        toggleMetronome={toggleMetronome}
      />
      <button className="tap-bpm-button" onClick={handleBpmTap}>Tap for Tempo</button>
    </div>
  );
}

MetronomeView.propTypes = {
  tempo: PropTypes.string.isRequired,
  setTempo: PropTypes.func.isRequired,
  metronomeOn: PropTypes.bool.isRequired,
  toggleMetronome: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
