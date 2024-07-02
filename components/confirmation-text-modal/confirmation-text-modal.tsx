import { BaseModal, BaseModalProps } from '@components/base-modal';
import { useRef, useState } from 'react';
import styles from '@styles/Modal.module.css';
import { LoadingButton } from '@components/loading-button';

export type ConfirmationTextModalProps = {
  message: string;
  title: string;
  onAction: (inputValue: string) => void | Promise<void>; // Updated to accept inputValue
  maxCharacters?: number; // Optional maximum characters for textarea
} & Omit<BaseModalProps, 'children'>;

export function ConfirmationTextModal({
  isOpen,
  close,
  onAction,
  title,
  message,
  maxCharacters = 200, // Default maximum characters
}: ConfirmationTextModalProps) {
  const cancelButton = useRef<HTMLButtonElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleActionClick() {
    if (inputValue.length > maxCharacters) {
      setError(`Maximum ${maxCharacters} characters allowed.`);
      return;
    }

    setIsLoading(true);
    try {
      await onAction(inputValue);
      setIsLoading(false);
      close(); // Close modal after action is performed
    } catch (error) {
      console.error('Error performing action:', error);
      setIsLoading(false);
      // Handle error appropriately, e.g., display error message
    }
  }

  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setInputValue(event.target.value);
    setError(null); // Clear error when input changes
  }

  const isConfirmDisabled = inputValue.trim().length === 0 || isLoading;

  return (
    <BaseModal isOpen={isOpen} close={close} initialFocus={cancelButton}>
      <div className={styles.panel}>
        <div className={styles['confirmation-body']}>
          <p className="text-2xl font-bold">{title}</p>
		  <div>
			<p className="text-xl text-center">{message}</p>
			<label className="block mt-4 w-full">
				Reason:
				<textarea
				className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
				value={inputValue}
				onChange={handleChange}
				maxLength={maxCharacters}
				rows={5} // Adjust rows as needed
				/>
        <div className="flex justify-end mt-2 text-sm text-gray-500">
          {inputValue.length}/{maxCharacters}
        </div>
			</label>
			{error && <p className="text-red-500 mt-1">{error}</p>}
		  </div>
          <div className={styles['btn-group']}>
            <button
              className={`${styles.btn} btn secondary`}
              ref={cancelButton}
              onClick={close}
              disabled={isLoading}
            >
              Cancel
            </button>
            <LoadingButton
              className={`${styles.btn} btn primary`}
              onClick={handleActionClick}
              isLoading={isLoading}
              disabled={isConfirmDisabled}
            >
              Confirm
            </LoadingButton>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}