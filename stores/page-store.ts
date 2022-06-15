import create from 'zustand'

export type PageStore = {
	page: number
	nextPage: () => void
	prevPage: () => void
	resetPage: () => void
}

const usePageStore = create<PageStore>(set => ({
	page: 0,
	nextPage: () => set(({ page }) => ({ page: page + 1 })),
	prevPage: () => set(({ page }) => ({ page: page ? page - 1 : page })),
	resetPage: () => set({ page: 0 })
}))

export default usePageStore
