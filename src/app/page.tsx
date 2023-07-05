'use client'

import React, { useState, useEffect } from 'react';
import Metronome from './metronome'

export default function Home() {
  const [tempo, setTempo] = useState();
  const [metronomeOn, setMetronomeOn] = useState(false);
  const [metronomeText, setMetronomeText] = useState('Start Metronome');
  const [rhythm, setRhythm] = useState([]);

  const startMetronome = () => {
    if (metronomeOn) {
      setMetronomeOn(false);
      setMetronomeText("Start Metronome");
    } else {
      setMetronomeOn(true);
      setMetronomeText("Stop Metronome");
    }
  }

  const onTempoChange = textBox => {
    setTempo(textBox.target.value);
  }

  const getNoteValue = duration => {
    const quarterNoteMs = 60000/tempo;
    console.log(`Quarter Note ms = ${quarterNoteMs}`)

    if (duration >= quarterNoteMs * 4 * .8 && duration <= quarterNoteMs * 4 * 1.2) {
      return 'whole';
    } else if (duration >= quarterNoteMs * 2 * .8 && duration <= quarterNoteMs * 2 * 1.2) {
      return 'half';
    } else if (duration >= quarterNoteMs * 1.5 * .8 && duration <= quarterNoteMs * 1.5 * 1.2) {
      return 'dotted-quarter';
    } else if (duration >= quarterNoteMs * .8 && duration <= quarterNoteMs * 1.2) {
      return 'quarter';
    } else if (duration >= quarterNoteMs * .75 * .8 && duration <= quarterNoteMs * .75 * 1.2) {
      return 'dotted-eigth'
    }  else if (duration >= quarterNoteMs/2 * .8 && duration <= quarterNoteMs/2 * 1.2) {
      return 'eigth'
    } else if (duration >= quarterNoteMs/4 * .8 && duration <= quarterNoteMs/4 * 1.2) {
      return 'sixteenth'
    }
    return 'other';
  }

  const addRhythm = () => {
    if (rhythm.length === 0) {
      setRhythm([
        ...rhythm,
        { start: new Date().getTime(), diff: 0, noteValue: "quarter" }
      ]);
    } else {
      const newTime = new Date().getTime();
      const prevNote = rhythm[rhythm.length - 1];
      const diff = newTime - prevNote.start;
      rhythm[rhythm.length - 1].diff = diff;
      rhythm[rhythm.length - 1].noteValue = getNoteValue(diff);
      setRhythm([
        ...rhythm,
        { start: newTime }
      ]);
    }
    
    console.log(rhythm);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <h1>Set Your Tempo (bpm)</h1>
        <input value={tempo} onChange={onTempoChange}></input>
        <button onClick={startMetronome}>{metronomeText}</button>
      </div>
      <Metronome
        metronomeOn={metronomeOn}
        tempo={tempo}
      />
      <div>
        <button className="border-black border-2 m-4 p-2" onClick={addRhythm}>Tap</button>
        <button className="border-black border-2 m-4 p-2">Finish</button>
      </div>
    </main>
  )
}
