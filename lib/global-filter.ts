// code from https://tanstack.com/table/v8/docs/examples/react/filters
import { FilterFn, sortingFns, SortingFn } from '@tanstack/react-table'
import { RankingInfo, rankItem, compareItems, Ranking } from '@tanstack/match-sorter-utils'

declare module '@tanstack/table-core' {
	interface FilterMeta {
		itemRank: RankingInfo
	}
}

export function generateFuzzyFilter(threshold: Ranking) {
	const fuzzyFilter: FilterFn<unknown> = (row, columnId, value, addMeta) => {
		const itemRank = rankItem(row.getValue(columnId), value, { threshold })
		addMeta({ itemRank })
		return itemRank.passed
	}
	return fuzzyFilter
}

export const fuzzySort: SortingFn<unknown> = (rowA, rowB, columnId) => {
	let dir = 0

	if (rowA.columnFiltersMeta[columnId]) {
		dir = compareItems(
			rowA.columnFiltersMeta[columnId]?.itemRank,
			rowB.columnFiltersMeta[columnId]?.itemRank
		)
	}

	return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}
