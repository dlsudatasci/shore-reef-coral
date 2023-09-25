import { FC } from "react";
import RequestAccordion from "./request-accordion";
import { Buoy } from '@components/icons/buoy';
import { Mask } from '@components/icons/mask';

type TeamRequestsProps = {
  data: any[];
};
const TeamRequests: FC<TeamRequestsProps> = ({ data }) => {
  return (
    <div className="mb-20">
      <div className="flex w-full px-4 py-2 text-primary">
        <span className="basis-1/2">
          <Buoy className="fill-primary w-5 inline-block mr-2" />
          Team Name
        </span>
        <span className="basis-1/2">
          <Mask className="fill-primary w-5 inline-block mr-2" />
          Team Leader
        </span>
        <span className="text-2xl basis-[2px]"></span>
      </div>
        {data.map((item) => {
          return <RequestAccordion key={item.id} teamInfo={item} />;
        })}
    </div>
  );
};

export default TeamRequests;
