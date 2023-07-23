import { TeamsTable } from "@components/admin/teams-table/teams-table";
import { Waves } from "@components/icons";
import AdminLayout from "@components/layouts/admin-layout";
import { TeamsSummary } from "@pages/api/admin/teams";
import { useState } from "react";
import cn from "classnames";
import TeamRequests from "@components/admin/team-requests/team-requests";

const Teams = () => {
  const SAMPLE_DATA: TeamsSummary[] = Array.from({ length: 10 }, (_, id) => ({
    id,
    affiliation: "Affiliation",
    isVerified: id % 2 === 0,
    name: "Team name",
    province: "Metro Manila",
    town: "Makati",
    UsersOnTeam: [
      {
        isLeader: id % 2 === 0,
        userId: 1,
      },
      {
        isLeader: id % 2 === 1,
        userId: 2,
      },
    ],
  }));
  const [selected, setSelected] = useState<0 | 1>(0);
  const handlePageSelect = (page: 0 | 1) => {
    setSelected(page);
  };

  return (
    <AdminLayout>
      <section className="my-8">
        <h1 className="text-3xl font-sans text-t-highlight">Manage Teams</h1>
        <div>
          <button
            className={cn(
              selected === 0
                ? "bg-primary text-secondary"
                : "bg-transparent text-primary",
              "p-3 border-2 border-primary"
            )}
            onClick={() => handlePageSelect(0)}
          >
            ALL TEAMS
          </button>
          <button
            className={cn(
              selected === 1
                ? "bg-primary text-secondary"
                : "bg-transparent text-primary",
              "p-3 border-2 border-primary"
            )}
            onClick={() => handlePageSelect(1)}
          >
            TEAM REQUESTS (5)
          </button>
        </div>
        {selected === 0 && (
          <div className="mt-8 flex gap-6 w-[50%]">
            <input type="text" placeholder="Team Name" />
            <select name="location" id="location">
              <option value="all">All Locations</option>
              <option value="manila">Manila</option>
            </select>
            <button className="bg-primary text-secondary rounded-full px-4 py-2 w-72">
              Filter
            </button>
          </div>
        )}
      </section>
      <section>
        {selected === 0 ? (
          <TeamsTable
            className="w-full mt-8"
            data={SAMPLE_DATA.filter((team) => team.isVerified)}
          />
        ) : (
          <TeamRequests data={SAMPLE_DATA.filter((team) => !team.isVerified)} />
        )}
      </section>
    </AdminLayout>
  );
};

export default Teams;
