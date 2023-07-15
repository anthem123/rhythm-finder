import React, { useState, useEffect } from 'react';
import TempoSlider from './tempo-slider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

export default function Metronome({
  tempo,
  setTempo,
  metronomeOn,
  toggleMetronome,
  displayMetModal,
  onClose
  }) {
    if (!displayMetModal) {
      return null;
    }

    return (
      <div className='metronome-holder'>
        <div className='tempo-top-bar'>
          <span className='tempo-title'>Set Tempo</span>
          <button onClick={onClose} className='metronome-close-button'>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
        <TempoSlider
          tempo={tempo}
          setTempo={setTempo}
          metronomeOn={metronomeOn}
          toggleMetronome={toggleMetronome}
        />
        <button className='tap-bpm-button'>Tap for Tempo</button>
      </div>
    )
  }