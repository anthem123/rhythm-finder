// example.test.js
import { describe, it, expect } from "@jest/globals";
import { formatRhythm } from "@/utils/beat-calc";

describe("Creates measures", () => {
  it("4 quarter notes", () => {
    const rhythmList = [
      { noteValue: 1 },
      { noteValue: 1 },
      { noteValue: 1 },
      { noteValue: 1 },
    ];
    const formattedRhythm = formatRhythm(rhythmList, 1, 4);
    expect(formattedRhythm).toEqual([
      [
        { type: "note", value: 1 },
        { type: "note", value: 1 },
        { type: "note", value: 1 },
        { type: "note", value: 1 },
      ],
    ]);
  });

  it("2 Dotted half notes and a quarter note, over the bar", () => {
    const rhythmList = [{ noteValue: 3 }, { noteValue: 3 }, { noteValue: 1 }];
    const formattedRhythm = formatRhythm(rhythmList, 1, 4);
    expect(formattedRhythm).toEqual([
      [
        { type: "note", value: 3 },
        { type: "note", value: 1 },
      ],
      [
        { type: "rest", value: 1 },
        { type: "rest", value: 1 },
        { type: "note", value: 1 },
        { type: "rest", value: 1 },
      ],
    ]);
  });

  it("Eighth notes", () => {
    const rhythmList = [
      { noteValue: 0.5 },
      { noteValue: 0.5 },
      { noteValue: 1 },
    ];
    const formattedRhythm = formatRhythm(rhythmList, 1, 4);
    expect(formattedRhythm).toEqual([
      [
        {
          value: 1,
          subDivisions: [
            { type: "note", value: 0.5 },
            { type: "note", value: 0.5 },
          ],
          rhythmCombo: "8-8",
        },
        { type: "note", value: 1 },
        { type: "rest", value: 1 },
        { type: "rest", value: 1 },
      ],
    ]);
  });
});
