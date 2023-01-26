import { isAxiosError } from 'axios'
import { toast } from 'react-toastify'
import { toastErrorConfig } from './toast-defaults'

/**
 * Used to show the error message in a toast
 * @param error - an error object of unknown type
 */
export function toastAxiosError(error: unknown) {
	if (isAxiosError(error)) {
		toast.error(error.message, toastErrorConfig)
	}
}
