//* React
import { useRouter } from "next/router";
import { useState, useEffect, useCallback } from "react";

//* Components
import { Waves } from "@components/icons";
import AdminLayout from "@components/layouts/admin-layout";
import { SurveyTableAdmin } from "@components/admin/survey-table/survey-table-admin";
import TeamTabs from "@components/admin/team-tabs/team-tabs";
import TeamInfoTab from "@components/admin/team-tabs/team-info-tab";
import { MembersTable } from "@components/admin/members-table/members-table";
import Breadcrumbs from "@components/breadcrumbs";

//* Utils
import { useRetriever } from "@lib/useRetriever";
import { useAdminAccess } from "@lib/useRoleAccess";

//* API
import axios from "axios";
import { TeamData } from "@pages/api/admin/teams/[teamId]";

type UsersSummary = {
  id: number;
  userId: number;
  affiliation: string | null;
  firstName: string;
  lastName: string;
  teamId: number;
  isLeader: boolean;
  status: string;
};

const TeamInfo = () => {
  useAdminAccess();
  const router = useRouter();
  const teamId = router.query.id;
  const { data: teamData, mutate } = useRetriever<TeamData>(teamId ? `/admin/teams/${teamId}` : null);
  const { data: membersData, mutate: mutateMembers } = useRetriever<UsersSummary[]>(teamId ? `/admin/teams/${teamId}/members` : null);

  const [surveysData, setSurveysData] = useState([]);
  const [surveysTotalPages, setSurveysTotalPages] = useState(0);
  const [surveysCurrentPage, setSurveysCurrentPage] = useState(1);
  const [surveysPageSize] = useState(15);
  const [surveysSorting, setSurveysSorting] = useState({ sortBy: "date", sortOrder: "desc" });

  const fetchData = useCallback(async () => {
    const { sortBy, sortOrder } = surveysSorting;
    const response = await axios.get("/api/admin/surveys", {
      params: {
        teamId: teamId, 
        page: surveysCurrentPage,
        pageSize: surveysPageSize,
        sortBy,
        sortOrder,
      },
    });
    setSurveysData(response.data.surveys);
    setSurveysTotalPages(response.data.totalPages);
  }, [teamId, surveysSorting, surveysCurrentPage, surveysPageSize]);

  useEffect(() => {
    if (teamId) {
      fetchData();
    }
  }, [fetchData, teamId]);

  const handleSurveysSortChange = (sortBy: string, sortOrder: string) => {
    setSurveysSorting({ sortBy, sortOrder });
  };

  // Function to handle updates to members data
  const handleUpdateMembers = async (updatedMembers: UsersSummary[]) => {
    try {
      await mutateMembers(updatedMembers, false);
    } catch (error) {
      console.error('Error updating members:', error);
    }
  };

  return (
    <AdminLayout>
      <Breadcrumbs items={[{ label: "All teams", path: "/admin/teams" }, { label: teamData?.name, path: "/" }]} />
      <div className="flex justify-between mt-8">
        <div className="flex items-start space-x-4">
          <Waves className="w-8 aspect-square fill-t-highlight" />
          <h1 className="text-3xl text-t-highlight flex items-center">{ teamData?.name }{teamData?.isVerified}</h1>
        </div>
      </div>
      <section className="mt-5">
        <TeamTabs
          tab1={
            <SurveyTableAdmin
              className="w-full mt-8"
              data={surveysData || []}
              totalPages={surveysTotalPages}
              currentPage={surveysCurrentPage}
              setCurrentPage={setSurveysCurrentPage}
              handleSortChange={handleSurveysSortChange}
            />
          }
          tab2={
            <MembersTable
              className="w-full mt-8"
              data={membersData || []} // Pass membersData or an empty array if null
              onUpdateData={handleUpdateMembers} // Pass the onUpdateData function to handle updates
            />
          }
          tab3={<TeamInfoTab data={teamData} />}
        />
      </section>
    </AdminLayout>
  );
};

export default TeamInfo;