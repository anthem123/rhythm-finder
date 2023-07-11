import Image from 'next/image'

export default function NoteViewer({
  rhythmList
  }) {

    const noteValueMapping = noteValue => {
      switch (noteValue) {
        case 1:
          return 'quarter';
        case .5:
          return 'eighth'
        case .25:
          return 'sixteenth';
        default:
          'null';
      }
    }
    
    const noteWidthMapping = noteValue => {
      switch (noteValue) {
        case 1:
          return 50;
        case .5:
          return 100;
        case .25:
          return 50;
        default:
          0;
      }
    }

    const basePath = process.env.NEXT_PUBLIC_RESOURCE_PATH === undefined ? '/rhythm-finder' : process.env.NEXT_PUBLIC_RESOURCE_PATH;
    const images = rhythmList
      .filter(rhythm => rhythm.noteValue !== undefined)
      .map((rhythm, index) => (
        <Image
          key={`image-${index}`}
          src={`${basePath}/notes/${noteValueMapping(rhythm.noteValue)}.png`}
          alt='Text'
          width={50}
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