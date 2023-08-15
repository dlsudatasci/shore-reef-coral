import { isAxiosError } from 'axios'
import { toast } from 'react-toastify'
import { toastErrorConfig } from './toast-defaults'
import { NextRouter } from 'next/router'

/**
 * Used to show the error message in a toast
 * @param error - an error object of unknown type
 */
export function toastAxiosError(error: unknown) {
	if (!isAxiosError(error)) {
		return
	}
	console.error(error)
	if (error.response?.data) {
		return toast.error(error.response.data, toastErrorConfig)
	}

	toast.error(error.message, toastErrorConfig)
}

export function onUnauthenticated({ replace, pathname }: NextRouter) {
	const searchParams = new URLSearchParams()
	searchParams.append('error', 'Please login to continue.')
	searchParams.append('pathname', pathname)

	return () => replace(`/login?${searchParams}`)
}

export function objectToFormData(data: Record<any, any>, formData = new FormData(), parentKey: string | null = null) {
	for (const key in data) {
		if (data.hasOwnProperty(key)) {
			const value = data[key];
			const formKey = parentKey ? `${parentKey}[${key}]` : key;

			if (value instanceof File) {
				formData.append(formKey, value);
			} else if (value instanceof File) {
				formData.append(formKey, value, value.name);
			} else if (value instanceof Date) {
				formData.append(formKey, value.toISOString());
			} else if (typeof value === "object" && !(value instanceof Array)) {
				objectToFormData(value, formData, formKey);
			} else if (value instanceof Array) {
				for (let i = 0; i < value.length; i++) {
					const arrayFormKey = `${formKey}[${i}]`;
					if (value[i] instanceof File) {
						formData.append(arrayFormKey, value[i]);
					} else if (value[i] instanceof Blob) {
						formData.append(arrayFormKey, value[i], value[i].name);
					} else {
						formData.append(arrayFormKey, value[i]);
					}
				}
			} else {
				formData.append(formKey, value);
			}
		}
	}
	return formData;
}

export function parseFormidableOutput(formData: Record<any, any>) {
	const nestedJson: Record<any, any> = {};

	for (const key in formData) {
		if (formData.hasOwnProperty(key)) {
			const value = formData[key][0];
			const keys = key.split("[").map((str) => str.replace("]", ""));

			let currentObj = nestedJson;

			for (let i = 0; i < keys.length; i++) {
				const currentKey = keys[i];
				if (!currentObj[currentKey]) {
					currentObj[currentKey] = i === keys.length - 1 ? value : {};
				}
				currentObj = currentObj[currentKey];
			}
		}
	}

	return nestedJson;
}
