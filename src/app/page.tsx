'use client'

import React, { useState, useEffect } from 'react';
import MetronomeView from './metronome-view';
import MetronomeSelecter from './metronome-selecter';
import NoteViewer from './note-viewer';
import { getNoteValue } from './utils/beat-calc'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons'
import metronomeUtil from './metronome/metronome-util'
import Footer from './footer';
import CountDown from './count-down';

export default function Home() {
  const playIcon = <FontAwesomeIcon icon={faPlay} />;
  const pauseIcon = <FontAwesomeIcon icon={faPause} />;

  const [beatValue, setBeatValue] = useState(1);
  const [beatCount, setBeatCount] = useState(4);
  const [startTime, setStartTime]= useState(0);
  const [tempo, setTempo] = useState('100');
  const [rhythm, setRhythm] = useState<any[]>([]);
  const [newRhythm, setNewRhythm] = useState(true);
  const [displayMetModal, setDisplayMetModal] = useState(false);
  const [metronomeOn, setMetronomeOn] = useState(false);
  const [metronomeText, setMetronomeText] = useState(playIcon);

  useEffect(() => {
    // call api or anything
    const basePath = process.env.NEXT_PUBLIC_RESOURCE_PATH ?? '/rhythm-finder'
    metronomeUtil.init(basePath);
  });

  const addRhythm = () => {
    if (newRhythm) {
      const currentTime = new Date().getTime();
      let startingRest = currentTime - startTime - 100;
      let startingValue;
      let pickUp = false;
      if ((Math.abs(startingRest) >= ((60000/parseInt(tempo)) * .25))) {
          startingValue = getNoteValue(Math.abs(startingRest), parseInt(tempo));
          if (startingRest < 0) {
            pickUp = true;
          }
      }
      setRhythm([
        { noteTime: currentTime, startingValue, pickUp, diff: 0, noteValue: 1 }
      ]);
      setNewRhythm(false);
    } else {
      const newTime = new Date().getTime();
      const prevNote = rhythm[rhythm.length - 1];
      const diff = newTime - prevNote.noteTime;
      prevNote.diff = diff;
      prevNote.noteValue = getNoteValue(diff, tempo);
      setRhythm([
        ...rhythm,
        { noteTime: newTime, diff: 0, noteValue: 1 }
      ]);
    }
  }

  const toggleMetronome = () => {
    if (metronomeOn) {
      setMetronomeOn(false);
      setMetronomeText(playIcon);
      setNewRhythm(true);

      metronomeUtil.stop();
    } else {
      setMetronomeOn(true);
      setMetronomeText(pauseIcon);

      const starting = metronomeUtil.play(tempo);
      setStartTime(starting);
    }
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
      <MetronomeView
        tempo={tempo}
        setTempo={setTempo}
        metronomeOn={metronomeOn}
        toggleMetronome={toggleMetronome}
        displayMetModal={displayMetModal}
        onClose={onMetModalSelect}
      />
      <CountDown 
        metronomeOn={metronomeOn}
        tempo={tempo}
      />
      <NoteViewer
        rhythmList={rhythm}
        maxBeatCount={beatCount}
        maxBeatValue={beatValue}
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
