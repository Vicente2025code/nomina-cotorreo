import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { theme } from "../theme";

type Props = {
  text: string;
  position?: "top" | "bottom" | "center";
  duration: number;
};

export const Caption: React.FC<Props> = ({ text, position = "bottom", duration }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [0, 15, duration - 15, duration],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const slide = interpolate(frame, [0, 20], [40, 0], { extrapolateRight: "clamp" });

  const align =
    position === "top" ? "flex-start" : position === "center" ? "center" : "flex-end";

  return (
    <AbsoluteFill
      style={{
        justifyContent: align,
        alignItems: "center",
        paddingBottom: position === "bottom" ? 220 : 0,
        paddingTop: position === "top" ? 220 : 0,
        opacity,
      }}
    >
      <div
        style={{
          fontFamily: theme.fonts.sans,
          fontSize: theme.sizes.body,
          color: theme.colors.text,
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(8px)",
          padding: "20px 36px",
          borderRadius: 16,
          textAlign: "center",
          maxWidth: 900,
          lineHeight: 1.25,
          transform: `translateY(${slide}px)`,
          textShadow: "0 4px 24px rgba(0,0,0,0.7)",
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
