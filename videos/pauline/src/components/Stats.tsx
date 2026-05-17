import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { theme } from "../theme";
import stats from "../data/stats.json";

const lines: Array<{ value: number; label: string; sufijo?: string }> = [
  { value: stats.dias, label: "días" },
  { value: stats.kilometros, label: "kilómetros desde Múnich", sufijo: " km" },
  { value: stats.ciudades, label: "ciudades" },
  { value: stats.playas, label: "playas" },
  { value: stats.puraVidas, label: "\"pura vidas\"" },
  { value: stats.familias, label: "familia más" },
];

const LINE_FRAMES = 60;

export const Stats: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background: theme.colors.bg,
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
      }}
    >
      {lines.map((line, i) => (
        <Sequence key={i} from={i * LINE_FRAMES} durationInFrames={LINE_FRAMES * 4}>
          <StatLine
            value={line.value}
            label={line.label}
            sufijo={line.sufijo}
            slot={i}
            totalSlots={lines.length}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

const StatLine: React.FC<{
  value: number;
  label: string;
  sufijo?: string;
  slot: number;
  totalSlots: number;
}> = ({ value, label, sufijo = "", slot, totalSlots }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 14 } });

  const count = Math.floor(interpolate(frame, [0, 50], [0, value], { extrapolateRight: "clamp" }));
  const opacity = interpolate(enter, [0, 1], [0, 1]);
  const slide = interpolate(enter, [0, 1], [40, 0]);

  const vertSpacing = 1920 / (totalSlots + 1);
  const top = (slot + 1) * vertSpacing - 100;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity,
          transform: `translateY(${slide}px)`,
        }}
      >
        <div
          style={{
            fontFamily: theme.fonts.serif,
            fontSize: theme.sizes.titleBig,
            color: theme.colors.accent,
            lineHeight: 1,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {count.toLocaleString("es-CR")}{sufijo}
        </div>
        <div
          style={{
            fontFamily: theme.fonts.sans,
            fontSize: theme.sizes.small,
            color: theme.colors.muted,
            letterSpacing: 3,
            textTransform: "uppercase",
            marginTop: 10,
          }}
        >
          {label}
        </div>
      </div>
    </AbsoluteFill>
  );
};
