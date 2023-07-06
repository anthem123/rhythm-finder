import Image from 'next/image'

export default function NoteViewer({
  rhythmList
  }) {
    const images = rhythmList.map((rhythm, index) => (
      <Image
        key={`image-${index}`}
        src={`/notes/${rhythm.noteValue}.png`}
        alt='Text'
        width={50}
        height={100}
      />
    ));

    return (
      <div className='flex h-16'>
        {images}
      </div>
    )
  }