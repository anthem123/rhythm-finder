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

  if (rhythmList.length === 0) {
    return <div></div>
  }

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
    renderer.resize(400, 400);
    const context = renderer.getContext();
    context.setFont("Arial", 10, "").setBackgroundFillStyle("#fff");

    const formattedRhythm = formatRhythm(rhythmList, maxBeatValue, maxBeatCount);
    const measureCount = formattedRhythm.length;
    console.log(formattedRhythm);
    let position = 40;
    let firstLoop = true;
    for (const measure of formattedRhythm) {
      // Create a stave
      const stave: Stave = new Stave(10, position, 300);
      if (firstLoop) {
        stave.addTimeSignature("4/4");
        firstLoop = false;
      }
      
      stave.setContext(context).draw();
      // staves.push(stave as Stave);
      // Gather notes for measure
      const measureNotes: Array<StaveNote> = [];
      for (const beat of measure) {
        if (beat.subDivisions) {
          for (const subDivision of beat.subDivisions) {
            measureNotes.push(new StaveNote({
              keys: ["f/4"],
              duration: convertValueToVexValue(subDivision.value, subDivision.type),
            }))
          }
        } else {
          measureNotes.push(new StaveNote({
            keys: ["f/4"],
            duration: convertValueToVexValue(beat.value, beat.type),
          }))
        }
      }
      // Add notes to stave
      const voice = new Voice({ num_beats: 4, beat_value: 4 });
      voice.addTickables(measureNotes);
      new Formatter().joinVoices([voice]).format([voice], 250);
      voice.draw(context, stave);

      position += 50;
    };
  }, [rhythmList]);

  return <div className='note-viewer' ref={containerRef}></div>;
}

NoteViewer.propTypes = {
  rhythmList: PropTypes.array.isRequired,
  maxBeatCount: PropTypes.number.isRequired,
  maxBeatValue: PropTypes.number.isRequired
}; 