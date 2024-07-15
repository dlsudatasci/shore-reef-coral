/* eslint-disable react-hooks/exhaustive-deps */

import { SortingState, createColumnHelper, flexRender, getCoreRowModel, getSortedRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table'
import { HTMLAttributes, useState } from 'react'
import Link from 'next/link'
import { SurveySummary } from '@pages/api/teams/[teamId]/surveys'
import { useEffect } from 'react'

// Components
import Pagination from '@components/pagination'

const helper = createColumnHelper<SurveySummary>()

const columns = [
	helper.accessor('date', {
		header: 'Survey Date and Time',
		cell(props) {
			const date = new Date(props.getValue());
			return date
				.toLocaleString("en-US", {
					dateStyle: "long",
					timeStyle: "short",
				})
				.replace("at", "");
		},
	}),
	helper.accessor('stationName', { header: 'Station Name' }),
	helper.accessor('startLongitude', {
		header: 'Longitude',
		cell(props) {
			return props.getValue().toFixed(3)
		}
	}),
	helper.accessor('startLatitude', {
		header: 'Latitude',
		cell(props) {
			return props.getValue().toFixed(3)
		}
	}),
	helper.accessor('dataType', { header: 'Data Type' }),
	helper.accessor("isComplete", {
		id: "isComplete",
		header: "Completed",
		cell(props) {
		  return <p className="text-center">{props.getValue() ? "✓" : ""}</p>;
		},
	  }),
	  helper.accessor("isVerified", {
		id: "isVerified",
		header: "Verified",
		cell(props) {
		  return <p className="text-center">{props.getValue() ? "✓" : ""}</p>;
		},
	  }),
	helper.display({
		id: 'view',
		cell: ({ row }) => <Link className="btn secondary px-2 rounded-md" href={`/surveys/${row.original.id}`}>View</Link>
	})
]

type SurveyTableProps = {
	data: SurveySummary[];
	totalPages: number;
	currentPage: number;
	setCurrentPage: (page: number) => void;
	handleSortChange: (sortBy: string, sortOrder: string) => void;
} & HTMLAttributes<HTMLTableElement>

export function SurveyTable({
	data,
	totalPages,
	currentPage,
	setCurrentPage,
	handleSortChange,
	...props 
}: SurveyTableProps) {
	const [sorting, setSorting] = useState<SortingState>([
		{ id: "date", desc: true },
	]);
	useEffect(() => {
		handleSortChange(sorting[0]?.id || "date", sorting[0]?.desc ? "desc" : "asc");
	}, [sorting]);

	const [pagination, setPagination] = useState({ pageIndex: currentPage - 1, pageSize: 15 });
	useEffect(() => {
	  	setCurrentPage(pagination.pageIndex + 1);
	}, [pagination.pageIndex]);

	const table = useReactTable<SurveySummary>({
		data,
		columns,
		state: {
			sorting,
			pagination,
		},
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),

		getSortedRowModel: getSortedRowModel(),
		manualSorting: true,

		getPaginationRowModel: getPaginationRowModel(),
		onPaginationChange: setPagination,
		manualPagination: true,
		pageCount: totalPages,
	})

	return (
		<>
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
				{data.length === 0 ? (
					<tr>
						<td colSpan={columns.length}>
							<div className="flex justify-center align-middle py-4 text-xl">
								No surveys submitted.
							</div>
						</td>
					</tr>
				) : (
					table.getRowModel().rows.map((row) => (
					<tr key={row.id}>
						{row.getVisibleCells().map((cell) => (
						<td key={cell.id}>
							{flexRender(
							cell.column.columnDef.cell,
							cell.getContext()
							)}
						</td>
						))}
					</tr>
					))
				)}
				</tbody>
			</table>
			{data.length > 0 && <Pagination table={table} variant='secondary' />}
		</>
	)
}