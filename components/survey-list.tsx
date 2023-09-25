import Link from 'next/link'
import { Waves } from './icons'
import { HTMLAttributes, useMemo, useState } from 'react'
import { UserTeamsAPI } from '@pages/api/me/teams'
import { SurveyTable } from './survey-table'
import { TeamSurveySummary } from '@pages/api/teams/[teamId]/surveys'
import { useSession } from 'next-auth/react'
import { onUnauthenticated } from '@lib/utils'
import { useRouter } from 'next/router'

type SurveyListProps = {
  teams: UserTeamsAPI[];
} & HTMLAttributes<HTMLDivElement>;

const SampleData: TeamSurveySummary[] = Array.from({ length: 10 }, (_, id) => ({
  id,
  date: new Date(Date.now() - Math.random() * 1000000000),
  stationName: "Station name",
  startLatitude: Math.random() * 100,
  startLongtitude: Math.random() * 100,
  dataType: "Photos",
  status: "COMPLETE",
}));

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
      <SurveyTable className="w-full mt-8" data={SampleData} />
    </section>
  );
}

export default SurveyList;
