import cn from "classnames";
import { FC } from "react";

type TeamInfoTabProps = {
  data: {
    name: string;
    value: string;
  }[];
};

const TeamInfoTab: FC<TeamInfoTabProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-3 gap-y-10 mt-8">
      {data.map((item, index) => (
        <div
          key={index}
          className={cn(index < 2 ? "col-span-3" : "", "flex flex-col")}
        >
          <span className="text-accent-1">{item.name}</span>
          <span className="text-t-highlight text-lg">{item.value}</span>
        </div>
      ))}
    </div>
  );
};

export default TeamInfoTab;
