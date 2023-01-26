import Link from 'next/link'
import Waves from './icons/waves'
import { HTMLAttributes, useMemo, useState } from 'react'
import { UserTeamsAPI } from '@pages/api/me/teams'
import { SurveyTable } from './survey-table'
import { TeamSurveySummary } from '@pages/api/teams/[teamId]/surveys'

type SurveyListProps = {
	teams: UserTeamsAPI[]
} & HTMLAttributes<HTMLDivElement>

const SampleData: TeamSurveySummary[] = Array.from({ length: 10 }, (_, id) => ({
	id,
	date: new Date(Date.now() - Math.random() * 1000000000),
	stationName: 'Station name',
	startLatitude: Math.random() * 100,
	startLongtitude: Math.random() * 100,
	dataType: 'Photos',
	status: 'Completed',
	verified: true,
}))

function SurveyList({ teams, ...props }: SurveyListProps) {
	const [teamId, setTeamId] = useState(teams[0].id)

	return (
		<section {...props}>
			<div className="flex justify-between items-center">
				<div className="flex items-center space-x-4">
					<Waves className="w-8 aspect-square fill-secondary" />
					<select className="font-comic-cat w-auto" value={teamId} onChange={e => setTeamId(Number(e.target.value))}>
						{teams.map(t =>
							<option key={t.id} value={t.id}>{t.name}</option>
						)}
					</select>
				</div>
				<div className="flex space-x-4">
					<button className="btn highlight">SUBMIT A SURVEY</button>
					<button className="btn primary">SUBMIT CORAL REASSESSMENT</button>
				</div>
			</div>
			<SurveyTable className="w-full mt-8" data={SampleData} />
		</section>
	)
}

export default SurveyList
