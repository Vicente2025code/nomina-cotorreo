---
name: remotion
description: "Build, preview, and render videos programmatically with Remotion (a React framework for video). This skill should be used when the user wants to create video content from code, produce data-driven or templated videos, animate React components into MP4/WebM/GIF, render charts/dashboards/social-media videos, or automate video generation in a pipeline. Triggers on: 'remotion', 'generate a video', 'render a video from code', 'video template', 'programmatic video', 'animate this in code', 'video from JSON/CSV', 'lottie to video', 'react video', 'mp4 from react'. Covers scaffolding a project (npx create-video), writing Compositions, using interpolate/spring animations, the Player, Studio, server-side rendering with @remotion/renderer, and Lambda rendering."
metadata:
  version: 1.0.0
  source: https://github.com/remotion-dev/remotion
  license: Remotion License (free for individuals/small companies, paid for larger teams — see https://remotion.dev/license)
---

# Remotion — Programmatic Video with React

Remotion is a framework that lets you build videos by composing React components.
Each frame is rendered by React, then the frames are stitched into an MP4 (or WebM/GIF)
with FFmpeg. You write motion as a function of time (`frame` index), preview live in
Remotion Studio, and render headlessly for production.

## When to use this skill

- "Make a video that shows X" where X is data, a tutorial, a template, etc.
- Generating social posts, ads, explainer videos, or shorts from JSON/CSV input.
- Turning a Figma/React design into an animated MP4.
- Building a video pipeline (e.g., user submits text → server renders MP4).
- Anything where the user wants reproducible, version-controlled video.

Do NOT use this skill for: video editing of existing footage (use a NLE), live
streaming, or simple GIF generation that doesn't need code (use a GUI tool).

## License caveat — always mention to the user

Remotion is NOT MIT. It's free for individuals and companies up to a certain size,
but commercial use by larger orgs requires a paid license. Before scaffolding a
project for a company, ask the user if they've reviewed `https://remotion.dev/license`.

## Starting a project

```bash
# Interactive scaffold (recommended for new projects)
npx create-video@latest

# Pick the "Hello World" or "Empty" template for minimal setup.
# The scaffold creates: src/Root.tsx, src/Composition.tsx, remotion.config.ts
```

For adding Remotion to an existing repo:

```bash
npm i remotion @remotion/cli @remotion/player
```

Then create a Remotion root file (typically `src/remotion/Root.tsx`):

```tsx
import { Composition } from "remotion";
import { MyVideo } from "./MyVideo";

export const RemotionRoot = () => (
  <Composition
    id="MyVideo"
    component={MyVideo}
    durationInFrames={150}   // 5 seconds at 30fps
    fps={30}
    width={1920}
    height={1080}
    defaultProps={{ title: "Hello" }}
  />
);
```

Register it in `remotion.config.ts` or via `--config` on the CLI.

## Writing a Composition

A Composition is a React component that receives the current `frame` via the
`useCurrentFrame()` hook. Drive animations by mapping `frame` → style.

```tsx
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export const MyVideo: React.FC<{ title: string }> = ({ title }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Linear fade in over 30 frames, fade out over the last 30
  const opacity = interpolate(
    frame,
    [0, 30, durationInFrames - 30, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Spring-based scale-in
  const scale = spring({ frame, fps, config: { damping: 12 } });

  return (
    <AbsoluteFill style={{ background: "#0b1020", color: "white",
      justifyContent: "center", alignItems: "center", fontSize: 120,
      fontFamily: "Inter, sans-serif", opacity, transform: `scale(${scale})` }}>
      {title}
    </AbsoluteFill>
  );
};
```

### Core building blocks (cheat sheet)

| API | Purpose |
|---|---|
| `useCurrentFrame()` | Current frame index (0-based). |
| `useVideoConfig()` | `{ fps, width, height, durationInFrames }`. |
| `interpolate(frame, inputRange, outputRange, options?)` | Linear map. Always pass `extrapolateLeft/Right: "clamp"` unless you want overshoot. |
| `spring({ frame, fps, config, from?, to?, delay?, durationInFrames? })` | Natural spring animation. |
| `<AbsoluteFill>` | Full-screen div, used as the typical root. |
| `<Sequence from={30} durationInFrames={60}>` | Mount a child only during that frame range, resetting its `useCurrentFrame()` to 0 at `from`. |
| `<Series>` / `<Series.Sequence>` | Play children back-to-back. |
| `<Audio src={…} />`, `<Video src={…} />`, `<Img />`, `<OffthreadVideo />` | Built-in media components (prefer `OffthreadVideo` for performance). |
| `staticFile("foo.png")` | Reference files from `public/` directory. |
| `delayRender()` / `continueRender()` | Tell Remotion to wait for async data before rendering a frame. |

### Conventions

- Always use a 30 or 60 fps base. 24fps is fine for cinematic content.
- `durationInFrames` is FRAMES, not seconds. Convert with `seconds * fps`.
- Keep components pure — same `frame` + props must always render the same pixels.
  Don't use `Date.now()`, `Math.random()` without a seeded RNG, or unguarded fetches.
- For data fetching, wrap with `delayRender`/`continueRender` or use
  `calculateMetadata` on the Composition.
- Don't mutate refs across frames assuming continuity — Remotion can render frames
  out of order in parallel.

## Previewing

```bash
npx remotion studio        # opens an interactive preview at http://localhost:3000
```

Studio lets the user scrub the timeline, edit props live, and pick a Composition.

## Rendering to a file

```bash
# Render the "MyVideo" composition to out/video.mp4
npx remotion render src/index.ts MyVideo out/video.mp4

# Common flags:
#   --props='{"title":"Hello"}'  — override defaultProps as JSON
#   --concurrency=4              — parallel chrome instances
#   --codec=h264|h265|vp8|vp9|prores|gif
#   --frames=0-90                — render a subset (handy for previews)
#   --image-format=jpeg          — faster than png for non-transparent output
#   --quality=80                 — JPEG quality (1-100)
#   --log=verbose                — debug rendering issues
```

Output formats: MP4 (default), WebM, GIF, MOV (ProRes), PNG sequence, MP3/WAV (audio only).

## Server-side rendering (Node.js)

Use `@remotion/renderer` to render from a Node script — useful for queues, APIs,
or CI:

```ts
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "node:path";

const bundled = await bundle({
  entryPoint: path.resolve("src/index.ts"),
});

const composition = await selectComposition({
  serveUrl: bundled,
  id: "MyVideo",
  inputProps: { title: "From API" },
});

await renderMedia({
  composition,
  serveUrl: bundled,
  codec: "h264",
  outputLocation: "out/api.mp4",
  inputProps: { title: "From API" },
});
```

For large-scale rendering, use **Remotion Lambda**:

```bash
npm i @remotion/lambda
npx remotion lambda functions deploy
npx remotion lambda sites create src/index.ts --site-name=my-video
npx remotion lambda render my-video MyVideo --props='{...}'
```

Lambda splits the video into chunks rendered in parallel across AWS Lambda.

## Embedding in a webapp (Player)

The Remotion Player is a React component that plays a Composition in the browser
without rendering to a file — good for previews and interactive video apps:

```tsx
import { Player } from "@remotion/player";
import { MyVideo } from "./MyVideo";

<Player
  component={MyVideo}
  inputProps={{ title: "Hi" }}
  durationInFrames={150}
  compositionWidth={1920}
  compositionHeight={1080}
  fps={30}
  controls
/>
```

## Common pitfalls and fixes

- **Black frames at the start**: animations referencing `frame === 0` may not have
  started. Use `spring` or `interpolate` from 0 → 1 over the first 10–20 frames.
- **`useCurrentFrame() is undefined`**: you're outside a Composition. Components
  using `useCurrentFrame()` must be rendered by Remotion (or inside a `<Player>`).
- **Fonts not loading**: use `@remotion/google-fonts` or call `delayRender()` while
  loading custom fonts, then `continueRender()` once `document.fonts.ready` resolves.
- **Slow render**: lower `--image-format=jpeg`, increase `--concurrency`, prefer
  `<OffthreadVideo>` over `<Video>` for embedded clips, and avoid expensive React
  work that doesn't depend on `frame`.
- **Different output between Studio and headless render**: usually a font, image,
  or timing issue. Hit `r` in Studio to force re-render and compare with
  `--log=verbose` on the render side.
- **"Composition not found"**: the `id` passed to render must match the
  `<Composition id="…">` exactly.

## What to do first when the user asks for a video

1. Confirm scope: dimensions, duration, fps, output format, single video vs batch.
2. Ask for inputs: text, images, data files, brand colors/fonts.
3. Note the license caveat if the user represents a company.
4. Decide: new project (`create-video`) vs add to existing (`npm i remotion …`).
5. Sketch the Composition structure (which sub-components, what props).
6. Implement with `interpolate`/`spring`, preview in Studio, then render.

## Further references

- Docs: https://www.remotion.dev/docs
- Examples gallery: https://www.remotion.dev/showcase
- Repo: https://github.com/remotion-dev/remotion
- Lambda guide: https://www.remotion.dev/docs/lambda
- License: https://remotion.dev/license
