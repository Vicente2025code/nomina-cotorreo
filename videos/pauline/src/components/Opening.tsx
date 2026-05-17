import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Sequence } from "remotion";
import { theme } from "../theme";
import { Photo } from "./Photo";

export const Opening: React.FC = () => {
  const frame = useCurrentFrame();

  const fadeInText = interpolate(frame, [30, 90], [0, 1], { extrapolateRight: "clamp" });
  const fadeOutText = interpolate(frame, [240, 300], [1, 0], { extrapolateLeft: "clamp" });
  const textOpacity = Math.min(fadeInText, fadeOutText);

  return (
    <AbsoluteFill style={{ background: theme.colors.bg }}>
      <AbsoluteFill
        style={{
          opacity: textOpacity,
          justifyContent: "center",
          alignItems: "center",
          padding: 80,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: theme.fonts.sans,
            color: theme.colors.muted,
            fontSize: theme.sizes.small,
            letterSpacing: 8,
            marginBottom: 40,
            textTransform: "uppercase",
          }}
        >
          Agosto 2025
        </div>
        <div
          style={{
            fontFamily: theme.fonts.serif,
            color: theme.colors.text,
            fontSize: theme.sizes.titleMed,
            lineHeight: 1.2,
            maxWidth: 900,
          }}
        >
          Una chica de Múnich aterriza
          <br />
          a <span style={{ color: theme.colors.accent }}>9,500 km</span> de su casa.
        </div>
        <div
          style={{
            fontFamily: theme.fonts.sans,
            color: theme.colors.muted,
            fontSize: theme.sizes.small,
            marginTop: 60,
            opacity: 0.8,
          }}
        >
          Ciudad Quesada · Costa Rica
        </div>
      </AbsoluteFill>

      <Sequence from={330}>
        <Photo src="opening.jpg" kenBurns="in" duration={120} />
      </Sequence>
    </AbsoluteFill>
  );
};
