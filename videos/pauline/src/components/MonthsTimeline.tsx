import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { MonthCard } from "./MonthCard";
import mesesData from "../data/meses.json";
import { TIMINGS } from "../theme";

type Mes = (typeof mesesData)[number];

export const MonthsTimeline: React.FC = () => {
  return (
    <AbsoluteFill>
      <Series>
        {(mesesData as Mes[]).map((mes) => (
          <Series.Sequence key={mes.numero} durationInFrames={TIMINGS.months.perMonth}>
            <MonthCard mes={mes} duration={TIMINGS.months.perMonth} />
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
};
