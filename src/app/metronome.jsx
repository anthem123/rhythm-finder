import React, { useState, useEffect } from 'react';
import metronome from './metronome/metronome'

export default function Metronome({
  metronomeOn,
  tempo
  }) {
    useEffect(() => {
      // call api or anything
      const basePath = process.env.RESOURCE_PATH === undefined ? '/rhythm-finder' : process.env.RESOURCE_PATH;
      metronome.init(basePath);
    });
    let msTempo;
    if (tempo) {
      msTempo = 60000/tempo;
    } else {
      msTempo = 0;
    }
    const createMetStyle = (metronomeOn) => ({
      width: '100px',
      height: '100px',
      backgroundColor: '#000000',
      border: 'grey 1px solid',
      '-webkit-animation': metronomeOn ? `flickerAnimation ${msTempo}ms infinite` : '',
      '-moz-animation': metronomeOn ? `flickerAnimation ${msTempo}ms infinite` : '',
      '-o-animation': metronomeOn ? `flickerAnimation ${msTempo}ms infinite` : '',
      '-animation': metronomeOn ? `flickerAnimation ${msTempo}ms infinite` : '',
    });

    if (metronomeOn) {
      metronome.play(tempo);
    } else {
      metronome.stop();
    }
    if (msTempo !== 0) {
      return (
        <div style={createMetStyle(metronomeOn)}>
          <audio id="met">
            <source src="/rhythm-finder/metronome.mp3"/>
          </audio>
        </div>
      )
    }
    return (
      <div style={createMetStyle(metronomeOn)}></div>
    )
  }