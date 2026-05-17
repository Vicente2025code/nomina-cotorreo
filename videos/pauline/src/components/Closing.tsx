import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate, Img, staticFile } from "remotion";
import { theme } from "../theme";

const ES_LINES = [
  "Pauline,",
  "Pensábamos que veníamos a hospedar a alguien.",
  "Y nos quedamos con una hija más.",
  "Tu casa siempre va a estar acá.",
];

const DE_LINES = [
  "Pauline,",
  "Wir dachten, wir nehmen jemanden bei uns auf.",
  "Aber wir haben eine Tochter dazugewonnen.",
  "Dein Zuhause hier wird immer auf dich warten.",
];

const SECTION_FRAMES = 360;

export const Closing: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: theme.colors.bg }}>
      <Sequence from={0} durationInFrames={SECTION_FRAMES}>
        <TextBlock title="" lines={ES_LINES} accent={theme.colors.accent} />
      </Sequence>
      <Sequence from={SECTION_FRAMES} durationInFrames={SECTION_FRAMES}>
        <TextBlock title="" lines={DE_LINES} accent={theme.colors.accentWarm} />
      </Sequence>
      <Sequence from={SECTION_FRAMES * 2} durationInFrames={480}>
        <FinalBeat />
      </Sequence>
    </AbsoluteFill>
  );
};

const TextBlock: React.FC<{ title: string; lines: string[]; accent: string }> = ({ lines, accent }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
        textAlign: "center",
      }}
    >
      {lines.map((line, i) => {
        const start = 30 + i * 40;
        const op = interpolate(
          frame,
          [start, start + 30, SECTION_FRAMES - 30, SECTION_FRAMES],
          [0, 1, 1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );
        const slide = interpolate(frame, [start, start + 30], [20, 0], { extrapolateRight: "clamp" });
        const isFirst = i === 0;
        return (
          <div
            key={i}
            style={{
              fontFamily: isFirst ? theme.fonts.serif : theme.fonts.sans,
              fontSize: isFirst ? theme.sizes.titleBig : theme.sizes.body,
              color: isFirst ? accent : theme.colors.text,
              opacity: op,
              transform: `translateY(${slide}px)`,
              marginBottom: isFirst ? 60 : 24,
              maxWidth: 900,
              lineHeight: 1.3,
            }}
          >
            {line}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const FinalBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const photoOpacity = interpolate(frame, [0, 60, 360, 480], [0, 1, 1, 0.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const textOp = interpolate(frame, [120, 180], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Img
        src={staticFile("photos/closing.jpg")}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "grayscale(1) brightness(0.8)",
          opacity: photoOpacity,
        }}
      />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: textOp }}>
        <div
          style={{
            fontFamily: theme.fonts.serif,
            fontSize: theme.sizes.titleHuge,
            color: theme.colors.text,
            textShadow: "0 8px 40px rgba(0,0,0,0.9)",
          }}
        >
          Bis bald.
        </div>
        <div
          style={{
            fontFamily: theme.fonts.sans,
            fontSize: theme.sizes.body,
            color: theme.colors.muted,
            marginTop: 24,
            letterSpacing: 4,
          }}
        >
          Hasta pronto, Pauline.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
