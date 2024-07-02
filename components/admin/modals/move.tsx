import { BaseModal } from '@components/base-modal'; // Adjust the path as per your project structure
import { FC, useRef, useState } from 'react';
import styles from '@styles/Modal.module.css';
import cn from 'classnames';
import { LoadingButton } from '@components/loading-button';

type AvailableTeams = {
  id: number;
  name: string;
};

type MoveModalProps = {
  title: string;
  teams: AvailableTeams[];
  isOpen: boolean;
  close: () => void;
  onAction: () => void;
  onSelectTeam: (teamId: number) => void;
};

const MoveModal: FC<MoveModalProps> = ({
  isOpen,
  close,
  onAction,
  teams = [],
  title,
  onSelectTeam,
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
      <div className={cn(styles.panel, '!bg-secondary text-t-highlight')}>
        <div className={styles['confirmation-body']}>
          <h2 className="text-2xl">{title}</h2>
          <div>
            {teams.map((team) => (
              <label htmlFor={team.name} key={team.id}>
                <input
                  type="radio"
                  id={team.name}
                  name="team"
                  onChange={() => onSelectTeam(team.id)}
                />
                {team.name}
              </label>
            ))}
          </div>
          <div className={styles['btn-group']}>
            <button
              className={cn(styles.btn, 'btn border-2 !border-primary text-primary !rounded-full')}
              ref={cancelButton}
              onClick={close}
              disabled={isLoading}
            >
              Cancel
            </button>
            <LoadingButton
              className={cn(styles.btn, 'btn border-2 !bg-primary text-secondary !rounded-full')}
              onClick={handleActionClick}
              isLoading={isLoading}
            >
              Confirm
            </LoadingButton>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

export { MoveModal };
