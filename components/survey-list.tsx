import Link from 'next/link'
import { Waves } from './icons'
import { HTMLAttributes, useMemo, useState, useEffect, useCallback } from 'react'
import { UserTeamsAPI } from '@pages/api/me/teams'
import { SurveyTable } from './survey-table'
import { useSession } from 'next-auth/react'
import { onUnauthenticated } from '@lib/utils'
import { useRouter } from 'next/router'
import axios from 'axios'

type SurveyListProps = {
  teams: UserTeamsAPI[];
} & HTMLAttributes<HTMLDivElement>;

function SurveyList({ teams, ...props }: SurveyListProps) {
  const router = useRouter();
  const { data: session } = useSession({
    required: true,
    onUnauthenticated: onUnauthenticated(router),
  });
  const [teamId, setTeamId] = useState(teams[0].id);
  const team = useMemo(
    () => teams.find((t) => t.id === teamId),
    [teams, teamId]
  );

  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(15);
  const [sorting, setSorting] = useState({ sortBy: "date", sortOrder: "desc" });

  const fetchData = useCallback(async () => {
    const { sortBy, sortOrder } = sorting;
    const response = await axios.get(`/api/teams/${teamId}/surveys`, {
      params: {
        page: currentPage,
        pageSize,
        sortBy,
        sortOrder,
      },
    });
    setData(response.data.surveys);
    setTotalPages(response.data.totalPages);
  }, [sorting, currentPage, pageSize, teamId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSortChange = (sortBy: string, sortOrder: string) => {
    setSorting({ sortBy, sortOrder });
  };

  return (
    <section {...props}>
      <div className="flex justify-between">
        <div className="flex items-start space-x-4">
          <Waves className="w-8 aspect-square fill-secondary" />
          <div>
            <select
              className="font-comic-cat w-auto"
              value={teamId}
              onChange={(e) => setTeamId(Number(e.target.value))}
            >
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <div className="h-6">
              {team?.UsersOnTeam[0].userId === session?.user.id && (
                <Link
                  className="text-white underline"
                  href={`/teams/${teamId}`}
                >
                  manage team
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className="flex space-x-4">
          <Link className="btn highlight" href="/surveys/submit">
            SUBMIT A SURVEY
          </Link>
          <Link className="btn primary" href="/reassess/submit">
            SUBMIT CORAL REASSESSMENT
          </Link>
        </div>
      </div>
      <SurveyTable 
        className="w-full mt-8"
        data={data}
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        handleSortChange={handleSortChange} 
      />
    </section>
  );
}

export default SurveyList;
