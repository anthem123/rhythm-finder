import Image from 'next/image'

export default function NoteViewer({
  rhythmList
  }) {
    const basePath = process.env.IMAGE_PATH === undefined ? '/rhythm-finder' : process.env.IMAGE_PATH;
    const images = rhythmList.map((rhythm, index) => (
      <Image
        key={`image-${index}`}
        src={`${basePath}/notes/${rhythm.noteValue}.png`}
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