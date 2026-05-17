import React from "react";
import { AbsoluteFill, OffthreadVideo, staticFile, Sequence, useCurrentFrame, interpolate } from "remotion";
import { theme } from "../theme";

const clips = [
  { src: "adventure-01.mp4", from: 0, dur: 120, caption: "Volcán Arenal" },
  { src: "adventure-02.mp4", from: 120, dur: 120, caption: "Playa del Coco" },
  { src: "adventure-03.mp4", from: 240, dur: 120, caption: "Monteverde" },
  { src: "adventure-04.mp4", from: 360, dur: 150, caption: "La Fortuna" },
  { src: "adventure-05.mp4", from: 510, dur: 150, caption: "Manuel Antonio" },
  { src: "adventure-06.mp4", from: 660, dur: 240, caption: "Pura vida." },
];

export const Adventures: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {clips.map((c, i) => (
        <Sequence key={i} from={c.from} durationInFrames={c.dur}>
          <ClipWithCaption src={c.src} caption={c.caption} duration={c.dur} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

const ClipWithCaption: React.FC<{ src: string; caption: string; duration: number }> = ({
  src,
  caption,
  duration,
}) => {
  const frame = useCurrentFrame();
  const captionOpacity = interpolate(
    frame,
    [0, 20, duration - 30, duration],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill>
      <OffthreadVideo
        src={staticFile(`videos/${src}`)}
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 260,
          opacity: captionOpacity,
        }}
      >
        <div
          style={{
            fontFamily: theme.fonts.serif,
            fontSize: theme.sizes.titleMed,
            color: theme.colors.text,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(8px)",
            padding: "16px 40px",
            borderRadius: 18,
            textShadow: "0 4px 24px rgba(0,0,0,0.8)",
          }}
        >
          {caption}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
