import { Tab } from "@headlessui/react";
import cn from "classnames";
import { FC, ReactNode } from "react";

type TeamTabsProps = {
  tab1: ReactNode;
  tab2: ReactNode;
  tab3: ReactNode;
}
const TeamTabs:FC<TeamTabsProps> = ({tab1, tab2, tab3}) => {
  return (
    <Tab.Group>
        <Tab.List>
          <Tab
            className={({ selected }) =>
              cn(
                selected
                  ? "bg-primary text-secondary"
                  : "bg-transparent text-primary",
                "p-3 border-y-2 border-l-2 border-primary"
              )
            }
          >
            Surveys
          </Tab>
          <Tab
            className={({ selected }) =>
              cn(
                selected
                  ? "bg-primary text-secondary"
                  : "bg-transparent text-primary",
                "p-3 border-y-2 border-x-2 border-primary"
              )
            }
          >
            Members
          </Tab>
          <Tab
            className={({ selected }) =>
              cn(
                selected
                  ? "bg-primary text-secondary"
                  : "bg-transparent text-primary",
                "p-3 border-y-2 border-r-2 border-primary"
              )
            }
          >
            Team Info
          </Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>{tab1}</Tab.Panel>
          <Tab.Panel>{tab2}</Tab.Panel>
          <Tab.Panel>{tab3}</Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
  )
}

export default TeamTabs