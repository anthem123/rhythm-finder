import Image from 'next/image'
import wholeNote from './images/note/whole.png'
import dottedHalfNote from './images/note/dotted-half.png'
import halfNote from './images/note/half.png'
import dottedQuarterNote from './images/note/dotted-quarter.png'
import quarterNote from './images/note/quarter.png'
import dottedEighthNote from './images/note/dotted-eighth.png'
import eighthNote from './images/note/eighth.png'
import sixteenthNote from './images/note/sixteenth.png'

export default function NoteViewer({
  rhythmList,
  beatCount,
  beatValue
  }) {

    const getBeatValue = beat => {
      let value = 0;
      beat.forEach(sub => value += sub.value);
      return value;
    }

  const formatRhythm = rhythmList => {
    const formattedRhythm = [];
    let leftOverValue = 0;
    let beat = [];
    console.log(rhythmList.length);
    for (const rhythm of rhythmList) {
      console.log(rhythm);
      if (leftOverValue > 0) {
        // If the previous leftOverValue is >= the beatValue
        // Add quarter rests until we have a note
        while (leftOverValue >= beatValue) {
          formattedRhythm.push([{ type: 'rest', value: beatValue }]);
          leftOverValue = leftOverValue - beatValue;
        }
        // Now that we have a leftOverValue less than a beatValue
        // Add a rest to prepare for the note
        if (leftOverValue > 0) {
          beat.push({ type: 'rest', value: leftOverValue });
          leftOverValue = 0;
        }
      }
      const currentBeatValue = getBeatValue(beat);
      // If we currently have a rest in the beat
      // We only want to add a note that fills the rest of the beat
      if (currentBeatValue > 0) {
        const beatValueLeft = beatValue - currentBeatValue;
        // If the currentNoteValue is greater than the beatValue we have left
        // Add beatValueLeft to the beat
        // assign rest of value to leftOverValue
        if (rhythm.noteValue > beatValueLeft) {
          beat.push({type: 'note', value: beatValueLeft});
          leftOverValue = rhythm.noteValue - beatValueLeft;
          formattedRhythm.push(beat);
          beat = [];
        }
        // Add note to beat
        else {
          beat.push({ type: 'note', value: rhythm.noteValue});
          // If beat is full add to list
          if (getBeatValue(beat) === beatValue) {
            formattedRhythm.push(beat);
            beat = [];
          }
        }
      }
      // If the noteValue is greater the beatValue
      // Set noteValue up to value of beatCount
      // Everything else is set to leftOverValue
      else if (rhythm.noteValue > beatValue) {
        if (rhythm.noteValue > beatCount) {
          formattedRhythm.push([{ type: 'note', value: rhythm.beatCount }]);
          leftOverValue = rhythm.noteValue > beatCount;
        } else {
          formattedRhythm.push([{ type: 'note', value: rhythm.noteValue }]);
        }    
      }
      // Just add the note
      else {
        beat.push({ type: 'note', value: rhythm.noteValue });
        if (getBeatValue(beat) === beatValue) {
          formattedRhythm.push(beat);
          beat = [];
        }
      }
    }

    return formattedRhythm;
  }

    const noteValueMapping = noteValue => {
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
          return quarterNote;
        case .75:
          return dottedEighthNote;
        case .5:
          return eighthNote
        case .25:
          return sixteenthNote;
        default:
          return null;
      }
    }

    const images = rhythmList
      .filter(rhythm => rhythm.noteValue !== undefined)
      .map((rhythm, index) => {
        if (rhythm.noteValue === 1.5 || rhythm.noteValue === .75) {
          return <Image
            key={`image-${index}`}
            src={noteValueMapping(rhythm.noteValue)}
            alt='Note'
            width={25}
            height={50}
            style={{
              margin: '0 10px',
            }}
          />
        } else {
          return <Image
            key={`image-${index}`}
            src={noteValueMapping(rhythm.noteValue)}
            alt='Note'
            width={25}
            height={50}
          />
        }
      });

    if (rhythmList.length === 0) {
      return <div></div>
    }
    console.log(formatRhythm(rhythmList));
    return (
      <div className='note-viewer'>
        {images}
      </div>
    )
  }