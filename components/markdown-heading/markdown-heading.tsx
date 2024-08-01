import { Buoy, ButterflyFish, Camera, Clam, Coral, Cots, Featherstar, Fins, Laptop, Mask, Starfish, Waves } from "@components/icons";
import { FC, PropsWithChildren, createElement } from "react";

const ICON_LIST = {
  buoy: Buoy,
  butterflyFish: ButterflyFish,
  camera: Camera,
  clam: Clam,
  coral: Coral,
  cots: Cots,
  featherStar: Featherstar,
  fins: Fins,
  laptop: Laptop,
  mask: Mask,
  starfish: Starfish,
  waves: Waves,
};

type Props = {
  icons?: string[];
};

export const MarkdownHeading: FC<PropsWithChildren & Props> = ({
  children,
  icons,
}) => {
  return (
    <h1>
      {children}
      <span>
        {icons?.map((icon, index) => {
          const Icon = createElement(ICON_LIST[icon as keyof typeof ICON_LIST], {className: "w-10 h-10 fill-primary inline-block mx-3", key: index});
          return Icon;
        })}
      </span>
    </h1>
  );
};
