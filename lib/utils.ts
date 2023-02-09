import { isAxiosError } from 'axios'
import { toast } from 'react-toastify'
import { toastErrorConfig } from './toast-defaults'
import { NextRouter } from 'next/router'

/**
 * Used to show the error message in a toast
 * @param error - an error object of unknown type
 */
export function toastAxiosError(error: unknown) {
	if (isAxiosError(error)) {
		toast.error(error.message, toastErrorConfig)
	}
}

export function onUnauthenticated({ replace, pathname }: NextRouter) {
	const searchParams = new URLSearchParams()
	searchParams.append('error', 'Please login to continue.')
	searchParams.append('pathname', pathname)

	return () => replace(`/login?` + searchParams)
}