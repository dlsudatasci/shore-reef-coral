import cn from "classnames";
import { FC } from "react";
import { TeamData } from "@pages/api/admin/teams/[teamId]";

type TeamInfoTabProps = {
  data: any;
};

const TeamInfoTab: FC<TeamInfoTabProps> = ({ data }) => {
  const teamInfo = [
    { name: "Team Name", value: data.name },
    { name: "Province", value: data.province },
    { name: "Town", value: data.town },
    { name: "Affiliation", value: data.affiliation },
    { name: "Verified", value: data.isVerified ? "Yes" : "No" },
    { name: "Status", value: data.status },
  ]

  return (
    <div className="grid grid-cols-3 gap-y-10 mt-8">
      {teamInfo.map((item, index) => (
        <div
          key={index}
          className={cn(index < 1 ? "col-span-3" : "", "flex flex-col")}
        >
          <span className="text-accent-1">{item.name}</span>
          <span className="text-t-highlight text-lg">{item.value}</span>
        </div>
      ))}
    </div>
  );
};

export default TeamInfoTab;
