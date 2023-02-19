import Laptop from "@components/icons/laptop";
import Waves from "@components/icons/waves";
import DashboardLayout from "@components/layouts/dashboard-layout";
import { SurveyTable } from "@components/survey-table";
import { PencilIcon } from "@heroicons/react/outline";
import { useRetriever } from "@lib/useRetriever";
import { UserTeamsAPI } from "@pages/api/me/teams";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

const Team = () => {
  const router = useRouter();
  const { status, data } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace("/login?error=Please login to continue.");
    },
  });
  const { data: teams } = useRetriever<UserTeamsAPI[]>(`/me/teams`);
  // if(teams?.length === 0){
  //   router.push("/dashboard");
  // }

  const surveyData = [
    {
      date: new Date("February 14, 2023"),
      id: 0,
      dataType: "Photos",
      startLatitude: 14.576,
      startLongtitude: 121.05,
      stationName: "Station name",
      status: "Completed",
      verified: true,
    },
    {
      date: new Date("February 14, 2023"),
      id: 0,
      dataType: "Photos",
      startLatitude: 14.576,
      startLongtitude: 121.05,
      stationName: "Station name",
      status: "Completed",
      verified: true,
    },
  ];

  return (
    <DashboardLayout>
      <Head>
        <title>Reef Mo | Team</title>
      </Head>
      <div className="grid place-items-center mt-20">
        <div className="flex items-center border-secondary border py-4 px-2">
          <h1 className="mr-4 font-comic-cat text-secondary">Dashboard</h1>
          <Laptop className="w-14 fill-secondary" />
        </div>
        <div className="flex justify-between w-full mt-10">
          <div className="text-white">
            <div className="flex items-center gap-4">
              <Waves className="fill-white w-6" />
              <h3 className="my-0 text-2xl">Team Name</h3>
            </div>
            <button className="flex gap-2 underline font-light">
              <PencilIcon className="w-5" />
              Manage team
            </button>
          </div>
          <div className="space-x-4">
            <Link
              href="#"
              className="text-primary bg-highlight px-5 py-3 rounded-md"
            >
              Submit a survey
            </Link>
            <Link
              href="#"
              className="bg-primary text-white px-5 py-3 rounded-md"
            >
              Submit coral reassessment
            </Link>
          </div>
        </div>
        <div className="w-full mt-10 ">
          <SurveyTable data={surveyData} className="mx-auto text-center" />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Team;
