import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Photo } from "./Photo";
import { Caption } from "./Caption";

const beats = [
  { from: 0, dur: 150, photo: "primeros-dias-01.jpg", text: "Día 1 — la primera tortilla." },
  { from: 150, dur: 150, photo: "primeros-dias-02.jpg", text: "Día 3 — descubrió el gallo pinto." },
  { from: 300, dur: 150, photo: "primeros-dias-03.jpg", text: "Día 5 — primera clase en español." },
  { from: 450, dur: 150, photo: "primeros-dias-04.jpg", text: "Día 8 — \"pura vida\", repetido como mantra." },
  { from: 600, dur: 150, photo: "primeros-dias-05.jpg", text: "Día 14 — esta casa empezó a sentirse suya." },
  { from: 750, dur: 150, photo: "primeros-dias-06.jpg", text: "Día 21 — ya tenía su silla en la mesa." },
];

export const FirstDays: React.FC = () => {
  return (
    <AbsoluteFill>
      {beats.map((b, i) => (
        <Sequence key={i} from={b.from} durationInFrames={b.dur}>
          <Photo src={b.photo} kenBurns={i % 2 === 0 ? "in" : "left"} duration={b.dur} />
          <Caption text={b.text} position="bottom" duration={b.dur} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
