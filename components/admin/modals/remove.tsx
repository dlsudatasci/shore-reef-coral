import { BaseModal, BaseModalProps } from "@components/base-modal";
import { FC, useRef, useState } from "react";
import styles from "@styles/Modal.module.css";
import cn from "classnames";
import { LoadingButton } from "@components/loading-button";

export type RemoveModalProps = {
  title: string;
  message: string;
  onAction: () => void | Promise<void>;
} & Omit<BaseModalProps, "children">;

const RemoveModal: FC<RemoveModalProps> = ({
  isOpen,
  close,
  onAction,
  message,
  title,
}) => {
  const cancelButton = useRef<HTMLButtonElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  async function handleActionClick() {
    setIsLoading(true);
    await onAction();
    setIsLoading(false);
  }
  return (
    <BaseModal isOpen={isOpen} close={close} initialFocus={cancelButton}>
      <div className={cn(styles.panel, "!bg-secondary text-t-highlight")}>
        <div className={styles["confirmation-body"]}>
          <h2 className="text-2xl">{title}</h2>
          <p className="text-base">{message}</p>
          <div className={styles["btn-group"]}>
            <button
              className={cn(styles.btn," btn border-2 !border-primary text-primary !rounded-full")}
              ref={cancelButton}
              onClick={close}
              disabled={isLoading}
            >
              CANCEL
            </button>
            <LoadingButton
              className={cn(styles.btn, " btn border-2 !bg-primary text-secondary !rounded-full")}
              onClick={handleActionClick}
              isLoading={isLoading}
            >
              CONFIRM
            </LoadingButton>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

export { RemoveModal };
