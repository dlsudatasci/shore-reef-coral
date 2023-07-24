import { Waves } from "@components/icons";
import AdminLayout from "@components/layouts/admin-layout";
import { SurveyTableAdmin } from "@components/survey-table";
import { TeamSurveySummary } from "@pages/api/teams/[teamId]/surveys";
import { useRouter } from "next/router";
import { useState } from "react";

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


  return (
    <AdminLayout>
      <div className="flex justify-between mt-8">
        <div className="flex items-start space-x-4">
          <Waves className="w-8 aspect-square fill-t-highlight" />
          <h1 className="text-3xl text-t-highlight">Team Name</h1>
        </div>
        <div className="flex space-x-4">
        </div>
      </div>
      <SurveyTableAdmin className="w-full mt-8" data={SampleData} />
    </AdminLayout>
  )
}

export default TeamInfo