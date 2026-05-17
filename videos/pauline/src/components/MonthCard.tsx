import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { Photo } from "./Photo";

type Mes = {
  numero: number;
  nombre: string;
  year: number;
  hito: string;
  caption: string;
  fotos: string[];
};

type Props = { mes: Mes; duration: number };

export const MonthCard: React.FC<Props> = ({ mes, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 14 } });
  const labelY = interpolate(enter, [0, 1], [60, 0]);

  const perPhoto = Math.floor((duration - 60) / mes.fotos.length);

  const headerOpacity = interpolate(
    frame,
    [0, 15, duration - 30, duration],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill>
      {mes.fotos.map((foto, i) => (
        <Sequence key={i} from={i * perPhoto} durationInFrames={perPhoto + 15}>
          <Photo
            src={foto}
            kenBurns={i === 0 ? "in" : i === 1 ? "left" : "right"}
            duration={perPhoto + 15}
          />
        </Sequence>
      ))}

      <AbsoluteFill
        style={{
          justifyContent: "flex-start",
          alignItems: "center",
          paddingTop: 120,
          opacity: headerOpacity,
        }}
      >
        <div
          style={{
            fontFamily: theme.fonts.sans,
            fontSize: theme.sizes.small,
            color: theme.colors.muted,
            letterSpacing: 6,
            transform: `translateY(${labelY}px)`,
          }}
        >
          MES {mes.numero} / 10
        </div>
        <div
          style={{
            fontFamily: theme.fonts.serif,
            fontSize: theme.sizes.titleBig,
            color: theme.colors.text,
            marginTop: 16,
            textShadow: "0 6px 30px rgba(0,0,0,0.7)",
          }}
        >
          {mes.nombre} {mes.year}
        </div>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 240,
          opacity: headerOpacity,
        }}
      >
        <div
          style={{
            fontFamily: theme.fonts.sans,
            fontSize: theme.sizes.small,
            color: theme.colors.accent,
            letterSpacing: 4,
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          {mes.hito}
        </div>
        <div
          style={{
            fontFamily: theme.fonts.sans,
            fontSize: theme.sizes.body,
            color: theme.colors.text,
            maxWidth: 900,
            textAlign: "center",
            lineHeight: 1.25,
            background: "rgba(0,0,0,0.55)",
            padding: "20px 36px",
            borderRadius: 16,
            backdropFilter: "blur(8px)",
            textShadow: "0 4px 24px rgba(0,0,0,0.7)",
          }}
        >
          {mes.caption}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
