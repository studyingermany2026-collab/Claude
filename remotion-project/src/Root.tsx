import { Composition } from "remotion";
import { StudyGermanyVideo } from "./StudyGermany";
import { HelloWorld } from "./HelloWorld";

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="StudyGermany"
        component={StudyGermanyVideo}
        durationInFrames={330}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
