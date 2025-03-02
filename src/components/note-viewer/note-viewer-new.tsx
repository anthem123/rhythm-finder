import './note-viewer.css';
import PropTypes from 'prop-types';
import React, { useEffect, useRef } from "react";
import { Renderer, Stave, StaveNote, Voice, Formatter } from "vexflow";
import { formatRhythm } from '@/utils/beat-calc';

const convertValueToVexValue = (noteValue, noteType) => {
  switch (noteValue) {
    case 1:
      return noteType === 'rest' ? 'qr' : 'q';
    case .5:
      return noteType === 'rest' ? '8r' : '8';
    default:
      throw new Error(`Unsupported note value: ${noteValue}`);
  }
}

export default function NoteViewer({
  rhythmList,
  maxBeatCount,
  maxBeatValue
}) {

  // if (rhythmList.length === 0) {
  //   return <div></div>
  // }

  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    } else {
      // @ts-ignore
      containerRef.current.innerHTML = '';
    }

    // Create a renderer attached to the container
    const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
    renderer.resize(400, 150);
    const context = renderer.getContext();
    context.setFont("Arial", 10, "").setBackgroundFillStyle("#fff");

    // Create a stave
    const stave = new Stave(10, 40, 300);
    stave.addTimeSignature("4/4");
    stave.setContext(context).draw();

    const formattedRhythm = formatRhythm(rhythmList, maxBeatValue, maxBeatCount);
    const measureCount = formattedRhythm.length;
    console.log(formattedRhythm);

    const allNotes = [];
    formattedRhythm.forEach(measure => {
      // @ts-ignore
      measure.forEach(beat => {
        if (beat.subDivisions) {
          beat.subDivisions.forEach(subDivision => {
            // @ts-ignore
            allNotes.push(new StaveNote({
              keys: ["f/4"],
              duration: convertValueToVexValue(subDivision.value, subDivision.type),
            }))
          })
        } else {
          // @ts-ignore
          allNotes.push(new StaveNote({
            keys: ["f/4"],
            duration: convertValueToVexValue(beat.value, beat.type),
          }))
        }
      });
    });

    console.log(allNotes)

    // Create notes
    const notes = [
      new StaveNote({ keys: ["f/4"], duration: "q" }),
      new StaveNote({ keys: ["f/4"], duration: "q" }),
      new StaveNote({ keys: ["f/4"], duration: "q" }),
      new StaveNote({ keys: ["f/4"], duration: "q" }),
    ];

    if (allNotes.length === 0) {
      return;
    }
    // Create a voice in 4/4 and add the notes
    const voice = new Voice({ num_beats: 4, beat_value: 4 });
    voice.addTickables(allNotes);

    // Format and justify the notes to fit in the stave
    new Formatter().joinVoices([voice]).format([voice], 250);

    // Render the voice
    voice.draw(context, stave);
  }, [rhythmList]);

  return <div className='note-viewer' ref={containerRef}></div>;
}

NoteViewer.propTypes = {
  rhythmList: PropTypes.array.isRequired,
  maxBeatCount: PropTypes.number.isRequired,
  maxBeatValue: PropTypes.number.isRequired
}; 