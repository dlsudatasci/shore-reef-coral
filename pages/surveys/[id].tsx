import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import SurveySection from "@components/survey-section";
import { sectionsTemplate } from "@models/survey-summary";
import { ChevronLeftIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";
import SurveyInfo from "@components/survey-info";
import { useSession } from "next-auth/react";
import { onUnauthenticated } from "@lib/utils";
import Breadcrumbs from "@components/breadcrumbs";
import axios from "axios";


type SurveyProps = {
  teamId: string | null;
  surveyId: string | undefined;
};

type SurveySummary = {
  date: Date;
  stationName: string;
  startLongitude: number;
  startLatitude: number;
};

const Survey: NextPage<SurveyProps> = ({ teamId, surveyId }) => {
  const router = useRouter();
  const { data: session } = useSession({
    required: true,
    onUnauthenticated: onUnauthenticated(router),
  });
  const isAdmin = session?.user.isAdmin;
  const [surveyDetails, setSurveyDetails] = useState<SurveySummary | null>(null);

  const fetchSurveyDetails = async () => {
    try {
      const response = await axios.get(`/api/surveys/${surveyId}`);
      setSurveyDetails(response.data[0]);
      console.log(surveyDetails)
      return response.data;
    } catch (error) {
      console.error("Error fetching survey details:", error);
      return null;
    }
  };
  
  useEffect(() => {
    console.log(surveyDetails);
  }, [surveyDetails]);

  // Use useEffect to fetch survey details on component mount
  useEffect(() => {
    fetchSurveyDetails();
  }, []);

  const breadcrumbItems = getBreadcrumbItems(isAdmin, teamId, surveyId);
  
  return (
    <>
      <Head>
        <title>Reef Mo | Survey</title>
      </Head>

      <div className="max-w-3xl w-full text-primary mx-auto mt-8 mb-4">
        <Breadcrumbs items={breadcrumbItems} />
        <ChevronLeftIcon
          className="cursor-pointer w-8 hover:text-t-highlight"
          onClick={() => router.back()}
        />
      </div>

      {isAdmin && (
        <div className="flex justify-start mx-auto max-w-3xl w-full gap-8 mb-5">
          <button className="btn bg-highlight text-t-highlight px-2 rounded-md">
            Download Image
          </button>
          <button className="btn bg-highlight text-t-highlight px-2 rounded-md">
            Download Data Form
          </button>
        </div>
      )}

      {/* Render SurveyInfo component with survey details */}
      {surveyDetails != null ? (
        console.log(surveyDetails.date),
        <SurveyInfo
          date={String(surveyDetails.date)}
          latitude={String(surveyDetails.startLatitude)}
          longitude={String(surveyDetails.startLongitude)}
          stationName={surveyDetails.stationName}
        />
      ) : (
        <p>Loading survey details...</p>
      )}

      <section className="mb-20">
        <div className="grid max-w-3xl mx-auto gap-y-8">
          {sectionsTemplate.map((section) => (
            <SurveySection
              key={section.title}
              title={section.title}
              subsections={section.subsections}
            />
          ))}
        </div>
      </section>
    </>
  );
};

export default Survey;

export const getServerSideProps: GetServerSideProps<SurveyProps> = async (context: GetServerSidePropsContext) => {
  const teamId = context.req.headers.referer?.split("/").at(-1) || null;
  const surveyId = context.params?.id;

  return {
    props: {
      teamId: teamId !== "surveys" && teamId !== "dashboard" ? teamId : null,
      surveyId: Array.isArray(surveyId) ? surveyId[0] : surveyId,
    },
  };
};

function getBreadcrumbItems(
  isAdmin: boolean | undefined,
  teamId: string | string[] | null | undefined,
  surveyId: string | string[] | undefined
) {
  const breadcrumbItems = [
    {
      label: isAdmin ? "All teams" : "Dashboard",
      path: isAdmin ? "/admin/teams" : `/dashboard`,
    },
    !teamId
      ? {}
      : {
          label: "Team name",
          path: isAdmin ? `/admin/teams/${teamId}` : `/dashboard`,
        },
    { label: `Survey ${surveyId}`, path: "" },
  ];
  return breadcrumbItems.filter((item) => Object.keys(item).length !== 0); // Filter out empty objects
}
