'use client'

import React, { useState, useEffect } from 'react';
import Metronome from './metronome-view';
import MetronomeSelecter from './metronome-selecter';
import NoteViewer from './note-viewer';
import { getNoteValue } from './utils/beat-calc'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons'
import metronomeUtil from './metronome/metronome-util'
import Footer from './footer';

export default function Home() {
  const playIcon = <FontAwesomeIcon icon={faPlay} />;
  const pauseIcon = <FontAwesomeIcon icon={faPause} />;

  const [beatValue, setBeatValue] = useState(1);
  const [beatCount, setBeatCount] = useState(4);
  const [tempo, setTempo] = useState('100');
  const [rhythm, setRhythm] = useState<any[]>([]);
  const [newRhythm, setNewRhythm] = useState(true);
  const [displayMetModal, setDisplayMetModal] = useState(false);
  const [metronomeOn, setMetronomeOn] = useState(false);
  const [metronomeText, setMetronomeText] = useState(playIcon);

  useEffect(() => {
    // call api or anything
    const basePath = process.env.NEXT_PUBLIC_RESOURCE_PATH === undefined ? '/rhythm-finder' : process.env.NEXT_PUBLIC_RESOURCE_PATH;
    metronomeUtil.init(basePath);
  });

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
    
    // console.log(rhythm);
  }

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

  const onMetModalSelect = () => {
    setDisplayMetModal(!displayMetModal);
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <MetronomeSelecter 
        tempo={tempo}
        onSelect={onMetModalSelect}
      />
      <Metronome
        tempo={tempo}
        setTempo={setTempo}
        metronomeOn={metronomeOn}
        toggleMetronome={toggleMetronome}
        displayMetModal={displayMetModal}
        onClose={onMetModalSelect}
      />
      <NoteViewer
        rhythmList={rhythm}
        beatCount={beatCount}
        beatValue={beatValue}
      />
      <Footer 
        tempo={tempo}
        metronomeText={metronomeText}
        metronomeOn={metronomeOn}
        toggleMetronome={toggleMetronome}
        addRhythm={addRhythm}
      />
    </main>
  )
}
