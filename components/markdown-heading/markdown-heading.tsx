import Buoy from "@components/icons/buoy";
import ButterflyFish from "@components/icons/butterfly-fish";
import Camera from "@components/icons/camera";
import Clam from "@components/icons/clam";
import Coral from "@components/icons/coral";
import Cots from "@components/icons/cots";
import Featherstar from "@components/icons/featherstar";
import Fins from "@components/icons/fins";
import Laptop from "@components/icons/laptop";
import Mask from "@components/icons/mask";
import Starfish from "@components/icons/starfish";
import Waves from "@components/icons/waves";
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
        {icons?.map((icon) => {
          const Icon = createElement(ICON_LIST[icon as keyof typeof ICON_LIST], {className: "w-10 h-10 fill-primary inline-block mx-3"});
          return Icon;
        })}
      </span>
    </h1>
  );
};
