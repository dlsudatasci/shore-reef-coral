import app, { fetcher } from '@lib/axios-config'
import { RequestsAPI } from '@pages/api/teams/[teamId]/requests'
import { Status } from '@prisma/client'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { TableHTMLAttributes } from 'react'
import useSWR from 'swr'

type RequestTableProps = {
	teamId: number | string
} & TableHTMLAttributes<HTMLTableElement>

const helper = createColumnHelper<RequestsAPI>()

export function RequestTable({ teamId, ...props }: RequestTableProps) {
	const { data, mutate } = useSWR<RequestsAPI[]>(`/teams/${teamId}/requests`, fetcher)
	const columns = [
		helper.accessor(row => `${row.user.firstName} ${row.user.lastName}`, {
			id: 'name',
			header: 'Member Name'
		}),
		helper.accessor('user.affiliation', { header: 'Affiliation' }),
		helper.display({
			id: 'actions',
			header: 'Actions',
			cell({ row }) {
				const { id } = row.original;

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
		await mutate(app.patch(`/requests/${reqId}`, { status }), {
			optimisticData: data?.filter(e => e.id !== reqId)
		})
	}

	const table = useReactTable<RequestsAPI>({
		data: data ?? [],
		columns,
		getCoreRowModel: getCoreRowModel()
	})

	return (
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
	)
}