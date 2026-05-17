import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate } from "remotion";
import { TIMINGS, AUDIO, theme } from "./theme";
import { Opening } from "./components/Opening";
import { FirstDays } from "./components/FirstDays";
import { MonthsTimeline } from "./components/MonthsTimeline";
import { Adventures } from "./components/Adventures";
import { Stats } from "./components/Stats";
import { FamilyMessages } from "./components/FamilyMessages";
import { Closing } from "./components/Closing";

export const PaulineVideo: React.FC = () => {
  const frame = useCurrentFrame();

  const adventureVol = (() => {
    const f = frame - AUDIO.adventure.startAtFrame;
    const dur = AUDIO.adventure.endAtFrame - AUDIO.adventure.startAtFrame;
    if (f < 0 || f > dur) return 0;
    if (f > dur - AUDIO.adventure.fadeOutFrames) {
      return interpolate(f, [dur - AUDIO.adventure.fadeOutFrames, dur], [1, 0]);
    }
    return 1;
  })();

  const everglowVol = (() => {
    const f = frame - AUDIO.everglow.startAtFrame;
    const dur = AUDIO.everglow.endAtFrame - AUDIO.everglow.startAtFrame;
    if (f < 0 || f > dur) return 0;
    if (f < AUDIO.everglow.fadeInFrames) {
      return interpolate(f, [0, AUDIO.everglow.fadeInFrames], [0, 1]);
    }
    if (f > dur - AUDIO.everglow.fadeOutFrames) {
      return interpolate(f, [dur - AUDIO.everglow.fadeOutFrames, dur], [1, 0]);
    }
    return 1;
  })();

  return (
    <AbsoluteFill style={{ background: theme.colors.bg }}>
      <Audio
        src={staticFile(AUDIO.adventure.src)}
        startFrom={0}
        volume={adventureVol}
      />
      <Audio
        src={staticFile(AUDIO.everglow.src)}
        startFrom={0}
        volume={everglowVol}
      />

      <Sequence from={TIMINGS.opening.from} durationInFrames={TIMINGS.opening.duration}>
        <Opening />
      </Sequence>
      <Sequence from={TIMINGS.firstDays.from} durationInFrames={TIMINGS.firstDays.duration}>
        <FirstDays />
      </Sequence>
      <Sequence from={TIMINGS.months.from} durationInFrames={TIMINGS.months.duration}>
        <MonthsTimeline />
      </Sequence>
      <Sequence from={TIMINGS.adventures.from} durationInFrames={TIMINGS.adventures.duration}>
        <Adventures />
      </Sequence>
      <Sequence from={TIMINGS.stats.from} durationInFrames={TIMINGS.stats.duration}>
        <Stats />
      </Sequence>
      <Sequence from={TIMINGS.messages.from} durationInFrames={TIMINGS.messages.duration}>
        <FamilyMessages />
      </Sequence>
      <Sequence from={TIMINGS.closing.from} durationInFrames={TIMINGS.closing.duration}>
        <Closing />
      </Sequence>
    </AbsoluteFill>
  );
};
