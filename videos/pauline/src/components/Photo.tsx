import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate } from "remotion";

type Props = {
  src: string;
  kenBurns?: "in" | "out" | "left" | "right" | "none";
  duration: number;
};

export const Photo: React.FC<Props> = ({ src, kenBurns = "in", duration }) => {
  const frame = useCurrentFrame();

  const t = Math.max(0, Math.min(1, frame / duration));
  let scale = 1;
  let tx = 0;
  let ty = 0;

  if (kenBurns === "in") scale = interpolate(t, [0, 1], [1.0, 1.12]);
  if (kenBurns === "out") scale = interpolate(t, [0, 1], [1.12, 1.0]);
  if (kenBurns === "left") {
    scale = 1.1;
    tx = interpolate(t, [0, 1], [40, -40]);
  }
  if (kenBurns === "right") {
    scale = 1.1;
    tx = interpolate(t, [0, 1], [-40, 40]);
  }

  const path = staticFile(`photos/${src}`);

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <Img
        src={path}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "blur(40px) brightness(0.55)",
          transform: "scale(1.2)",
        }}
      />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <Img
          src={path}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
            boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
