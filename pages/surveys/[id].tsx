import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import SurveySection from "@components/survey-section";
import { sectionsTemplate } from "@models/survey-summary";
import { ChevronLeftIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";
import SurveyInfo from "@components/survey-info";
import { useSession } from "next-auth/react";
import { onUnauthenticated } from "@lib/utils";
import Breadcrumbs from "@components/breadcrumbs";
import axios from "axios";

import { toastAxiosError } from "@lib/utils";
import { toast } from "react-toastify";
import { toastSuccessConfig } from "@lib/toast-defaults";

const ConfirmModal = dynamic(() =>
  import("@components/admin/modals/remove").then((mod) => mod.RemoveModal)
);

type SurveyProps = {
  teamId: string | null;
  surveyId: string | undefined;
};

type SurveySummary = {
  id: number;
  date: string;
  stationName: string;
  startLongitude: number;
  startLatitude: number;
  isVerified: boolean;
  isComplete: boolean;
  submissionType: string;
};

const Survey: NextPage<SurveyProps> = ({ teamId, surveyId }) => {
  const router = useRouter();
  const { data: session } = useSession({
    required: true,
    onUnauthenticated: onUnauthenticated(router),
  });
  const isAdmin = session?.user.isAdmin;
  const [surveyDetails, setSurveyDetails] = useState<SurveySummary | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [action, setAction] = useState<"verify" | "complete">("verify");

  const fetchSurveyDetails = async () => {
    try {
      const response = await axios.get(`/api/surveys/${surveyId}`);
      setSurveyDetails(response.data[0]);
      return response.data;
    } catch (error) {
      console.error("Error fetching survey details:", error);
      return null;
    }
  };

  const handleAction = async () => {
    try {
      await axios.post(`/api/surveys/${surveyId}/edit?query=${action}`);
      setModalOpen(false);

      let success = String(action);
      if (action === "verify") {
        success = "verifie";
      }

      toast.success(`Survey has been ${success}d successfully!`, toastSuccessConfig);
      setSurveyDetails((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          isVerified: action === "verify" ? true : prev.isVerified,
          isComplete: action === "complete" ? true : prev.isComplete,
        };
      });
    } catch (error) {
      toastAxiosError(error);
    } finally {
      setModalOpen(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('File selected:', file);
    }
  };

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
          {surveyDetails?.submissionType == "MANUAL" && (
            <div>
              <button className="btn bg-highlight text-t-highlight px-2 rounded-md" onClick={() => document.getElementById('file-input')?.click()}>
                Upload Excel Sheet
              </button>
              <input
                type="file"
                id="file-input"
                accept=".xlsx"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          )}
        </div>
      )}

      {surveyDetails != null ? (
        <SurveyInfo
          date={surveyDetails.date}
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

      {isAdmin && (
        <div className="flex justify-start mx-auto max-w-3xl w-full gap-2 mb-5">
          {!surveyDetails?.isVerified ? (
            <button
              className="btn bg-highlight text-t-highlight px-2 rounded-md"
              id="verify"
              onClick={() => {
                setAction("verify");
                setModalOpen(true);
              }}
            >
              Verify
            </button>
            ) : (
              <button
                className="btn border border-yellow-500 text-t-highlight bg-white px-2 rounded-md"
                id="complete"
                disabled
              >
                Verified
              </button>
          )}
          {!surveyDetails?.isComplete ? (
            <button
              className="btn bg-highlight text-t-highlight px-2 rounded-md"
              id="complete"
              onClick={() => {
                setAction("complete");
                setModalOpen(true);
              }}
            >
              Complete
            </button>
          ) : (
            <button
              className="btn border border-yellow-500 text-t-highlight bg-white px-2 rounded-md cursor-not-allowed"
              id="complete"
              disabled
            >
              Completed
            </button>
          )}
        </div>
      )}

      {modalOpen && (
        <ConfirmModal
          isOpen={modalOpen}
          close={() => setModalOpen(false)}
          onAction={handleAction}
          title={action === "verify" ? "Verify Survey" : "Complete Survey"}
          message={`Are you sure you want to ${action} this survey?`}
        />
      )}
    </>
  );
};

export default Survey;

export const getServerSideProps: GetServerSideProps<SurveyProps> = async (
  context: GetServerSidePropsContext
) => {
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
  return breadcrumbItems.filter((item) => Object.keys(item).length !== 0);
}
