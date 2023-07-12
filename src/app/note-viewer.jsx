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
    
    const noteWidthMapping = noteValue => {
      switch (noteValue) {
        case 1:
          return 50;
        case .5:
          return 50;
        case .25:
          return 50;
        default:
          return 0;
      }
    }

    const srcDirectory = process.env.NEXT_PUBLIC_RESOURCE_PATH === undefined 
      ? '/rhythm-finder/notes/' : `${process.env.NEXT_PUBLIC_RESOURCE_PATH}/notes/`;
    const images = rhythmList
      .filter(rhythm => rhythm.noteValue !== undefined)
      .map((rhythm, index) => (
        <Image
          key={`image-${index}`}
          src={noteValueMapping(rhythm.noteValue)}
          alt='Note'
          width={noteWidthMapping(rhythm.noteValue)}
          height={100}
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