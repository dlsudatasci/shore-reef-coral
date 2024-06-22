import {
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { HTMLAttributes, useState, useMemo } from "react";
import Link from "next/link";
import { TeamsSummary } from "@pages/api/admin/teams";
import app from "@lib/axios-config";

// Toast
import { toastAxiosError } from "@lib/utils";
import { toast } from "react-toastify";
import { toastSuccessConfig } from "@lib/toast-defaults";

//Confirmation Modal
import { createPortal } from "react-dom";
import { ConfirmationModalProps } from "@components/confirmation-modal";
import { ConfirmationTextModalProps } from "@components/confirmation-text-modal";
import dynamic from "next/dynamic";

const ConfirmationModal = dynamic<ConfirmationModalProps>(() =>
  import("@components/confirmation-modal").then((mod) => mod.ConfirmationModal)
);
const ConfirmationTextModal = dynamic<ConfirmationTextModalProps>(() =>
  import("@components/confirmation-text-modal").then((mod) => mod.ConfirmationTextModal)
);

type TeamsTableProps = {
  data: TeamsSummary[];
  updateTeams: () => void;
} & HTMLAttributes<HTMLTableElement>;

export function TeamRequests({ data, updateTeams, ...props }: TeamsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [teamId, setTeamId] = useState<number>();
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const teamProfile = useMemo(() => data.find((d) => { 
    console.log('id and teamId:', d.id, teamId)
    return d.id === teamId
  }), [teamId, data]);

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
      enableSorting: true,
      cell: ({ row }) => (
        <p>{row.original.affiliation || "N/A"}</p>
      ),
    }),
    helper.display({
      id: "approve",
      cell: ({ row }) => (
        <button
          className="btn bg-highlight text-t-highlight px-2 rounded-md"
          onClick={() => {
            setTeamId(Number(row.original.id))
            setIsApproveModalOpen(true)
          }}
        >
          Approve
        </button>
      ),
    }),
    helper.display({
      id: "reject",
      cell: ({ row }) => (
        <button
          className="btn bg-highlight text-t-highlight px-2 rounded-md"
          onClick={() => {
            setTeamId(Number(row.original.id))
            setIsRejectModalOpen(true)
          }}
        >
          Reject
        </button>
      ),
    }),
  ];

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

  async function onApproveClick() {
    if(teamId === undefined) return;
  
    try {
      await app.post(`/admin/teams/${teamId}/approve`);
      updateTeams();
      setIsApproveModalOpen(false);
      setTimeout(() => setTeamId(undefined), 300);
      toast(
        `Team has been approved!`,
        toastSuccessConfig
      );
    } catch (err) {
      toastAxiosError(err);
    }
  }

  async function onRejectClick(reason: String) {
    if(teamId === undefined) return;

    try {
      await app.post(`/admin/teams/${teamId}/reject`, { reason });
      updateTeams();
      setIsRejectModalOpen(false);
      setTimeout(() => setTeamId(undefined), 300);
      toast(
        `Team has been rejected!`,
        toastSuccessConfig
      );
    } catch (err) {
      toastAxiosError(err);
    }
  }

  return (
    <>
      {createPortal(
        <ConfirmationModal
          title="Approve team"
          message={`Are you sure you want to approve the team ${teamProfile?.name}?`}
          isOpen={isApproveModalOpen}
          close={() => {
            setIsApproveModalOpen(false);
            setTimeout(() => setTeamId(undefined), 300);
          }}
          onAction={onApproveClick}
        />,
        document.body
      )}
      {createPortal(
        <ConfirmationTextModal
          title="Reject team"
          message={`Are you sure you want to reject the team ${teamProfile?.name}?`}
          isOpen={isRejectModalOpen}
          close={() => {
            setIsRejectModalOpen(false);
            setTimeout(() => setTeamId(undefined), 300);
          }}
          onAction={onRejectClick}
          maxCharacters={480}
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
    </>
  );
}