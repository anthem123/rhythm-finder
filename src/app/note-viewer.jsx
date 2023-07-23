import Image from 'next/image'
import quarterNote from './images/note/quarter.png'
import eighthNote from './images/note/eighth.png'
import sixteenthNote from './images/note/sixteenth.png'

export default function NoteViewer({
  rhythmList
  }) {

    const noteValueMapping = noteValue => {
      switch (noteValue) {
        case 1:
          return quarterNote;
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
      .map((rhythm, index) => (
        <Image
          key={`image-${index}`}
          src={noteValueMapping(rhythm.noteValue)}
          alt='Note'
          width={25}
          height={50}
        />
      ));

    if (rhythmList.length === 0) {
      return <div></div>
    }
    return (
      <div className='note-viewer'>
        {images}
      </div>
    )
  }