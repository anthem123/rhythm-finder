import Image from 'next/image'
import wholeNote from './images/note/whole.png'
import dottedHalfNote from './images/note/dotted-half.png'
import halfNote from './images/note/half.png'
import dottedQuarterNote from './images/note/dotted-quarter.png'
import quarterNote from './images/note/quarter.png'
import dottedEighthNote from './images/note/dotted-eighth.png'
import eighthNote from './images/note/eighth.png'
import sixteenthNote from './images/note/sixteenth.png'

import sixteenthRest from './images/rest/sixteenth.png'
import eighthRest from './images/rest/eighth.png'
import quarterRest from './images/rest/quarter.png'

export default function NoteViewer({
  rhythmList,
  maxBeatCount,
  maxBeatValue
  }) {

    const getBeatCount = measure => {
      let value = 0;
      measure.forEach(sub => value += sub.value);
      return value;
    }

  const addBeatToMeasure = (subdivision, measure, fullScore) => {
    const currentMeasureCount = getBeatCount(measure);
    if ((currentMeasureCount + subdivision.value) <= maxBeatCount) {
      measure.push(JSON.parse(JSON.stringify(subdivision)));
      if (getBeatCount(measure) === maxBeatCount) {
        fullScore.push(JSON.parse(JSON.stringify(measure)));
        measure.length = 0;
      }
    } else {
      const measureCountLeft = maxBeatCount - currentMeasureCount;
      measure.push({ type: 'note', value: measureCountLeft });
      fullScore.push(JSON.parse(JSON.stringify(measure)));
      measure.length = 0;
      measure.push({ type: 'rest', value: subdivision.value - measureCountLeft});
    }
  }

  const formatRhythm = rhythmList => {
    const formattedRhythm = [];
    let measure = [];
    let beat = [];
    for (const rhythm of rhythmList) {
      const currentBeatValue = getBeatCount(beat);
      // Empty beat, add note
      if (currentBeatValue === 0) {
        beat.push({ type: 'note', value: rhythm.noteValue });
        // If that beat is a full value add to measure
        if (rhythm.noteValue % maxBeatValue === 0) {
          addBeatToMeasure(JSON.parse(JSON.stringify(beat[0])), measure, formattedRhythm);
          beat.length = 0;
        }
      }
      // If adding the next note creates a whole beat
      // Add all to the measure
      else if ((currentBeatValue + rhythm.noteValue) % maxBeatValue === 0) {
        beat.push({ type: 'note', value: rhythm.noteValue });
        beat.forEach(sub => addBeatToMeasure(JSON.parse(JSON.stringify(sub)), measure, formattedRhythm));
        beat.length = 0;
      } 
      // If adding the next note to the beat doesn't equal a full beat, just add it to the beat
      else if ((currentBeatValue + rhythm.noteValue) < maxBeatValue) {
        beat.push({ type: 'note', value: rhythm.noteValue });
      }
      // The next note gives an odd value, split up the note
      else {
        const remainder = (currentBeatValue + rhythm.noteValue) % maxBeatValue;
        beat.push({ type: 'note', value: rhythm.noteValue - remainder});
        beat.forEach(sub => addBeatToMeasure(JSON.parse(JSON.stringify(sub)), measure, formattedRhythm));
        beat.length = 0;
        beat.push({ type: 'rest', value: remainder });
      }
    }
    // Pad end of measure with rests
    if (beat.length > 0) {
      const beatLeft = maxBeatValue - getBeatCount(beat);
      beat.push({ type: 'rest', value: beatLeft });
      beat.forEach(sub => measure.push(sub));
    }

    if (measure.length > 0) {
      while (getBeatCount(measure) < maxBeatValue * maxBeatCount) {
        measure.push({ type: 'rest', value: maxBeatValue });
      }
      formattedRhythm.push(measure);
    }

    return formattedRhythm;
  }

    const noteValueMapping = (noteValue, noteType) => {
      switch (noteValue) {
        case 4:
          return wholeNote;
        case 3:
          return dottedHalfNote;
        case 2:
          return halfNote;
        case 1.5:
          return dottedQuarterNote;
        case 1:
          return noteType === 'note' ? quarterNote : quarterRest;
        case .75:
          return dottedEighthNote;
        case .5:
          return noteType === 'note' ? eighthNote : eighthRest;
        case .25:
          return noteType === 'note' ? sixteenthNote : sixteenthRest;
        default:
          return null;
      }
    }

    const noteStyleMappinig = (noteValue, noteType) => {
      switch (noteValue) {
        case 1.5:
        case .75:
          return {
            margin: '0 10px',
          };
        case 2:
          return {
            'margin-right': '25px',
          };
        default:
          return {};
      }
    }

    const formattedImages = rhythmList => {
      const formattedRhythmList = formatRhythm(rhythmList);
      return formattedRhythmList.map((measure, m_index) => {
        return <div key={`measure-${m_index}`} className='measure'>
          {measure.map((note, index) => {
            return <Image
              key={`image-${index}`}
              src={noteValueMapping(note.value, note.type)}
              alt='Note'
              width={25}
              height={50}
              style={noteStyleMappinig(note.value, note.type)}
            />
          })}
        </div>
      })
    }

    if (rhythmList.length === 0) {
      return <div></div>
    }

    return (
      <div className='note-viewer'>
        {formattedImages(rhythmList)}
      </div>
    )
  }