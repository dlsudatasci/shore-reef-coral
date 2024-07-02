// Setup
import cn from "classnames";
import { FC } from "react";
import app from "@lib/axios-config";
import { useState } from "react";

// Toast
import { toastAxiosError } from "@lib/utils";
import { toast } from "react-toastify";
import { toastSuccessConfig } from "@lib/toast-defaults";

//Confirmation Modal
import { createPortal } from "react-dom";
import { ConfirmationModalProps } from "@components/confirmation-modal";
import dynamic from "next/dynamic";
const ConfirmationModal = dynamic<ConfirmationModalProps>(() =>
  import("@components/confirmation-modal").then((mod) => mod.ConfirmationModal)
);

type TeamInfoTabProps = {
  data: any;
};

const TeamInfoTab: FC<TeamInfoTabProps> = ({ data }) => {
  const [teamInfo, setTeamInfo] = useState([
    { name: "Team Name", value: data.name },
    { name: "Province", value: data.province },
    { name: "Town", value: data.town },
    { name: "Affiliation", value: data.affiliation },
    { name: "Verified", value: data.isVerified ? "Yes" : "No" },
    { name: "Status", value: data.status },
  ]);

  const onVerify = async () => {
    const newTeamInfo = teamInfo.map((item: any) => 
      item.name === "Verified" ? { ...item, value: "Yes" } : item
    );
    setTeamInfo(newTeamInfo);

    try {
      await app.post(`/admin/teams/${data.id}/verify`);
      toast.success("Team has been verified!", toastSuccessConfig);
    } catch (error) {
      toastAxiosError(error);
      setTeamInfo(teamInfo);
    } finally {
      setIsVerifyModalOpen(false);
    }
  };

  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);

  return (
    <>
      {createPortal(
        <ConfirmationModal
          title="Verify Team"
          message={`Are you sure you want to verify the team ${data.name}?`}
          isOpen={isVerifyModalOpen}
          close={() => {
            setIsVerifyModalOpen(false);
          }}
          onAction={onVerify}
        />,
        document.body
      )}
      <div className="grid grid-cols-3 gap-y-10 mt-8">
        {teamInfo.map((item, index) => (
          <div
            key={index}
            className={cn(index < 1 ? "col-span-3" : "", "flex flex-col")}
          >
            <span className="text-accent-1">{item.name}</span>
            <span className="text-t-highlight text-lg">{item.value}</span>
          </div>
        ))}
      </div>
      {teamInfo.find(item => item.name === "Verified")?.value === "No" ? (
        <button className="bg-primary text-secondary rounded-full px-8 py-2 my-12" onClick={() => {setIsVerifyModalOpen(true)}}>
          VERIFY TEAM
        </button>
      ) : null}
    </>
  );
};

export default TeamInfoTab;