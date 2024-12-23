import { Disclosure } from "@headlessui/react";
import { generateFuzzyFilter } from "@lib/global-filter";
import { TeamProfileSummary } from "@pages/api/teams";
import { rankings } from "@tanstack/match-sorter-utils";
import styles from "@styles/Teams.module.css";
import cn from "classnames";
import { useMemo, useState } from "react";
import { MinusIcon, PlusIcon } from "@heroicons/react/outline";
import { VerifyIcon } from "@components/icons/verifyicon";
import Pagination from "@components/pagination";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  createColumnHelper,
  ColumnFiltersState,
  getPaginationRowModel,
  PaginationState,
} from "@tanstack/react-table";
import DebouncedInput from "../debounced-input";
import dynamic from "next/dynamic";
import { createPortal } from "react-dom";
import app from "@lib/axios-config";
import { toastAxiosError } from "@lib/utils";
import { toast } from "react-toastify";
import { mutate } from "swr";
import { toastSuccessConfig } from "@lib/toast-defaults";
import { ConfirmationModalProps } from "@components/confirmation-modal";
import { set } from "react-hook-form";

type TeamsTableProps = {
  data: TeamProfileSummary[];
  filter?: "joined" | "joinable" | "pending";
};

const columnHelper = createColumnHelper<TeamProfileSummary>();
const ConfirmationModal = dynamic<ConfirmationModalProps>(() =>
  import("@components/confirmation-modal").then((mod) => mod.ConfirmationModal)
);
const WithdrawalModal = dynamic<ConfirmationModalProps>(() =>
  import("@components/confirmation-modal").then((mod) => mod.ConfirmationModal)
)
 
const columns = [
  columnHelper.accessor("id", {}),
  columnHelper.accessor("name", {}),
  columnHelper.accessor(
    ({ UsersOnTeam: [{ user }] }) => `${user.firstName} ${user.lastName}`,
    { id: "leader" }
  ),
  columnHelper.accessor((team) => `${team.town}, ${team.province}`, {
    id: "location",
  }),
  columnHelper.accessor("_count.UsersOnTeam", { id: "count" }),
  columnHelper.accessor("isVerified", {}),
];

export function TeamsTable({ data, filter }: TeamsTableProps) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 15,
  })
  const [id, setId] = useState<number>();
  const [wId, setWId] = useState<number>();
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const teamProfile = useMemo(() => data.find((d) => d.id === id), [id, data]);
  const wTeamProfile = useMemo(() => data.find((d) => d.id === wId), [wId, data]);
  const leaderName = useMemo(() => {
    const user = teamProfile?.UsersOnTeam[0].user;
    return `${user?.firstName} ${user?.lastName}`;
  }, [teamProfile]);
  const wLeaderName = useMemo(() => {
    const user = wTeamProfile?.UsersOnTeam[0].user;
    return `${user?.firstName} ${user?.lastName}`;
  }, [wTeamProfile]);

  const table = useReactTable<TeamProfileSummary>({
    data,
    columns,
    state: {
      columnFilters,
      pagination,
    },
    filterFns: {
      fuzzy: generateFuzzyFilter(rankings.CONTAINS),
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
  });

  async function onJoinClick() {
    if (id === undefined) return;

    try {
      await app.post(`/teams/${id}/members`);
      await mutate(`/teams?filter=${filter}`);
      await mutate(`/teams?filter=pending`);
      setIsJoinModalOpen(false);
      setTimeout(() => setId(undefined), 300);
      toast.success(
        `Your request to join ${teamProfile?.name} has been submitted for approval by the team leader.`,
        toastSuccessConfig
      );
    } catch (err) {
      toastAxiosError(err);
    }
  }

  async function onWithdrawClick() {
    if (wId === undefined) return;

    try {
      await app.put(`/teams/${wId}/members`);
      await mutate(`/teams?filter=${filter}`);
      await mutate(`/teams?filter=joinable`);
      toast.success(
        `Your request to join ${wTeamProfile?.name} has been withdrawn.`,
        toastSuccessConfig
      );
      setWId(undefined);
    } catch (err) {
      toastAxiosError(err);
    }
  }

  return (
    <div>
      {createPortal(
        <ConfirmationModal
          title="Join team"
          message={`Are you sure you want to join the team ${teamProfile?.name} created by ${leaderName}?`}
          isOpen={isJoinModalOpen}
          close={() => {
            setIsJoinModalOpen(false);
            setTimeout(() => setId(undefined), 300);
          }}
          onAction={onJoinClick}
        />,
        document.body
      )}
      {createPortal(
        <WithdrawalModal
          title="Withdraw application"
          message={`Are you sure you want to withdraw your application to ${wTeamProfile?.name} created by ${wLeaderName}?`}
          isOpen={wId !== undefined}
          close={() => setWId(undefined)}
          onAction={onWithdrawClick}
        />,
        document.body
      )}
      <div className="grid gap-x-4 gap-y-1 grid-cols-2 mb-6 max-w-2xl">
        <DebouncedInput
          type="text"
          placeholder="Team name"
          value={table.getColumn("name")?.getFilterValue() as string}
          onChange={(value) => table.getColumn("name")?.setFilterValue(value)}
        />
        <DebouncedInput
          type="text"
          placeholder="Leader"
          value={table.getColumn("leader")?.getFilterValue() as string}
          onChange={(value) => table.getColumn("leader")?.setFilterValue(value)}
        />
      </div>
      <div className="space-y-1.5">
        {table.getRowModel().rows.map((row) => (
          <Disclosure as="div" key={row.id}>
            {({ open }: { open: boolean }) => (
              <>
                <Disclosure.Button
                  className={cn(
                    styles.header,
                    open
                      ? "bg-highlight text-t-highlight"
                      : !filter || filter === "joinable" || filter === "pending"
                      ? "bg-secondary  text-primary"
                      : "bg-primary text-secondary"
                  )}
                >
                  <div className="flex justify-between items-center w-full">
                    <div className="flex items-center space-x-2">
                      <p>{row.getValue("name")}</p>
                      {!!row.getValue("isVerified") && (
                        <VerifyIcon
                          variant={
                            open
                              ? "t-highlight"
                              : !filter || filter === "joinable" || filter === "pending"
                              ? "primary"
                              : "secondary"
                          }
                        />
                      )}
                    </div>
                    {open ? (
                      <MinusIcon className="w-6 aspect-square" />
                    ) : (
                      <PlusIcon className="w-6 aspect-square" />
                    )}
                  </div>
                </Disclosure.Button>
                <Disclosure.Panel className={styles.panel}>
                  <div className="grid md:grid-cols-3 gap-y-4 gap-x-2">
                    <div>
                      <h6>Team Leader/Creator:</h6>
                      <p>{row.getValue("leader")}</p>
                    </div>
                    <div>
                      <h6>Location of the team:</h6>
                      <p>{row.getValue("location")}</p>
                    </div>
                    <div>
                      <h6>No. of members/volunteers:</h6>
                      <p>{row.getValue("count")}</p>
                    </div>
                  </div>
                  {(!filter || filter === 'joinable') && (
                    <button
                      className="mx-auto block btn primary mt-8"
                      onClick={() => {
                        setId(row.getValue("id"))
                        setIsJoinModalOpen(true)
                      }}
                    >
                      Join Team
                    </button>
                  )}
                  {(filter === 'pending') && (
                    <button
                      className="mx-auto block btn primary mt-8"
                      onClick={() => setWId(row.getValue("id"))}
                    >
                      Withdraw Application
                    </button>
                  )}
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        ))}
      </div>
      {data.length > 0 && <Pagination table={table} variant="secondary" />}
    </div>
  );
}
