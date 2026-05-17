import React from "react";
import { Composition } from "remotion";
import { PaulineVideo } from "./PaulineVideo";
import { TIMINGS, fps, width, height } from "./theme";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";

loadInter();
loadPlayfair();

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PaulineVideo"
        component={PaulineVideo}
        durationInFrames={TIMINGS.totalFrames}
        fps={fps}
        width={width}
        height={height}
      />
      <Composition
        id="PaulineVideoSquare"
        component={PaulineVideo}
        durationInFrames={TIMINGS.totalFrames}
        fps={fps}
        width={1080}
        height={1080}
      />
    </>
  );
};
