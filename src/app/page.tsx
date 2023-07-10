'use client'

import React, { useState, useEffect } from 'react';
import Metronome from './metronome-view';
import NoteViewer from './note-viewer';

export default function Home() {
  const [tempo, setTempo] = useState('100');
  const [rhythm, setRhythm] = useState<any[]>([]);
  const [newRhythm, setNewRhythm] = useState(true);

  const getNoteValue = (duration) => {
    if (tempo === undefined) {
      return 'null';
    }
    const quarterNoteMs = 60000/parseInt(tempo);
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
      <Metronome
        tempo={tempo}
        setTempo={setTempo}
        setNewRhythm={setNewRhythm}
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
