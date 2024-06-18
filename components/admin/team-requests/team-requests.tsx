import {
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { HTMLAttributes, useState } from "react";
import Link from "next/link";
import { TeamsSummary } from "@pages/api/admin/teams";

const helper = createColumnHelper<TeamsSummary>();

const columns = [
  helper.accessor("name", { header: "Team Name" }),
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
  helper.accessor("town", {
    header: "Town",
  }),
  helper.accessor("province", {
    header: "Province",
  }),
  helper.display({
    id: "affiliation",
    header: "Affiliation",
    cell: ({ row }) => (
      <p>{row.original.affiliation || "N/A"}</p>
    ),
  }),
  helper.display({
    id: "view",
    cell: ({ row }) => (
      <Link
        className="btn bg-highlight text-t-highlight px-2 rounded-md"
        href={`#`}
      >
        Approve
      </Link>
    ),
  }),
];

type TeamsTableProps = {
  data: any[];
} & HTMLAttributes<HTMLTableElement>;

export function TeamRequests({ data, ...props }: TeamsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable<any>({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <table {...props}>
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
  );
}
