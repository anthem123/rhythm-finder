'use client'

import React, { useState, useEffect } from 'react';
import Metronome from './metronome-view';
import NoteViewer from './note-viewer';
import { getNoteValue } from './utils/beat-calc'

export default function Home() {
  const [tempo, setTempo] = useState('100');
  const [rhythm, setRhythm] = useState<any[]>([]);
  const [newRhythm, setNewRhythm] = useState(true);

  const addRhythm = () => {
    if (newRhythm) {
      setRhythm([
        { start: new Date().getTime(), diff: 0, noteValue: 1 }
      ]);
      setNewRhythm(false);
    } else {
      const newTime = new Date().getTime();
      const prevNote = rhythm[rhythm.length - 1];
      const diff = newTime - prevNote.start;
      prevNote.diff = diff;
      prevNote.noteValue = getNoteValue(diff, tempo);
      setRhythm([
        ...rhythm,
        { start: newTime, diff: 0, noteValue: 1 }
      ]);
    }
    
    console.log(rhythm);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8">
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
