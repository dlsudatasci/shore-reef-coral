import axios from 'axios'

const app = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
	headers: {
		'Access-Control-Allow-Credentials': 'true',
	},
})

export function fetcher<T>(url: string) {
	return app.get<T>(url).then(res => res.data)
}

export default app
