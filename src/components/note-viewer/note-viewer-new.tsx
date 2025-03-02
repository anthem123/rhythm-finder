import './note-viewer.css';
import PropTypes from 'prop-types';
import React, { useEffect, useRef } from "react";
import { Renderer, Stave, StaveNote, Voice, Formatter, Dot } from "vexflow";
import { formatRhythm } from '@/utils/beat-calc';

const convertValueToVexValue = (noteValue, noteType) => {
  switch (noteValue) {
    case 4:
      return noteType === 'rest' ? 'wr' : 'w';
    case 3:
      return noteType === 'rest' ? 'hdr' : 'hd';
    case 2:
      return noteType === 'rest' ? 'hr' : 'h';
    case 1.5:
      return noteType === 'rest' ? 'qdr' : 'qd';
    case 1:
      return noteType === 'rest' ? 'qr' : 'q';
    case .75:
      return noteType === 'rest' ? '8dr' : '8d';
    case .5:
      return noteType === 'rest' ? '8r' : '8';
    case .25:
      return noteType === 'rest' ? '16r' : '16';
    default:
      throw new Error(`Unsupported note value: ${noteValue}`);
  }
}

const createStaveNote = beat => {
  const staveNote = new StaveNote({
    keys: ["f/4"],
    duration: convertValueToVexValue(beat.value, beat.type),
  });
  if (beat.value === .75) {
    Dot.buildAndAttach([staveNote], { all: true }); 
  }
  return staveNote;
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
    // const measureCount = formattedRhythm.length;
    console.log(rhythmList);
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
            measureNotes.push(createStaveNote(subDivision))
          }
        } else {
          measureNotes.push(createStaveNote(beat))
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