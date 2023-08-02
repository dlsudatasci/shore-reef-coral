import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import SurveySection from "@components/survey-section";
import { sectionsTemplate } from "@models/survey-summary";
import { ChevronLeftIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";
import SurveyInfo from "@components/survey-info";
import { useSession } from "next-auth/react";
import { onUnauthenticated } from "@lib/utils";
import Breadcrumbs from "@components/breadcrumbs";

type SurveyProps = {
  teamId: string;
};

const Survey: NextPage<SurveyProps> = ({ teamId }) => {
  const router = useRouter();
  const { data: session } = useSession({
    required: true,
    onUnauthenticated: onUnauthenticated(router),
  });
  const isAdmin = session?.user.isAdmin;
  const surveyId = router.query.id;

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
          onClick={router.back}
        />
      </div>
      {isAdmin ? (
        <div className="flex justify-start mx-auto max-w-3xl w-full gap-8 mb-5">
          <button className="btn bg-highlight text-t-highlight px-2 rounded-md">
            Download Image
          </button>
          <button className="btn bg-highlight text-t-highlight px-2 rounded-md">
            Download Data Form
          </button>
        </div>
      ) : (
        ""
      )}
      <SurveyInfo
        date={"July 24, 2023"}
        latitude="0.00"
        longitude="0.00"
        stationName="Station Name"
      />

      <section className="mb-20">
        <div className="grid max-w-3xl mx-auto gap-y-8">
          {sectionsTemplate.map((e) => (
            <SurveySection
              key={e.title}
              title={e.title}
              subsections={e.subsections}
            />
          ))}
        </div>
      </section>
    </>
  );
};

export default Survey;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const teamId = context.req.headers.referer?.split("/").at(-1);
  return {
    props: {
      teamId: teamId !== "surveys" && teamId !== "dashboard" ? teamId : null,
    },
  };
};

function getBreadcrumbItems(
  isAdmin: boolean | undefined,
  teamId: string | string[] | undefined,
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
  return breadcrumbItems;
}
