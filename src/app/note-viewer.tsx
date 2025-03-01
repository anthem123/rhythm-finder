import PropTypes from 'prop-types';
import { formattedImages } from './utils/note-formatting'

export default function NoteViewer({
  rhythmList,
  maxBeatCount,
  maxBeatValue
}) {

  if (rhythmList.length === 0) {
    return <div></div>
  }

  return (
    <div className='note-viewer'>
      {formattedImages(rhythmList, maxBeatValue, maxBeatCount)}
    </div>
  )
}

NoteViewer.propTypes = {
  rhythmList: PropTypes.array.isRequired,
  maxBeatCount: PropTypes.number.isRequired,
  maxBeatValue: PropTypes.number.isRequired
}; 