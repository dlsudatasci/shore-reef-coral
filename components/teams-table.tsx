import { Disclosure } from '@headlessui/react'
import { generateFuzzyFilter } from '@lib/global-filter'
import { TeamProfileSummary } from '@pages/api/teams'
import { rankings } from '@tanstack/match-sorter-utils'
import styles from '@styles/Teams.module.css'
import cn from 'classnames'
import { useState } from 'react'
import { MinusIcon, PlusIcon } from '@heroicons/react/outline'
import { BadgeCheckIcon } from '@heroicons/react/solid'
import {
	useReactTable,
	getCoreRowModel,
	getFilteredRowModel,
	createColumnHelper,
	ColumnFiltersState
} from '@tanstack/react-table'
import DebouncedInput from './debounced-input'

type TeamsTableProps = {
	data: TeamProfileSummary[]
}

const columnHelper = createColumnHelper<TeamProfileSummary>()

const columns = [
	columnHelper.accessor('team.name', { header: 'Name', id: 'name' }),
	columnHelper.accessor(({ user }) => `${user.firstName} ${user.lastName}`, { id: 'leader' }),
	columnHelper.accessor(({ team }) => `${team.town}, ${team.province}`, { id: 'location' }),
	columnHelper.accessor('team._count.UsersOnTeam', { header: 'Count', id: 'count' }),
	columnHelper.accessor('team.isVerified', { id: 'isVerified' })
]

const TeamsTable = ({ data }: TeamsTableProps) => {
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

	const table = useReactTable<TeamProfileSummary>({
		data,
		columns,
		state: {
			columnFilters,
		},
		filterFns: {
			fuzzy: generateFuzzyFilter(rankings.CONTAINS)
		},
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
	})

	return (
		<div>
			<div className="grid gap-x-4 gap-y-1 grid-cols-2 mb-6 max-w-2xl">
				<p className="col-span-full text-secondary font-comic-cat">filters</p>
				<DebouncedInput
					type="text"
					placeholder="Team name"
					value={table.getColumn('name').getFilterValue() as string}
					onChange={value => table.getColumn('name').setFilterValue(value)}
				/>
				<DebouncedInput
					type="text"
					placeholder="Location"
					value={table.getColumn('location').getFilterValue() as string}
					onChange={value => table.getColumn('location').setFilterValue(value)}
				/>
			</div>
			<div className="space-y-1.5">
				{table.getRowModel().rows.map(row => (
					<Disclosure as="div" key={row.id} >
						{
							({ open }: { open: boolean }) => (
								<>
									<Disclosure.Button className={cn(styles.header, open ? 'bg-highlight text-t-highlight' : 'bg-secondary  text-primary')}>
										<div className="flex justify-between items-center w-full">
											<div className="flex items-center space-x-2">
												<p>{row.getValue('name')}</p>
												{row.getValue('isVerified') as boolean &&
													<BadgeCheckIcon className="w-6 aspect-square text-green-600" />
												}
											</div>
											{
												open ? <MinusIcon className="w-6 aspect-square" /> : <PlusIcon className="w-6 aspect-square" />
											}
										</div>
									</Disclosure.Button>
									<Disclosure.Panel className={styles.panel}>
										<div className="grid md:grid-cols-3 gap-y-4 gap-x-2">
											<div>
												<h6>Team Leader/Creator:</h6>
												<p>{row.getValue('leader')}</p>
											</div>
											<div>
												<h6>Location of the team:</h6>
												<p>{row.getValue('location')}</p>
											</div>
											<div>
												<h6>No. of members/volunteers:</h6>
												<p>{row.getValue('count')}</p>
											</div>
										</div>
										<button className="mx-auto block btn primary mt-8">Join Team</button>
									</Disclosure.Panel>
								</>
							)
						}
					</Disclosure>
				))}
			</div>
		</div>
	)
}

export default TeamsTable
