import { Waves } from "@components/icons";
import AdminLayout from "@components/layouts/admin-layout";
import { SurveyTableAdmin } from "@components/survey-table";
import { Tab } from "@headlessui/react";
import { TeamSurveySummary } from "@pages/api/teams/[teamId]/surveys";
import { useRouter } from "next/router";
import { useState } from "react";
import cn from "classnames";
import TeamTabs from "@components/admin/team-tabs/team-tabs";
import TeamInfoTab from "@components/admin/team-tabs/team-info-tab";

const SampleData: TeamSurveySummary[] = Array.from({ length: 10 }, (_, id) => ({
  id,
  date: new Date(Date.now() - Math.random() * 1000000000),
  stationName: "Station name",
  startLatitude: Math.random() * 100,
  startLongtitude: Math.random() * 100,
  dataType: "Photos",
  status: "Completed",
  verified: true,
}));

const TeamInfo = () => {
  const router = useRouter();
  const [teamId, setTeamId] = useState(router.query.id);
  const PANEL_DATA = [
    {
      name: "Team Leader",
      value: "Juan Dela Cruz"
    },
    {
      name: "Affiliation",
      value: "De La Salle University",
    },
    {
      name: "Barangay",
      value: "209",
    },
    {
      name: "Town",
      value: "Makati",
    },
    {
      name: "Province",
      value: "Metro Manila",
    },
  ];
  return (
    <AdminLayout>
      <div className="flex justify-between mt-8">
        <div className="flex items-start space-x-4">
          <Waves className="w-8 aspect-square fill-t-highlight" />
          <h1 className="text-3xl text-t-highlight">Team Name</h1>
        </div>
      </div>
      <section className="mt-5">
        <TeamTabs
          tab1={<SurveyTableAdmin className="w-full mt-8" data={SampleData} />}
          tab2={""}
          tab3={
            <TeamInfoTab data={PANEL_DATA} />
          }
        />
      </section>
    </AdminLayout>
  );
};

export default TeamInfo;
