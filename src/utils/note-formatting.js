import Image from "next/image";

import wholeNote from "../app/images/note/whole.png";
import dottedHalfNote from "../app/images/note/dotted-half.png";
import halfNote from "../app/images/note/half.png";
import dottedQuarterNote from "../app/images/note/dotted-quarter.png";
import quarterNote from "../app/images/note/quarter.png";
import dottedEighthNote from "../app/images/note/dotted-eighth.png";
import eighthNote from "../app/images/note/eighth.png";
import sixteenthNote from "../app/images/note/sixteenth.png";

import sixteenthRest from "../app/images/rest/sixteenth.png";
import eighthRest from "../app/images/rest/eighth.png";
import dottedEighthRest from "../app/images/rest/dotted-eighth.png";
import quarterRest from "../app/images/rest/quarter.png";
import halfRest from "../app/images/rest/half.png";

import Two8ths from "../app/images/rhythm/8-8.png";
import Four16ths from "../app/images/rhythm/16-16-16-16.png";
import One8thTwo16ths from "../app/images/rhythm/8-16-16.png";
import One8thRestTwo16ths from "../app/images/rhythm/8r-16-16.png";
import Two16thsOne8th from "../app/images/rhythm/16-16-8.png";
import One16thOne8thOne16th from "../app/images/rhythm/16-8-16.png";
import Dotted8th16th from "../app/images/rhythm/8d-16.png";
import One16thDotted8th from "../app/images/rhythm/16-8d.png";
import One16thRestThree16ths from "../app/images/rhythm/16r-16-16-16.png";
import One16thRestOne16thRepeat from "../app/images/rhythm/16r-8-16.png";
import One16thRestOne16thOne8th from "../app/images/rhythm/16r-16-8.png";

import { formatRhythm } from "./beat-calc";

const noteValueMapping = (noteValue, noteType) => {
  switch (noteValue) {
    case 4:
      return wholeNote;
    case 3:
      return dottedHalfNote;
    case 2:
      return noteType === "note" ? halfNote : halfRest;
    case 1.5:
      return dottedQuarterNote;
    case 1:
      return noteType === "note" ? quarterNote : quarterRest;
    case 0.75:
      return noteType === "note" ? dottedEighthNote : dottedEighthRest;
    case 0.5:
      return noteType === "note" ? eighthNote : eighthRest;
    case 0.25:
      return noteType === "note" ? sixteenthNote : sixteenthRest;
    default:
      return null;
  }
};

const noteStyleMappinig = (noteValue, noteType, rhythmCombo) => {
  switch (noteValue) {
    case 1.5:
    case 0.75:
      return {
        margin: "0 10px",
        height: "auto",
        width: "auto",
      };
    case 2:
      return {
        marginRight: "25px",
        height: "auto",
        width: "auto",
      };
    default:
      if (rhythmCombo === "16-16-8" || rhythmCombo === "16-8-16") {
        return {
          height: "auto",
          width: "auto",
          margin: "0 10px",
        };
      }
      return {
        height: "auto",
        width: "auto",
      };
  }
};

const rhythmMapping = (rhythm) => {
  switch (rhythm) {
    case "8-8":
      return Two8ths;
    case "8r-8r":
      return quarterRest;
    case "8-8r":
      return quarterNote;
    case "16-16-16-16":
      return Four16ths;
    case "16r-16-16-16":
      return One16thRestThree16ths;
    case "16r-8-16":
      return One16thRestOne16thRepeat;
    case "8-16-16":
      return One8thTwo16ths;
    case "8r-16-16":
      return One8thRestTwo16ths;
    case "16-16-8":
      return Two16thsOne8th;
    case "16-8-16":
      return One16thOne8thOne16th;
    case "8d-16":
      return Dotted8th16th;
    case "16-8d":
      return One16thDotted8th;
    case "16r-16-8":
      return One16thRestOne16thOne8th;
    default:
      return quarterRest;
  }
};

const widthMapping = (rhythm) => {
  if (
    rhythm.rhythmCombo === "8d-16" ||
    rhythm.rhythmCombo === "16-8d" ||
    rhythm.rhythmCombo === "8r-16-16" ||
    rhythm.rhythmCombo === "16r-8-16" ||
    rhythm.rhythmCombo === "16r-16-16-16" ||
    rhythm.rhythmCombo === "16-16-16-16" ||
    rhythm.rhythmCombo === "16r-16-8"
  ) {
    return 50;
  }
  return 25;
};

export const formattedImages = (rhythmList, maxBeatValue, maxBeatCount) => {
  // console.log(rhythmList);
  const formattedRhythmList = formatRhythm(
    rhythmList,
    maxBeatValue,
    maxBeatCount,
  );
  // console.log(formattedRhythmList);
  return formattedRhythmList.map((measure, m_index) => {
    return (
      <div key={`measure-${m_index}`} className="measure">
        {measure
          .filter((note) => note.value > 0)
          .map((note, index) => {
            return (
              <Image
                key={`image-${index}`}
                src={
                  note.rhythmCombo
                    ? rhythmMapping(note.rhythmCombo)
                    : noteValueMapping(note.value, note.type)
                }
                alt="Note"
                width={widthMapping(note)}
                height={50}
                style={noteStyleMappinig(
                  note.value,
                  note.type,
                  note.rhythmCombo,
                )}
              />
            );
          })}
      </div>
    );
  });
};
