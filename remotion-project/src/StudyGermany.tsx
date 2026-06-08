import React from "react";
import {
  AbsoluteFill,
  Video,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
} from "remotion";

// ─── Helpers ────────────────────────────────────────────────────────────────

const fps = 30;
const W = 1080;
const H = 1920;

function popIn(frame: number, startFrame: number, delay = 0) {
  return spring({
    fps,
    frame: frame - startFrame - delay,
    config: { damping: 12, stiffness: 180, mass: 0.6 },
  });
}

function slideUp(frame: number, startFrame: number) {
  const progress = spring({
    fps,
    frame: frame - startFrame,
    config: { damping: 14, stiffness: 160, mass: 0.7 },
  });
  return interpolate(progress, [0, 1], [60, 0]);
}

function bounce(frame: number, startFrame: number) {
  return spring({
    fps,
    frame: frame - startFrame,
    config: { damping: 8, stiffness: 200, mass: 0.5 },
  });
}

// ─── Text Styles ────────────────────────────────────────────────────────────

const YELLOW = "#FFE600";
const WHITE = "#FFFFFF";
const GREEN = "#00FF88";

const boldText: React.CSSProperties = {
  fontFamily: "'Montserrat', 'Arial Black', 'Impact', sans-serif",
  fontWeight: 900,
  letterSpacing: 1,
  textAlign: "center",
  lineHeight: 1.15,
  WebkitTextStroke: "2px rgba(0,0,0,0.6)",
  textShadow: "0 4px 16px rgba(0,0,0,0.7), 0 2px 4px rgba(0,0,0,0.9)",
};

// ─── Vignette ───────────────────────────────────────────────────────────────

const Vignette: React.FC<{ opacity?: number }> = ({ opacity = 0.55 }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      background: `radial-gradient(ellipse at 50% 40%, transparent 38%, rgba(0,0,0,${opacity}) 100%)`,
      pointerEvents: "none",
    }}
  />
);

// ─── Caption Row ────────────────────────────────────────────────────────────

const CaptionRow: React.FC<{
  parts: Array<{ text: string; color?: string; size?: number }>;
  bottom: number;
  scale?: number;
  translateY?: number;
  opacity?: number;
}> = ({ parts, bottom, scale = 1, translateY = 0, opacity = 1 }) => (
  <div
    style={{
      position: "absolute",
      bottom,
      left: 0,
      right: 0,
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      alignItems: "center",
      gap: 6,
      padding: "0 40px",
      transform: `scale(${scale}) translateY(${translateY}px)`,
      opacity,
    }}
  >
    {parts.map((p, i) => (
      <span
        key={i}
        style={{
          ...boldText,
          fontSize: p.size ?? 72,
          color: p.color ?? WHITE,
          background:
            p.color === YELLOW
              ? "rgba(0,0,0,0.25)"
              : "transparent",
          borderRadius: 8,
          padding: "0 4px",
          display: "inline-block",
        }}
      >
        {p.text}
      </span>
    ))}
  </div>
);

// ─── Flashing word ───────────────────────────────────────────────────────────

const FlashWord: React.FC<{ frame: number; text: string; color: string }> = ({
  frame,
  text,
  color,
}) => {
  const flash = Math.sin((frame / fps) * Math.PI * 6) > 0 ? 1 : 0.6;
  return (
    <span
      style={{
        ...boldText,
        fontSize: 72,
        color,
        opacity: flash,
        display: "inline-block",
      }}
    >
      {text}
    </span>
  );
};

// ─── Airplane streak ────────────────────────────────────────────────────────

const AirplaneStreak: React.FC<{ frame: number; startFrame: number }> = ({
  frame,
  startFrame,
}) => {
  const t = Math.max(0, frame - startFrame);
  const x = interpolate(t, [0, 25], [-120, W + 120], {
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(t, [0, 3, 22, 25], [0, 1, 1, 0], {
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        bottom: 320,
        left: x,
        fontSize: 72,
        opacity,
        transform: "scaleX(1)",
        filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.6))",
      }}
    >
      ✈️
    </div>
  );
};

// ─── End Screen ─────────────────────────────────────────────────────────────

const EndScreen: React.FC<{ frame: number; startFrame: number }> = ({
  frame,
  startFrame,
}) => {
  const fadeIn = interpolate(frame - startFrame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });
  const scaleIn = interpolate(
    spring({ fps, frame: frame - startFrame, config: { damping: 14, stiffness: 140 } }),
    [0, 1],
    [0.85, 1]
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(180deg, #0a0a1a 0%, #12122a 60%, #1a1a3a 100%)",
        opacity: fadeIn,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
      }}
    >
      {/* Brand name */}
      <div
        style={{
          transform: `scale(${scaleIn})`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            ...boldText,
            fontSize: 52,
            color: WHITE,
            WebkitTextStroke: "1px rgba(255,255,255,0.3)",
            marginBottom: 8,
          }}
        >
          🇮🇳🤝🇩🇪
        </div>
        <div
          style={{
            ...boldText,
            fontSize: 54,
            color: WHITE,
            letterSpacing: 2,
          }}
        >
          INDO-GERMAN
        </div>
        <div
          style={{
            ...boldText,
            fontSize: 42,
            color: YELLOW,
            letterSpacing: 4,
          }}
        >
          EDUCATION
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          width: 600,
          height: 3,
          background: `linear-gradient(90deg, transparent, ${YELLOW}, transparent)`,
          borderRadius: 2,
        }}
      />

      {/* CTA */}
      <div
        style={{
          background: YELLOW,
          borderRadius: 24,
          padding: "28px 60px",
          transform: `scale(${scaleIn})`,
          boxShadow: `0 8px 40px rgba(255,230,0,0.4)`,
        }}
      >
        <div
          style={{
            ...boldText,
            fontSize: 48,
            color: "#0a0a1a",
            WebkitTextStroke: "0px",
            textShadow: "none",
            letterSpacing: 2,
          }}
        >
          DM US TO START
        </div>
        <div
          style={{
            ...boldText,
            fontSize: 48,
            color: "#0a0a1a",
            WebkitTextStroke: "0px",
            textShadow: "none",
            letterSpacing: 2,
          }}
        >
          YOUR JOURNEY 🚀
        </div>
      </div>

      {/* Handle */}
      <div
        style={{
          ...boldText,
          fontSize: 38,
          color: "rgba(255,255,255,0.7)",
          WebkitTextStroke: "0px",
          textShadow: "none",
          fontWeight: 700,
        }}
      >
        @indogermaneducation
      </div>

      {/* Link in bio */}
      <div
        style={{
          ...boldText,
          fontSize: 34,
          color: YELLOW,
          WebkitTextStroke: "0px",
          textShadow: "none",
          opacity: 0.9,
        }}
      >
        🔗 Link in Bio
      </div>
    </div>
  );
};

// ─── Main Composition ───────────────────────────────────────────────────────

export const StudyGermanyVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Subtle zoom-in on the video across the whole clip (1x → 1.06x)
  const videoScale = interpolate(frame, [0, durationInFrames], [1, 1.06], {
    extrapolateRight: "clamp",
  });

  // Camera shake on DEFINITELY (frames 120-150)
  const shakeX =
    frame >= 120 && frame <= 150
      ? Math.sin(frame * 1.8) * interpolate(frame, [120, 135, 150], [0, 5, 0])
      : 0;
  const shakeY =
    frame >= 120 && frame <= 150
      ? Math.cos(frame * 2.1) * interpolate(frame, [120, 135, 150], [0, 3, 0])
      : 0;

  // Vignette strength — increases in final segment
  const vignetteOpacity = interpolate(frame, [180, 240], [0.45, 0.65], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // End screen start (frame 270 = 9s)
  const endStart = 270;
  const showEnd = frame >= endStart;

  // ── Text visibility ──────────────────────────────────────────────────────

  // 00:00-00:01  "STUDY IN GERMANY? 🇩🇪"
  const hook_scale = popIn(frame, 0);
  const hook_opacity = interpolate(frame, [25, 30], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // 00:01-00:03  "If you are looking forward..."
  const lookFwd_scale = popIn(frame, 30);
  const lookFwd_opacity = interpolate(frame, [88, 95], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // 00:03-00:04  "...to STUDY in Germany"
  const study_scale = popIn(frame, 90);
  const study_opacity = interpolate(frame, [118, 125], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // 00:04-00:05  "Then DEFINITELY contact..."
  const def_scale = popIn(frame, 120);
  const def_opacity = interpolate(frame, [148, 155], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // 00:05-00:06  "Indo-German Education 🇮🇳🤝🇩🇪"
  const brand_scale = popIn(frame, 150);
  const brand_opacity = interpolate(frame, [178, 185], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // 00:06-00:07  "...and FLY with Privesh!"
  const fly_ty = slideUp(frame, 180);
  const fly_opacity = interpolate(frame, [179, 185, 208, 215], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 00:07-00:09  "Your ONE-STOP Solution! 🎯"
  const onestop_scale = bounce(frame, 210);
  const onestop_opacity = interpolate(frame, [209, 215, 268, 275], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {/* ── Source video ── */}
      {!showEnd && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `scale(${videoScale}) translate(${shakeX}px, ${shakeY}px)`,
            transformOrigin: "center center",
            overflow: "hidden",
          }}
        >
          <Video
            src={staticFile("source.mp4")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
            }}
          />
        </div>
      )}

      {/* ── Vignette ── */}
      {!showEnd && <Vignette opacity={vignetteOpacity} />}

      {/* ── End Screen ── */}
      {showEnd && <EndScreen frame={frame} startFrame={endStart} />}

      {/* ── HOOK: "STUDY IN GERMANY? 🇩🇪" (0-30f) ── */}
      {frame >= 0 && frame < 32 && (
        <CaptionRow
          parts={[{ text: "STUDY IN GERMANY? 🇩🇪", color: YELLOW, size: 78 }]}
          bottom={340}
          scale={hook_scale}
          opacity={hook_opacity}
        />
      )}

      {/* ── "If you are looking forward..." (30-95f) ── */}
      {frame >= 30 && frame < 96 && (
        <CaptionRow
          parts={[{ text: "If you are looking forward...", color: WHITE, size: 60 }]}
          bottom={300}
          scale={lookFwd_scale}
          opacity={lookFwd_opacity}
        />
      )}

      {/* ── "...to STUDY in Germany" (90-125f) ── */}
      {frame >= 90 && frame < 126 && (
        <CaptionRow
          parts={[
            { text: "...to", color: WHITE, size: 60 },
            { text: "STUDY", color: YELLOW, size: 78 },
            { text: "in Germany", color: WHITE, size: 60 },
          ]}
          bottom={300}
          scale={study_scale}
          opacity={study_opacity}
        />
      )}

      {/* ── "Then DEFINITELY contact..." (120-155f) ── */}
      {frame >= 120 && frame < 156 && (
        <div
          style={{
            position: "absolute",
            bottom: 300,
            left: 0,
            right: 0,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
            padding: "0 40px",
            transform: `scale(${def_scale})`,
            opacity: def_opacity,
          }}
        >
          <span style={{ ...boldText, fontSize: 60, color: WHITE }}>Then</span>
          <FlashWord frame={frame} text="DEFINITELY" color={GREEN} />
          <span style={{ ...boldText, fontSize: 60, color: WHITE }}>contact...</span>
        </div>
      )}

      {/* ── "Indo-German Education 🇮🇳🤝🇩🇪" (150-185f) ── */}
      {frame >= 150 && frame < 186 && (
        <CaptionRow
          parts={[{ text: "Indo-German Education 🇮🇳🤝🇩🇪", color: WHITE, size: 62 }]}
          bottom={300}
          scale={brand_scale}
          opacity={brand_opacity}
        />
      )}

      {/* ── "...and FLY with Privesh!" (180-215f) ── */}
      {frame >= 180 && frame < 216 && (
        <CaptionRow
          parts={[
            { text: "...and", color: WHITE, size: 60 },
            { text: "FLY", color: YELLOW, size: 82 },
            { text: "with Privesh!", color: WHITE, size: 60 },
          ]}
          bottom={300}
          translateY={fly_ty}
          opacity={fly_opacity}
        />
      )}

      {/* ── Airplane emoji streak (180-210f) ── */}
      {frame >= 180 && frame < 215 && (
        <AirplaneStreak frame={frame} startFrame={182} />
      )}

      {/* ── "Your ONE-STOP Solution! 🎯" (210-275f) ── */}
      {frame >= 210 && frame < 276 && (
        <CaptionRow
          parts={[{ text: "Your ONE-STOP Solution! 🎯", color: WHITE, size: 68 }]}
          bottom={300}
          scale={onestop_scale}
          opacity={onestop_opacity}
        />
      )}
    </AbsoluteFill>
  );
};
