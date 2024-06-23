/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback, ChangeEvent } from "react";
import useSWRImmutable from 'swr/immutable';
import { useRetriever } from '@lib/useRetriever';
import axios from 'axios';

//* Components
import { TeamsTable } from "@components/admin/teams-table/teams-table";
import { TeamRequests } from "@components/admin/team-requests/team-requests";
import AdminLayout from "@components/layouts/admin-layout";
import LoadingSpinner from '@components/loading-spinner';
import { TeamsSummary } from "@pages/api/admin/teams";

//* Utils
import cn from "classnames";

// Define a type for the filters
type Filters = {
  name: string;
  town: string;
  province: string;
  status: string;
};

const Teams = () => {
  const [filters, setFilters] = useState<Filters>({
    name: '',
    town: '',
    province: '',
    status: 'APPROVED'
  });

  const [selected, setSelected] = useState<0 | 1>(0);
  const [towns, setTowns] = useState<string[]>([]);

  const { data: locations, isLoading } = useSWRImmutable('/bgy-masterlist.json', url => axios.get(url).then(res => res.data));
  const [queryString, setQueryString] = useState('?status=APPROVED');
  const { data: existingTeams, mutate } = useRetriever<TeamsSummary[]>(`/admin/teams${queryString}`, []);
  const { data: pendingTeams, mutate: mutatePendingTeams } = useRetriever<TeamsSummary[]>('/admin/teams?status=PENDING', []);

  const handlePageSelect = (page: 0 | 1) => {
    setSelected(page);
  };

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value
    }));

    if (name === 'province') {
      const selectedProvince = locations?.[1]?.[value] || [];
      setTowns(selectedProvince);
      setFilters((prev) => ({ ...prev, town: '' }));
    }
  };

  const applyFilters = useCallback(() => {
    let query = '?';
    Object.keys(filters).forEach((key) => {
      if (filters[key as keyof Filters]) {
        query += `${key}=${encodeURIComponent(filters[key as keyof Filters])}&`;
      }
    });
    setQueryString(query.slice(0, -1)); // Remove the trailing '&'
    mutate(); // Re-fetch data with new filters
  }, [filters, mutate]);

  const updateTeams = useCallback(() => {
    mutatePendingTeams();
    mutate();
  }, [mutatePendingTeams, mutate]);

  useEffect(() => {
    if (filters.province) {
      const selectedProvince = locations?.[1]?.[filters.province] || [];
      setTowns(selectedProvince);
    }
  }, [filters.province, locations]);

  if (isLoading) {
    return <LoadingSpinner borderColor="border-highlight" />;
  }

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
          <div className="mt-8 flex gap-6 w-[75%]">
            <input 
              type="text" 
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
              placeholder="Team Name" 
            />
            <select 
              name="province"
              value={filters.province}
              onChange={handleFilterChange}
            >
              <option value="">Select Province</option>
              {locations[0].map((l: string) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
            <select 
              name="town"
              value={filters.town}
              onChange={handleFilterChange}
              disabled={!filters.province} // Disable town dropdown if no province is selected
            >
              <option value="">Select Town</option>
              {towns.map(town => (
                <option key={town} value={town}>{town}</option>
              ))}
            </select>
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
