import {
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { HTMLAttributes, useState } from "react";
import dynamic from "next/dynamic";
import { createPortal } from "react-dom";

type UsersSummary = {
  id: number;
  affiliation: string | null;
  firstName: string;
  lastName: string;
};

const helper = createColumnHelper<UsersSummary>();
const RemoveModal = dynamic(() =>
  import("@components/admin/modals/remove").then((mod) => mod.RemoveModal)
);

const MoveModal = dynamic(() =>
  import("@components/admin/modals/move").then((mod) => mod.MoveModal)
);

type MembersTableProps = {
  data: UsersSummary[];
} & HTMLAttributes<HTMLTableElement>;

export function MembersTable({ data, ...props }: MembersTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [removeId, setRemoveId] = useState<number | string | undefined>(undefined);
  const [moveId, setMoveId] = useState<number | string | undefined>(undefined);

  const columns = [
    helper.accessor((row) => `${row.firstName} ${row.lastName}`, {
      id: "name",
    }),
    helper.accessor("affiliation", { header: "Affiliation" }),
    helper.display({
      id: "status",
      header: "Status",
      cell() {
        return <p>Active</p>;
      },
    }),
    helper.display({
      id: "action",
      cell: ({ row }) => (
        <div className="flex gap-5">
          <button
            className="btn bg-highlight text-t-highlight px-2 rounded-md font-sans"
            onClick={() => setRemoveId(Number(row.id))}
          >
            remove
          </button>
          <button
            className="btn bg-highlight text-t-highlight px-2 rounded-md font-sans"
            onClick={() => setMoveId(Number(row.id))}
          >
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

  async function onMoveClick() {
    console.log("Move");
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
          isOpen={removeId !== undefined}
          close={() => setRemoveId(undefined)}
          onAction={onRemoveClick}
        />,
        document.body
      )}
      {createPortal(
        <MoveModal
          title={`Move ${
            table
              .getRowModel()
              .rows.find((row) => row.id)
              ?.getVisibleCells()[0].row._valuesCache.name
          } to which group?`}
          teams={["Team 1", "Team 2", "Team 3"]}
          isOpen={moveId !== undefined}
          close={() => setMoveId(undefined)}
          onAction={onMoveClick}
        />,
        document.body
      )}
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
    </div>
  );
}
