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

    let msTempo;
    if (tempo) {
      msTempo = 60000/tempo;
    } else {
      msTempo = 0;
    }

    if (metronomeOn) {
      metronomeUtil.play(tempo);
    } else {
      metronomeUtil.stop();
    }
    
    return (
      <div>
        <div className='tempo-display'>
          <p className='tempo-text'>{tempo}</p>
          <p className='tempo-bpm'>BPM</p>
        </div>
        <div>
          <button className='clickable-button' onClick={toggleMetronome}>{metronomeText}</button>
          <button className='clickable-button'>Tap for Tempo</button>
        </div>
        <TempoSlider
          tempo={tempo}
          setTempo={setTempo}
          metronomeOn={metronomeOn}
          toggleMetronome={toggleMetronome}
        />
      </div>
    )
  }