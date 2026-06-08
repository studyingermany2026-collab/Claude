import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

export const HelloWorld = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{ backgroundColor: "#0b0b0f", justifyContent: "center", alignItems: "center" }}
    >
      <h1 style={{ color: "white", fontSize: 80, opacity }}>Hello, Remotion!</h1>
    </AbsoluteFill>
  );
};
