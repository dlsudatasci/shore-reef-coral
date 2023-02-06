import { BaseModal, BaseModalProps } from '@components/base-modal'
import { useRef, useState } from 'react'
import styles from '@styles/Modal.module.css'
import { LoadingButton } from '@components/loading-button'

export type ConfirmationModalProps = {
	message: string
	onAction: () => void | Promise<void>
} & Omit<BaseModalProps, 'children'>

export function ConfirmationModal({ isOpen, close, onAction, message }: ConfirmationModalProps) {
	const cancelButton = useRef<HTMLButtonElement>(null)
	const [isLoading, setIsLoading] = useState(false)

	async function handleActionClick() {
		setIsLoading(true)
		await onAction()
		setIsLoading(false)
	}

	return (
		<BaseModal isOpen={isOpen} close={close} initialFocus={cancelButton}>
			<div className={styles.panel}>
				<div className={styles['confirmation-body']}>
					<p className="text-xl">{message}</p>
					<div className={styles['btn-group']}>
						<button className={styles.btn + ' btn gray'} ref={cancelButton} onClick={close} disabled={isLoading}>Cancel</button>
						<LoadingButton className={styles.btn + ' btn red'} onClick={handleActionClick} isLoading={isLoading}>Confirm</LoadingButton>
					</div>
				</div>
			</div>
		</BaseModal>
	)
}