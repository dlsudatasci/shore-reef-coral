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
import { HTMLAttributes, useState, useEffect, FC } from "react";
import dynamic from "next/dynamic";
import { createPortal } from "react-dom";
import { toastAxiosError } from "@lib/utils";
import { toast } from "react-toastify";
import { toastSuccessConfig } from "@lib/toast-defaults";
import app from "@lib/axios-config";

// Components
import Pagination from "@components/pagination";

type UsersSummary = {
  id: number;
  userId: number;
  affiliation: string | null;
  firstName: string;
  lastName: string;
  teamId: number;
  isLeader: boolean;
  status: string;
};

type AvailableTeams = {
  id: number;
  name: string;
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

type MoveMemberComponentProps = {
  member: UsersSummary;
  onUpdateData: (updatedData: UsersSummary[]) => void;
} & HTMLAttributes<HTMLTableElement>;

export function MembersTable({ data, onUpdateData, ...props }: MembersTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 15,
  })

  const columns = [
    helper.accessor((row) => `${row.id}`, {
      id: "id"
    }),
    helper.accessor((row) => `${row.userId}`, {
      id: "user"
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
      id: "actions",
      cell({ row }) {
        return (
          <div className="flex space-x-4">
            <RemoveMemberComponent member={row.original} />
            <MoveMemberComponent member={row.original} onUpdateData={onUpdateData} />
          </div>
        );
      },
    })
  ];

  const table = useReactTable<UsersSummary>({
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

  const RemoveMemberComponent: FC<{ member: UsersSummary }> = ({ member }) => {
    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
    const reqUrl = `/admin/teams/${member.teamId}/edit-member?memberId=${member.id}&isLeader=${member.isLeader}`;

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

        {!member.isLeader && (
          <button
            className="btn bg-highlight text-t-highlight px-2 rounded-md font-sans"
            onClick={() => setIsRemoveModalOpen(true)}
          >
            Remove
          </button>
        )}
      </>
    );
  };
  
  const MoveMemberComponent: FC<MoveMemberComponentProps> = ({
    member,
    onUpdateData,
  }) => {
    const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
    const [teams, setTeams] = useState<AvailableTeams[]>([]);
    const [selectedTeam, setSelectedTeam] = useState<number | undefined>(undefined);
  
    useEffect(() => {
      const fetchTeams = async () => {
        try {
          const response = await app.get(`/admin/teams/${member.teamId}/edit-member?memberId=${member.id}&userId=${member.userId}`);
          setTeams(response.data);
        } catch (error) {
          toastAxiosError(error);
        }
      };
  
      if (isMoveModalOpen) {
        fetchTeams();
      }
    }, [isMoveModalOpen, member.id, member.teamId, member.userId]);
  
    const handleTeamSelection = (teamId: number) => {
      setSelectedTeam(teamId); // Convert string to number
    };
  
    const onMoveClick = async () => {
      try {
        if (selectedTeam === undefined) {
          throw new Error('Please select a team.');
        }
        const reqUrl = `/admin/teams/${member.teamId}/edit-member?memberId=${member.id}&isLeader=${member.isLeader}&destTeam=${selectedTeam}&userId=${member.userId}`;

        await app.post(reqUrl, { teamId: selectedTeam });
  
        toast.success(
          `${member.firstName} ${member.lastName} has been moved to ${selectedTeam}!`,
          { position: toast.POSITION.TOP_RIGHT }
        );
  
        setIsMoveModalOpen(false);
      } catch (error) {
        toastAxiosError(error);
      }
    };
  
    return (
      <>
        {createPortal(
          <MoveModal
            title={`Move ${member.firstName} ${member.lastName} to which group?`}
            teams={teams} // Assuming team names are strings
            isOpen={isMoveModalOpen}
            close={() => setIsMoveModalOpen(false)}
            onAction={onMoveClick}
            onSelectTeam={handleTeamSelection}
          />,
          document.body
        )}
  
        {!member.isLeader ? (
          <button
            className="btn bg-highlight text-t-highlight px-2 rounded-md font-sans"
            onClick={() => setIsMoveModalOpen(true)}
          >
            Move
          </button>
        ) :
          <div className="h-9"></div>
        }
      </>
    );
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
            </tr>
          ))}
        </tbody>
      </table>
      {data.length > 0 && <Pagination table={table} />}
    </div>
  );
}
