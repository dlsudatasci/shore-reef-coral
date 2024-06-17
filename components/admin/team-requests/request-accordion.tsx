import { Disclosure } from "@headlessui/react";
import { FC } from "react";

type RequestAccordionProps = {
  teamInfo: any;
};
const RequestAccordion: FC<RequestAccordionProps> = ({ teamInfo }) => {
  const teamLeader = teamInfo.UsersOnTeam.find((user: any) => user.isLeader).user;

  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className="flex w-full px-4 py-2 text-left text-lg font-sans bg-accent-2 text-secondary">
            <span className="basis-1/2">{teamInfo.name}</span>
            <span className="basis-1/2">{teamLeader.firstName} {teamLeader.lastName}</span>
            <span className="text-2xl basis-[2px]">{open ? "-" : "+"}</span>
          </Disclosure.Button>
          <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm border-2 border-accent-1">
            <div className="grid grid-cols-3 gap-y-10">
              <div className="flex flex-col">
                <span className="text-accent-1">Town</span>
                <span className="text-t-highlight text-lg">{teamInfo.town}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-accent-1">Province</span>
                <span className="text-t-highlight text-lg">{teamInfo.province}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-accent-1">Affiliation</span>
                <span className="text-t-highlight text-lg">{teamInfo.affiliation || "N/A"}</span>
              </div>
            </div>
            <div className="w-full text-right">
              <button className="bg-primary text-secondary rounded-full py-2 px-4 text-xl">
                Approve
              </button>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default RequestAccordion;
