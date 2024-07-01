// React/Next Setup
import { HTMLAttributes, useState } from "react";
import Link from "next/link";

// React Table
import {
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getPaginationRowModel,
  PaginationState,
} from "@tanstack/react-table";

// Types
import { TeamsSummary } from "@pages/api/admin/teams";
import { Status } from "@prisma/client";
import Pagination from "@components/pagination";

// Icons
import { VerifyIcon } from "@components/icons/verifyicon";

const helper = createColumnHelper<TeamsSummary>();

const columns = [
  helper.accessor("name", {
    header: "Team Name",
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <p>{row.original.name}</p>
          {row.original.isVerified && (
            <VerifyIcon />
          )}
        </div>
      )
    }
  }),
  helper.display({
    id: "leader",
    header: "Team Leader",
    cell: ({ row }) => {
      const leader = row.original.UsersOnTeam.find((user) => user.isLeader);
      return (
        <p>{leader?.user.firstName} {leader?.user.lastName}</p>
      )
    },
  }),
  helper.accessor("province", {
    header: "Province",
  }),
  helper.accessor("town", {
    header: "Town",
  }),
  helper.accessor("UsersOnTeam", {
    header: "No. of Members",
    cell: ({ row }) => {
      return (
        <p>{row.original.UsersOnTeam.filter((ut) => ut.status === String(Status.ACCEPTED)).length}</p>
      )
    }
  }),
  helper.display({
    id: "view",
    cell: ({ row }) => (
      <Link
        className="btn bg-highlight text-t-highlight px-2 rounded-md"
        href={`/admin/teams/${row.original.id}`}
      >
        View Details
      </Link>
    ),
  }),
];

type TeamsTableProps = {
  data: any[];
} & HTMLAttributes<HTMLDivElement>;

export function TeamsTable({ data, ...props }: TeamsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'name', desc: false }
  ]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 15,
  })

  const table = useReactTable<any>({
    data,
    columns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
  });

  return (
    <div {...props}>
      <table className="w-full">
        <thead>
          <tr className="bg-primary text-white font-comic-cat text-xl text-left">
            {table.getFlatHeaders().map((header) => (
              <th key={header.id} className="font-normal py-3 px-4">
                {header.isPlaceholder ? null : (
                  <div
                    className={
                      header.column.getCanSort()
                        ? "cursor-pointer select-none"
                        : ""
                    }
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    <div className="w-4 inline-block">
                      {{
                        asc: " 🔼",
                        desc: " 🔽",
                      }[header.column.getIsSorted() as string] ?? ""}
                    </div>
                  </div>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-t-highlight [&_td]:py-3 [&_td]:px-4 [&>tr:nth-child(even)]:bg-[#B4BEBA] [&>tr:nth-child(odd)]:bg-secondary">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length > 0 && <Pagination table={table} />}
    </div>
  );
}
