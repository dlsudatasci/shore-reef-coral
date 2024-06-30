//* React
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

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
import { TeamData } from "@pages/api/admin/teams/[teamId]";

type UsersSummary = {
  id: number;
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
  const { data: teamData, mutate } = useRetriever<TeamData>(`/admin/teams/${teamId}`);
  const { data: membersData, mutate: mutateMembers } = useRetriever<UsersSummary[]>(`/admin/teams/${teamId}/members`);

  // Function to handle updates to members data
  const handleUpdateMembers = async (updatedMembers: UsersSummary[]) => {
    // Perform API call or any necessary state management to update membersData
    try {
      // Example: Update membersData state or mutate function
      // For demonstration, assuming mutateMembers is used for updating data
      await mutateMembers(updatedMembers, false); // Example usage, adjust as per your use case
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
              className="w-full mt-8 mb-20"
              data={[]} // Example data, replace with actual survey data
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