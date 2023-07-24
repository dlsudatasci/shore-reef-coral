import { TeamSurveySummary } from "@pages/api/teams/[teamId]/surveys";
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

const helper = createColumnHelper<TeamSurveySummary>();

const columns = [
  helper.accessor("date", {
    header: "Survey Date and Time",
    cell(props) {
      return props
        .getValue()
        .toLocaleString("en-US", {
          dateStyle: "long",
          timeStyle: "short",
        })
        .replace("at", "");
    },
  }),
  helper.accessor("stationName", { header: "Station Name" }),
  helper.display({
    id: "uploader",
    header: "Uploader",
    cell: () => <span>Uploader</span>,
  }),
  helper.display({
    id: "leader",
    header: "Leader",
    cell: () => <span>Leader</span>,
  }),
  helper.accessor("dataType", { header: "Data Type" }),
  helper.accessor("status", { header: "Status" }),
  helper.accessor("verified", {
    header: "Verified",
    cell(props) {
      return <p className="text-center">{props.getValue() ? "✓" : ""}</p>;
    },
  }),
  helper.display({
    id: "view",
    cell: ({ row }) => (
      <Link
        className="btn bg-highlight text-t-highlight px-2 rounded-md"
        href={`/surveys/${row.id}`}
      >
        View
      </Link>
    ),
  }),
];

type SurveyTableAdminProps = {
  data: TeamSurveySummary[];
} & HTMLAttributes<HTMLTableElement>;

export function SurveyTableAdmin({ data, ...props }: SurveyTableAdminProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable<TeamSurveySummary>({
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
        <tr className="bg-secondary text-primary font-comic-cat text-xl text-left">
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
      <tbody className="text-t-highlight [&_td]:py-3 [&_td]:px-4 [&>tr:nth-child(even)]:bg-accent-1">
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
