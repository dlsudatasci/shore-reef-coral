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
};

const TeamInfo = () => {
  useAdminAccess();
  const router = useRouter();
  const teamId = router.query.id;
  const { data: teamData, mutate } = useRetriever<TeamData>(`/admin/teams/${teamId}`);
  const { data: membersData } = useRetriever<UsersSummary[]>(`/admin/teams/${teamId}/members`);


  return (
    <AdminLayout>
      <Breadcrumbs items={[{ label: "All teams", path: "/admin/teams" }, { label: teamData?.name, path: "/" }]} />
      <div className="flex justify-between mt-8">
        <div className="flex items-start space-x-4">
          <Waves className="w-8 aspect-square fill-t-highlight" />
          <h1 className="text-3xl text-t-highlight">{ teamData?.name }</h1>
        </div>
      </div>
      <section className="mt-5">
        <TeamTabs
          tab1={
            <SurveyTableAdmin
              className="w-full mt-8 mb-20"
              data={[]}
            />
          }
          tab2={<MembersTable className="w-full mt-8" data={membersData || []} />}
          tab3={<TeamInfoTab data={teamData} />}
        />
      </section>
    </AdminLayout>
  );
};

export default TeamInfo;
