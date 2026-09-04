import { useCallback, useMemo, useState } from 'react';
import {
	getPreference,
	setPreference,
} from '@/utils/preferences.utils';

export const WATCHLIST_STORAGE_KEY = 'accesslayer.watchlist';

/**
 * Manages a watchlist (bookmark) of creator-key IDs persisted in
 * localStorage.  Each ID is a Stellar-style `G...` address stored in
 * a JSON array under the `accesslayer.watchlist` key.
 *
 * The hook exposes:
 * - `isBookmarked(id)` — whether the given key is currently watched
 * - `toggleWatch(id)`  — add or remove the key
 * - `watchlist`         — the full list of watched IDs
 * - `watchlistCount`    — length of the list (handy for navbar badges)
 * - `clearWatchlist()`  — remove every entry (e.g. on wallet disconnect)
 */
export function useWatchlist(): {
	watchlist: string[];
	watchlistCount: number;
	isBookmarked: (id: string) => boolean;
	toggleWatch: (id: string) => void;
	clearWatchlist: () => void;
} {
	const [watchlist, setWatchlist] = useState<string[]>(() =>
		getPreference<string[]>(WATCHLIST_STORAGE_KEY, [])
	);

	const isBookmarked = useCallback(
		(id: string) => watchlist.includes(id),
		[watchlist]
	);

	const toggleWatch = useCallback(
		(id: string) => {
			setWatchlist(prev => {
				const next = prev.includes(id)
					? prev.filter(k => k !== id)
					: [...prev, id];
				setPreference(WATCHLIST_STORAGE_KEY, next);
				return next;
			});
		},
		[]
	);

	const clearWatchlist = useCallback(() => {
		setWatchlist([]);
		setPreference(WATCHLIST_STORAGE_KEY, []);
	}, []);

	const watchlistCount = useMemo(() => watchlist.length, [watchlist]);

	return {
		watchlist,
		watchlistCount,
		isBookmarked,
		toggleWatch,
		clearWatchlist,
	};
}
