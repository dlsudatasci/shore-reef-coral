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
import { FC } from "react"
import dynamic from "next/dynamic";
import { createPortal } from "react-dom";
import { toastAxiosError } from "@lib/utils";
import { toast } from "react-toastify";
import { toastSuccessConfig } from "@lib/toast-defaults";
import app from "@lib/axios-config";

type UsersSummary = {
  id: number;
  affiliation: string | null;
  firstName: string;
  lastName: string;
  teamId: number;
  isLeader: boolean;
  status: string; // Add status field to UsersSummary
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
  onUpdateData: (updatedData: UsersSummary[]) => void; // Function to update data
} & HTMLAttributes<HTMLTableElement>;

export function MembersTable({ data, onUpdateData, ...props }: MembersTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [removeId, setRemoveId] = useState<number | string | undefined>(undefined);
  const [moveId, setMoveId] = useState<number | string | undefined>(undefined);

  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);

  const columns = [
    helper.accessor((row) => `${row.isLeader}`, {
      id: "leader"
    }),
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
      cell({ row }) {
        return <p>{row.original.status}</p>;
      },
    }),
    helper.display({
      id: "action",
      cell: ({ row }) => (
        <div className="flex gap-5">
          <button
            className="btn bg-highlight text-t-highlight px-2 rounded-md font-sans"
            onClick={() => setIsRemoveModalOpen(true)}
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

  const RemoveMemberComponent: FC<{ member: UsersSummary }> = ({ member }) => {
    const reqUrl = `/admin/teams/${member.teamId}/remove?memberId=` + member.id;

    const onRemoveClick = async () => {
      try {
        // Make API call to update member status to "INACTIVE"
        await app.put(reqUrl);

        // Handle success locally
        const updatedData = data.map((item) =>
          item.id === member.id ? { ...item, status: "INACTIVE" } : item
        );

        // Show success toast message
        toast.success(`${member.firstName} ${member.lastName} has been removed from the team!`, toastSuccessConfig);
        
        onUpdateData(updatedData);
      } catch (error) {
        // Handle error
        toastAxiosError(error);
      } finally {
        setIsRemoveModalOpen(false); // Close the modal regardless of success or failure
      }
    };

    return (
      <>
        {createPortal(
          <RemoveModal
            title={`Remove ${member.firstName} ${member.lastName} ?`}
            message={`Are you sure you want to remove ${member.firstName} ${member.lastName} from the team?`}
            isOpen={isRemoveModalOpen}
            close={() => setIsRemoveModalOpen(false)}
            onAction={onRemoveClick}
          />,
          document.body
        )}
      </>
    );
  };

  const onMoveClick = (id: number | string | undefined) => {
    setMoveId(id); // Set moveId for modal usage
  };

  return (
    <div>
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
              <td>
                <RemoveMemberComponent member={row.original} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
    </div>
  );
}
