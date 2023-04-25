import app, { fetcher } from '@lib/axios-config'
import { generateFuzzyFilter } from '@lib/global-filter'
import { onUnauthenticated, toastAxiosError } from '@lib/utils'
import { MemberAPI } from '@pages/api/teams/[teamId]/members'
import { Status } from '@prisma/client'
import { rankings } from '@tanstack/match-sorter-utils'
import { ColumnFiltersState, createColumnHelper, flexRender, getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table'
import { useSession } from 'next-auth/react'
import { TableHTMLAttributes, useState } from 'react'
import useSWR from 'swr'

type RequestTableProps = {
	teamId: number | string
} & TableHTMLAttributes<HTMLTableElement>

type member = MemberAPI["UsersOnTeam"][number]

const helper = createColumnHelper<member>()

export function RequestTable({ teamId, ...props }: RequestTableProps) {
	const { data, mutate } = useSWR<MemberAPI>(`/teams/${teamId}/members`, fetcher)
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([{ id: 'status', value: Status.ACCEPTED }])
	const session = useSession({ required: true })

	const users = data?.UsersOnTeam

	const columns = [
		helper.accessor(row => `${row.user.firstName} ${row.user.lastName}`, {
			id: 'name',
			header: 'Member Name'
		}),
		helper.accessor('user.affiliation', { header: 'Affiliation' }),
		helper.accessor('status', { header: 'Status' }),
		helper.display({
			id: 'actions',
			header: 'Actions',
			cell({ row }) {
				const { id, status, user } = row.original

				if (status === Status.ACCEPTED) {
					if (user.id === session.data?.user.id) return <></>
					
					return (
						<button className="btn highlight" onClick={() => handleAction(id, Status.INACTIVE)}>Remove</button>
					)
				}

				return (
					<div className="flex space-x-4">
						<button className="btn highlight" onClick={() => handleAction(id, Status.ACCEPTED)}>Accept</button>
						<button className="btn secondary" onClick={() => handleAction(id, Status.REJECTED)}>Reject</button>
					</div>
				)
			}
		})
	]

	async function handleAction(reqId: number, status: Status) {
		try {
			await mutate(app.patch(`/requests/${reqId}`, { status }), {
				optimisticData(d) {
					return {
						...d!,
						UsersOnTeam: users?.filter(e => e.id !== reqId) ?? []
					}
				}
			})
		} catch (e) {
			toastAxiosError(e)
		}
	}

	const table = useReactTable<member>({
		data: data?.UsersOnTeam ?? [],
		state: {
			columnFilters,
		},
		filterFns: {
			fuzzy: generateFuzzyFilter(rankings.EQUAL)
		},
		columns,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnFiltersChange: setColumnFilters,
	})

	return (
		<section className="my-4">
			<header className="flex justify-between">
				<h2 className="text-white">{data?.name}</h2>
				<div className="flex items-center space-x-4">
					<label htmlFor="type" className="whitespace-nowrap text-white">Status</label>
					<select id="type" className="lowercase"
						value={table.getColumn('status').getFilterValue() as string}
						onChange={e => table.getColumn('status').setFilterValue(e.target.value)}
					>
						<option value={Status.ACCEPTED}>{Status.ACCEPTED}</option>
						<option value={Status.PENDING}>{Status.PENDING}</option>
					</select>
				</div>
			</header>
			<table {...props}>
				<thead>
					<tr className="bg-secondary text-primary font-comic-cat text-xl text-left">
						{table.getFlatHeaders().map(header => (
							<th key={header.id} className="font-normal py-3 px-4">
								{
									header.isPlaceholder ? null : (
										<div
											className={header.column.getCanSort() ? 'cursor-pointer select-none' : ''}
											onClick={header.column.getToggleSortingHandler()}
										>
											{flexRender(header.column.columnDef.header, header.getContext())}
											<div className="w-4 inline-block">{{
												asc: ' 🔼',
												desc: ' 🔽',
											}[header.column.getIsSorted() as string] ?? ''}
											</div>
										</div>
									)
								}
							</th>
						))}
					</tr>
				</thead>
				<tbody className="text-white [&_td]:py-3 [&_td]:px-4 [&>tr:nth-child(even)]:bg-accent-1">
					{table.getRowModel().rows.map(row => (
						<tr key={row.id}>
							{row.getVisibleCells().map(cell => (
								<td key={cell.id}>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</section>
	)
}