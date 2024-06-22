//* Hooks
import { useState, useCallback } from "react";
import { useAdminAccess } from "@lib/useRoleAccess";
import { useRetriever } from '@lib/useRetriever'

//* Components
import { TeamsTable } from "@components/admin/teams-table/teams-table";
import { TeamRequests } from "@components/admin/team-requests/team-requests";
import AdminLayout from "@components/layouts/admin-layout";
import { TeamsSummary } from "@pages/api/admin/teams";

//* Utils
import cn from "classnames";

const Teams = () => {
  const [filters, setFilters] = useState<{
    [key: string]: string;
  }>({
    name: '',
    town: '',
    province: '',
    status: 'APPROVED'
  });

  const [selected, setSelected] = useState<0 | 1>(0);
  const handlePageSelect = (page: 0 | 1) => {
    setSelected(page);
  };

  const [queryString, setQueryString] = useState('?status=APPROVED');
  const { data: existingTeams, mutate } = useRetriever<TeamsSummary[]>(`/admin/teams${queryString}`, []);
  const { data: pendingTeams, mutate: mutatePendingTeams } = useRetriever<TeamsSummary[]>('/admin/teams?status=PENDING', []);

  const handleFilterChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };
  const applyFilters = useCallback(() => {
    let query = '?';
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        query += `${key}=${encodeURIComponent(filters[key])}&`;
      }
    });
    setQueryString(query.slice(0, -1)); // Remove the trailing '&'
    mutate(); // Re-fetch data with new filters
  }, [filters, mutate]);

  const updateTeams = useCallback(() => {
    mutatePendingTeams();
    mutate();
  }, [mutatePendingTeams, mutate]);

  useAdminAccess();

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
            TEAM REQUESTS ({pendingTeams.length})
          </button>
        </div>
        {selected === 0 && (
          <div className="mt-8 flex gap-6 w-[50%]">
            <input 
              type="text" 
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
              placeholder="Team Name" 
            />
            <input 
              type="text" 
              name="town"
              value={filters.town}
              onChange={handleFilterChange}
              placeholder="Town" 
            />
            <input 
              type="text" 
              name="province"
              value={filters.province}
              onChange={handleFilterChange}
              placeholder="Province" 
            />
            <select 
              name="status" 
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">All Status</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <button 
              className="bg-primary text-secondary rounded-full px-4 py-2 w-72"
              onClick={applyFilters}
            >
              Filter
            </button>
          </div>
        )}
      </section>
      <section>
        {selected === 0 ? (
          <TeamsTable
            className="w-full mt-8 mb-20"
            data={existingTeams}
          />
        ) : (
          <TeamRequests
            className="w-full mt-8 mb-20"
            data={pendingTeams}
            updateTeams={updateTeams}
          />
        )}
      </section>
    </AdminLayout>
  );
};

export default Teams;
