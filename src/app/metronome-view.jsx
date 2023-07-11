import React, { useState, useEffect } from 'react';
import metronomeUtil from './metronome/metronome-util'
import TempoSlider from './tempo-slider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons'

export default function Metronome({
  tempo,
  setTempo,
  setNewRhythm
  }) {
    const playIcon = <FontAwesomeIcon icon={faPlay} />;
    const pauseIcon = <FontAwesomeIcon icon={faPause} />;
    const [metronomeText, setMetronomeText] = useState(playIcon);
    const [metronomeOn, setMetronomeOn] = useState(false);
    useEffect(() => {
      // call api or anything
      const basePath = process.env.RESOURCE_PATH === undefined ? '/rhythm-finder' : process.env.RESOURCE_PATH;
      metronomeUtil.init(basePath);
    });

    const toggleMetronome = () => {
      if (metronomeOn) {
        setMetronomeOn(false);
        setMetronomeText(playIcon);
        setNewRhythm(true);
      } else {
        setMetronomeOn(true);
        setMetronomeText(pauseIcon);
      }
    }

    if (metronomeOn) {
      metronomeUtil.play(tempo);
    } else {
      metronomeUtil.stop();
    }

    let msTempo;
    if (tempo) {
      msTempo = 60000/tempo;
    } else {
      msTempo = 0;
    }

    const animationStyle = metronomeOn ? {
      '-webkit-animation': `pulse ${msTempo}ms infinite`,
      '-moz-animation': `pulse ${msTempo}ms infinite`,
      '-o-animation': `pulse ${msTempo}ms infinite`,
      '-animation': `pulse ${msTempo}ms infinite`,
    } : {};
    
    return (
      <div>
        <div className='tempo-display'>
          <p className='tempo-text'>{tempo}</p>
          <p className='tempo-bpm'>BPM</p>
        </div>
        <TempoSlider
          tempo={tempo}
          setTempo={setTempo}
          metronomeOn={metronomeOn}
          toggleMetronome={toggleMetronome}
        />
        <div>
          <button className='play-pause-button' style={animationStyle} onClick={toggleMetronome}>{metronomeText}</button>
          <button className='tap-bpm-button'>Tap for Tempo</button>
        </div>
      </div>
    )
  }