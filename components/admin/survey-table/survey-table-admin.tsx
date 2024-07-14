/* eslint-disable react-hooks/exhaustive-deps */
import { SurveySummary } from "@pages/api/admin/surveys";
import {
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { HTMLAttributes, useEffect, useState } from "react";
import Link from "next/link";

// Components
import Pagination from "@components/pagination";

const helper = createColumnHelper<SurveySummary>();

const columns = [
  helper.accessor("date", {
    id: "date",
    header: "Survey Date and Time",
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
  helper.accessor("stationName", { header: "Station Name" }),
  helper.accessor("uploader", {
    id: "uploader",
    header: "Uploader",
    cell(props) {
      return `${props.getValue().firstName} ${props.getValue().lastName}`;
    },
  }),
  helper.accessor("leader", {
    id: "leader",
    header: "Leader",
    cell(props) {
      return `${props.getValue().firstName} ${props.getValue().lastName}`;
    },
  }),
  helper.accessor("dataType", { header: "Data Type" }),
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
  data: SurveySummary[];
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  handleSortChange: (sortBy: string, sortOrder: string) => void;
} & HTMLAttributes<HTMLTableElement>;

export function SurveyTableAdmin({ 
  data,
  totalPages,
  currentPage,
  setCurrentPage,
  handleSortChange,
  ...props 
}: SurveyTableAdminProps) {
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
  });

  return (
    <>
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
      {data.length > 0 && <Pagination table={table} />}
    </>
  );
}
