import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { Photo } from "./Photo";
import { Caption } from "./Caption";
import mensajes from "../data/mensajes.json";
import { theme } from "../theme";

export const FamilyMessages: React.FC = () => {
  const perMessage = Math.floor(1500 / mensajes.length);

  return (
    <AbsoluteFill style={{ background: theme.colors.bgWarm }}>
      <Series>
        {mensajes.map((m, i) => (
          <Series.Sequence key={i} durationInFrames={perMessage}>
            <AbsoluteFill>
              <Photo src={m.foto} kenBurns="in" duration={perMessage} />
              <AbsoluteFill
                style={{
                  justifyContent: "flex-start",
                  alignItems: "center",
                  paddingTop: 160,
                }}
              >
                <div
                  style={{
                    fontFamily: theme.fonts.sans,
                    fontSize: theme.sizes.small,
                    color: theme.colors.accent,
                    letterSpacing: 6,
                    textTransform: "uppercase",
                    background: "rgba(0,0,0,0.5)",
                    padding: "12px 28px",
                    borderRadius: 12,
                    backdropFilter: "blur(6px)",
                  }}
                >
                  — {m.deQuien}
                </div>
              </AbsoluteFill>
              <Caption text={m.texto} position="bottom" duration={perMessage} />
            </AbsoluteFill>
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
};
