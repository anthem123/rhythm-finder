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
import dottedEighthRest from './images/rest/dotted-eighth.png'
import quarterRest from './images/rest/quarter.png'
import halfRest from './images/rest/half.png'

import Two8ths from './images/rhythm/8-8.png'
import Four16ths from './images/rhythm/16-16-16-16.png'
import One8thTwo16ths from './images/rhythm/8-16-16.png'
import One8thRestTwo16ths from './images/rhythm/8r-16-16.png'
import Two16thsOne8th from './images/rhythm/16-16-8.png'
import One16thOne8thOne16th from './images/rhythm/16-8-16.png'
import Dotted8th16th from './images/rhythm/8d-16.png'
import One16thDotted8th from './images/rhythm/16-8d.png'
import One16thRestThree16ths from './images/rhythm/16r-16-16-16.png'
import One16thRestOne16thRepeat from './images/rhythm/16r-8-16.png'

import { checkBeatCombo } from './utils/note-combos'
import { nonNotes, getNoteValue } from './utils/beat-calc'

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

  const addBeatToMeasure = (beat, measure, fullScore) => {
    checkBeatCombo(beat);
    if (beat.rhythmCombo == undefined) {
      beat.subDivisions.forEach(sub => addSubDivisionToMeasure(JSON.parse(JSON.stringify(sub)), measure, fullScore));
    } else {
      addSubDivisionToMeasure(JSON.parse(JSON.stringify(beat)), measure, fullScore)
    }
  }

  const addSubDivisionToMeasure = (subdivision, measure, fullScore) => {
    const currentMeasureCount = getBeatCount(measure);
    if ((currentMeasureCount + subdivision.value) <= maxBeatCount) {
      measure.push(JSON.parse(JSON.stringify(subdivision)));
      if (getBeatCount(measure) === maxBeatCount) {
        fullScore.push(JSON.parse(JSON.stringify(measure)));
        measure.length = 0;
      }
    } else {
      const measureCountLeft = maxBeatCount - currentMeasureCount;
      measure.push({ type: subdivision.type, value: measureCountLeft });
      fullScore.push(JSON.parse(JSON.stringify(measure)));
      measure.length = 0;
      measure.push({ type: 'rest', value: subdivision.value - measureCountLeft});
    }
  }

  const formatRhythm = rhythmList => {
    const formattedRhythm = [];
    let measure = [];
    let beat = {
      value: 0,
      subDivisions: [],
    };
    for (const rhythm of rhythmList) {

      // If we have a value before or after the end of the countdown
      if (rhythm.startingValue && rhythm.startingValue > 0) {
        // If the value is before the end of the count down
        if (rhythm.pickUp) {
          let restToAdd = maxBeatCount - rhythm.startingValue;
          // Add full rests until we reach the note
          while (restToAdd >= maxBeatValue) {
            addSubDivisionToMeasure({ value: maxBeatValue, type: 'rest' }, measure, formattedRhythm);
            restToAdd -= maxBeatValue;
          }
          const noteValue = rhythm.diff !== 0 ? rhythm.noteValue : rhythm.startingValue;
          // If we have any extra rests, add them here then the note. Or just add the note
          if (restToAdd > 0) {
            beat.value = restToAdd + noteValue;
            beat.subDivisions.push({ type: 'rest', value: restToAdd });
            beat.subDivisions.push({ type: 'note', value: noteValue });
          } else {
            beat.value = noteValue;
            beat.subDivisions.push({ type: 'note', value: noteValue });
          }
        // If the starting note is after the end, add the rest first
        } else {
          beat.value = rhythm.startingValue;
          beat.subDivisions.push({ type: 'rest', value: rhythm.startingValue });
          beat.subDivisions.push({ type: 'note', value: rhythm.noteValue })
        }
        if (beat.value % maxBeatValue === 0) {
          addBeatToMeasure(beat, measure, formattedRhythm);
          beat = {
            value: 0,
            subDivisions: [],
          };
        }
        continue;
      }

      if (beat.value === 0 && !nonNotes.includes(rhythm.noteValue)) {
        beat.value = rhythm.noteValue;
        beat.subDivisions.push({ type: 'note', value: rhythm.noteValue });
        // If that beat is a full value add to measure
        if (beat.value % maxBeatValue === 0) {
          addBeatToMeasure(beat, measure, formattedRhythm);
          beat = {
            value: 0,
            subDivisions: [],
          };
        }
      }
      // If adding the next note creates a whole beat
      // Add all to the measure
      else if ((beat.value + rhythm.noteValue) % maxBeatValue === 0 && !nonNotes.includes(rhythm.noteValue)) {
        beat.value += rhythm.noteValue;
        beat.subDivisions.push({ type: 'note', value: rhythm.noteValue });
        addBeatToMeasure(beat, measure, formattedRhythm);
        beat = {
          value: 0,
          subDivisions: [],
        };
      } 
      // If adding the next note to the beat doesn't equal a full beat, just add it to the beat
      else if ((beat.value + rhythm.noteValue) < maxBeatValue) {
        beat.value += rhythm.noteValue
        beat.subDivisions.push({ type: 'note', value: rhythm.noteValue });
      }
      // The next note gives an odd value, split up the note
      else {
        let remainder = (beat.value + rhythm.noteValue) % maxBeatValue;
        // To account for non-notes adding up to a full beat
        // ei: .75 rest + 1.25 note adds to 2 but should be broken up
        // to .75 rest + .25 note + 1 rest
        if (remainder === 0 && (beat.value + rhythm.noteValue) > maxBeatValue) {
          remainder = beat.value + rhythm.noteValue - maxBeatValue;
        } 
        const newValue = rhythm.noteValue - remainder;
        beat.value += newValue;
        beat.subDivisions.push({ type: 'note', value: newValue});
        addBeatToMeasure(beat, measure, formattedRhythm);
        beat = {
          value: 0,
          subDivisions: [],
        };
        if (remainder > 0) {
          beat.value = remainder;
          beat.subDivisions.push({ type: 'rest', value: remainder });
          if (remainder % maxBeatValue === 0) {
            addBeatToMeasure(beat, measure, formattedRhythm);
            beat = {
              value: 0,
              subDivisions: [],
            };
          }
        }
      }
    }
    // Pad end of measure with rests
    if (beat.value > 0) {
      const beatLeft = maxBeatValue - beat.value;
      beat.subDivisions.push({ type: 'rest', value: beatLeft });
      beat.subDivisions.forEach(sub => measure.push(sub));
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
          return noteType === 'note' ? halfNote : halfRest;
        case 1.5:
          return dottedQuarterNote;
        case 1:
          return noteType === 'note' ? quarterNote : quarterRest;
        case .75:
          return noteType === 'note' ? dottedEighthNote : dottedEighthRest;
        case .5:
          return noteType === 'note' ? eighthNote : eighthRest;
        case .25:
          return noteType === 'note' ? sixteenthNote : sixteenthRest;
        default:
          return null;
      }
    }

    const noteStyleMappinig = (noteValue, noteType, rhythmCombo) => {
      switch (noteValue) {
        case 1.5:
        case .75:
          return {
            margin: '0 10px',
            height: 'auto',
            width: 'auto'
          };
        case 2:
          return {
            'margin-right': '25px',
            height: 'auto',
            width: 'auto'
          };
        default:
          if (rhythmCombo === '16-16-8'
            || rhythmCombo === '16-8-16') {
            return {
              height: 'auto',
              width: 'auto',
              margin: '0 10px',
            }
          }
          return {
            height: 'auto',
            width: 'auto'
          };
      }
    }

    const rhythmMapping = rhythm => {
      switch(rhythm) {
        case '8-8':
          return Two8ths;
        case '8r-8r':
          return quarterRest;
        case '8-8r':
          return quarterNote;
        case '16-16-16-16':
          return Four16ths;
        case '16r-16-16-16':
          return One16thRestThree16ths;
        case '16r-8-16':
          return One16thRestOne16thRepeat;
        case '8-16-16':
          return One8thTwo16ths;
        case '8r-16-16':
          return One8thRestTwo16ths;
        case '16-16-8':
          return Two16thsOne8th;
        case '16-8-16':
          return One16thOne8thOne16th;
        case '8d-16':
          return Dotted8th16th;
        case '16-8d':
          return One16thDotted8th;
        default:
          return quarterRest;
      }
    }

    const widthMapping = rhythm => {
      if (rhythm.rhythmCombo === '8d-16'
        || rhythm.rhythmCombo === '16-8d'
        || rhythm.rhythmCombo === '8r-16-16'
        || rhythm.rhythmCombo === '16r-8-16'
        || rhythm.rhythmCombo === '16r-16-16-16'
        || rhythm.rhythmCombo === '16-16-16-16') {
        return 50;
      }
      return 25;
    }

    const formattedImages = rhythmList => {
      console.log(rhythmList);
      const formattedRhythmList = formatRhythm(rhythmList);
      console.log(formattedRhythmList);
      return formattedRhythmList.map((measure, m_index) => {
        return <div key={`measure-${m_index}`} className='measure'>
          {measure.filter(note => note.value > 0).map((note, index) => {
            return <Image
              key={`image-${index}`}
              src={note.rhythmCombo ? rhythmMapping(note.rhythmCombo) : noteValueMapping(note.value, note.type)}
              alt='Note'
              width={widthMapping(note)}
              height={50}
              style={noteStyleMappinig(note.value, note.type, note.rhythmCombo)}
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