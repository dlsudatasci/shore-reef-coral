import {
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { HTMLAttributes, useEffect, useState } from "react";
import Link from "next/link";
import { UsersSummary } from "@pages/api/users";
import { RemoveModalProps } from "../modals/remove";
import dynamic from "next/dynamic";
import { createPortal } from "react-dom";

const helper = createColumnHelper<UsersSummary>();
const RemoveModal = dynamic<RemoveModalProps>(() =>
  import("@components/admin/modals/remove").then((mod) => mod.RemoveModal)
);

type MembersTableProps = {
  data: UsersSummary[];
} & HTMLAttributes<HTMLTableElement>;

export function MembersTable({ data, ...props }: MembersTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [id, setId] = useState<number | string | undefined>(undefined);

  const columns = [
    helper.accessor((row) => `${row.firstName} ${row.lastName}`, {
      id: "name",
    }),
    helper.accessor("affiliation", { header: "Affiliation" }),
    helper.display({
      id: "status",
      header: "Status",
      cell(props) {
        return <p>Active</p>;
      },
    }),
    helper.display({
      id: "action",
      cell: ({ row }) => (
        <div className="flex gap-5">
          <button
            className="btn bg-highlight text-t-highlight px-2 rounded-md font-sans"
            onClick={() => setId(Number(row.id))}
          >
            remove
          </button>
          <button className="btn bg-highlight text-t-highlight px-2 rounded-md font-sans">
            move
          </button>
        </div>
      ),
    }),
  ];

  const table = useReactTable<UsersSummary>({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  async function onRemoveClick() {
    console.log("Remove");
  }

  return (
    <div>
      {createPortal(
        <RemoveModal
          title={`Remove ${
            table
              .getRowModel()
              .rows.find((row) => row.id)
              ?.getVisibleCells()[0].row._valuesCache.name
          } ?`}
          message={`Are you sure you want to remove ${
            table
              .getRowModel()
              .rows.find((row) => row.id)
              ?.getVisibleCells()[0].row._valuesCache.name
          } from the team?`}
          isOpen={id !== undefined}
          close={() => setId(undefined)}
          onAction={onRemoveClick}
        />,
        document.body
      )}
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
    </div>
  );
}
