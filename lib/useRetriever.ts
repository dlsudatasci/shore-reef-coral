import useSWR, { Key, KeyedMutator } from 'swr'
import app from './axios-config'

export function useRetriever<T>(key: Key, fallback?: undefined, processor?: undefined): {
	data: T | undefined
	isLoading: boolean
	isError: boolean
	mutate: KeyedMutator<T>
}

export function useRetriever<T>(key: Key, fallback: T, processor?: undefined): {
	data: T
	isLoading: boolean
	isError: boolean
	mutate: KeyedMutator<T>
}

export function useRetriever<T, V>(key: Key, fallback: T, processor: (data: T) => V): {
	data: V
	isLoading: boolean
	isError: boolean
	mutate: KeyedMutator<T>
}

export function useRetriever<T, V = unknown>(key: Key, fallback?: T, processor?: (data: T) => V) {
	const { data, error, mutate } = useSWR(key, (url: string) => app.get<T>(url).then(res => res.data))
	const temp = data === undefined ? fallback : data

	return {
		data: processor ? processor(temp as T) : temp,
		isLoading: !data && !error,
		isError: !!error,
		mutate
	}
}
