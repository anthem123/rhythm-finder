'use client'

import React, { useState, useEffect } from 'react';
import Metronome from './metronome';
import NoteViewer from './note-viewer';

export default function Home() {
  const [tempo, setTempo] = useState();
  const [metronomeOn, setMetronomeOn] = useState(false);
  const [metronomeText, setMetronomeText] = useState('Start Metronome');
  const [rhythm, setRhythm] = useState<any[]>([]);
  const [newRhythm, setNewRhythm] = useState(true);

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

  const getNoteValue = (duration) => {
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

  const finishRhythm = () => {
    setMetronomeOn(false);
    setMetronomeText("Start Metronome");
    setNewRhythm(true);
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
      <NoteViewer
        rhythmList={rhythm}
      />
      <div>
        <button className="border-black border-2 m-4 p-2" onClick={addRhythm}>Tap</button>
        <button className="border-black border-2 m-4 p-2" onClick={finishRhythm}>Finish</button>
      </div>
    </main>
  )
}
