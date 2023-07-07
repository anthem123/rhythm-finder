'use client'

import React, { useState, useEffect } from 'react';
import Metronome from './metronome';
import NoteViewer from './note-viewer';
import TempoSlider from './tempo-slider';

export default function Home() {
  const [tempo, setTempo] = useState('100');
  const [metronomeOn, setMetronomeOn] = useState(false);
  const [metronomeText, setMetronomeText] = useState('Start Metronome');
  const [rhythm, setRhythm] = useState<any[]>([]);
  const [newRhythm, setNewRhythm] = useState(true);

  const toggleMetronome = () => {
    if (metronomeOn) {
      setMetronomeOn(false);
      setMetronomeText("Start Metronome");
      setNewRhythm(true);
    } else {
      setMetronomeOn(true);
      setMetronomeText("Finish");
    }
  }

  const onTempoChange = textBox => {
    setTempo(textBox.target.value);
  }

  const getNoteValue = (duration) => {
    if (tempo === undefined) {
      return 'null';
    }
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
      return 'dotted-eighth'
    }  else if (duration >= quarterNoteMs *.5 * .8 && duration <= quarterNoteMs * .5 * 1.2) {
      return 'eighth'
    } else if (duration >= quarterNoteMs * .25 * .8 && duration <= quarterNoteMs * .25 * 1.2) {
      return 'sixteenth'
    }
    return 'other';
  }

  const addRhythm = () => {
    if (newRhythm) {
      setRhythm([
        { start: new Date().getTime(), diff: 0, noteValue: "quarter" }
      ]);
      setNewRhythm(false);
    } else {
      const newTime = new Date().getTime();
      const prevNote = rhythm[rhythm.length - 1];
      const diff = newTime - prevNote.start;
      prevNote.diff = diff;
      prevNote.noteValue = getNoteValue(diff);
      setRhythm([
        ...rhythm,
        { start: newTime, diff: 0, noteValue: "quarter" }
      ]);
    }
    
    console.log(rhythm);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <h1>Set Your Tempo (bpm)</h1>
        <input className="tempo-input" value={tempo} onChange={onTempoChange}></input>
        <button className="clickable-button" onClick={toggleMetronome}>{metronomeText}</button>
        <TempoSlider
          tempo={tempo}
          setTempo={setTempo}
        />
      </div>
      <Metronome
        metronomeOn={metronomeOn}
        tempo={tempo}
      />
      <NoteViewer
        rhythmList={rhythm}
      />
      <div>
        <button className="clickable-button tap-input-button" onClick={addRhythm}>Tap Rhythm Here!</button>
      </div>
    </main>
  )
}
