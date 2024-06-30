// MembersTable component
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
    helper.accessor((row) => `${row.id}`, {
      id: "id"
    }),
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
            onClick={() => setRemoveId(row.original.id)} // Set removeId to UsersSummary id
          >
            remove
          </button>
          <button
            className="btn bg-highlight text-t-highlight px-2 rounded-md font-sans"
            onClick={() => setMoveId(row.original.id)} // Set moveId to UsersSummary id
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

  async function onRemoveClick(id: number | string | undefined) {
    setRemoveId(id); // Set removeId for modal usage
  }

  async function onMoveClick(id: number | string | undefined) {
    setMoveId(id); // Set moveId for modal usage
  }

  return (
    <div>
      {createPortal(
        <RemoveModal
          title={`Remove ${
            data.find((member) => member.id === removeId)?.firstName || ""
          } ${
            data.find((member) => member.id === removeId)?.lastName || ""
          } ?`}
          message={`Are you sure you want to remove ${
            data.find((member) => member.id === removeId)?.firstName || ""
          } ${
            data.find((member) => member.id === removeId)?.lastName || ""
          } from the team?`}
          isOpen={removeId !== undefined}
          close={() => setRemoveId(undefined)}
          onAction={() => onRemoveClick(removeId)}
        />,
        document.body
      )}
      {createPortal(
        <MoveModal
          title={`Move ${
            data.find((member) => member.id === moveId)?.firstName || ""
          } ${
            data.find((member) => member.id === moveId)?.lastName || ""
          } to which group?`}
          teams={["Team 1", "Team 2", "Team 3"]}
          isOpen={moveId !== undefined}
          close={() => setMoveId(undefined)}
          onAction={() => onMoveClick(moveId)}
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
