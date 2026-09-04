import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, beforeEach } from 'vitest';
import { useWatchlist, WATCHLIST_STORAGE_KEY } from '../useWatchlist';

const KEY_A = 'GABCDEF1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ1234';
const KEY_B = 'GXYZABCDEF1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ56';

describe('useWatchlist', () => {
	beforeEach(() => {
		window.localStorage.clear();
	});

	// ─── AC 1: Bookmarking adds key to localStorage ───────────────
	it('adds a key to localStorage when toggled on', () => {
		const { result } = renderHook(() => useWatchlist());

		expect(result.current.isBookmarked(KEY_A)).toBe(false);

		act(() => {
			result.current.toggleWatch(KEY_A);
		});

		expect(result.current.isBookmarked(KEY_A)).toBe(true);
		expect(result.current.watchlist).toContain(KEY_A);

		const stored = JSON.parse(
			window.localStorage.getItem(WATCHLIST_STORAGE_KEY) ?? '[]'
		);
		expect(stored).toContain(KEY_A);
	});

	// ─── AC 2: Unbookmarking removes key from localStorage ────────
	it('removes a key from localStorage when toggled off', () => {
		// Seed localStorage
		window.localStorage.setItem(
			WATCHLIST_STORAGE_KEY,
			JSON.stringify([KEY_A, KEY_B])
		);

		const { result } = renderHook(() => useWatchlist());

		expect(result.current.isBookmarked(KEY_A)).toBe(true);

		act(() => {
			result.current.toggleWatch(KEY_A);
		});

		expect(result.current.isBookmarked(KEY_A)).toBe(false);
		expect(result.current.watchlist).not.toContain(KEY_A);
		expect(result.current.watchlist).toContain(KEY_B);

		const stored = JSON.parse(
			window.localStorage.getItem(WATCHLIST_STORAGE_KEY) ?? '[]'
		);
		expect(stored).not.toContain(KEY_A);
		expect(stored).toContain(KEY_B);
	});

	// ─── AC 3: Filled icon on mount for already-bookmarked keys ───
	it('returns bookmarked=true on mount for keys already in localStorage', () => {
		window.localStorage.setItem(
			WATCHLIST_STORAGE_KEY,
			JSON.stringify([KEY_A])
		);

		const { result } = renderHook(() => useWatchlist());

		expect(result.current.isBookmarked(KEY_A)).toBe(true);
		expect(result.current.watchlist).toEqual([KEY_A]);
	});

	it('returns bookmarked=false on mount when localStorage is empty', () => {
		const { result } = renderHook(() => useWatchlist());

		expect(result.current.isBookmarked(KEY_A)).toBe(false);
		expect(result.current.watchlist).toEqual([]);
	});

	// ─── AC 4: Watchlist count reflects current state ─────────────
	it('watchlistCount updates after each toggle', () => {
		const { result } = renderHook(() => useWatchlist());

		expect(result.current.watchlistCount).toBe(0);

		act(() => {
			result.current.toggleWatch(KEY_A);
		});
		expect(result.current.watchlistCount).toBe(1);

		act(() => {
			result.current.toggleWatch(KEY_B);
		});
		expect(result.current.watchlistCount).toBe(2);

		act(() => {
			result.current.toggleWatch(KEY_A);
		});
		expect(result.current.watchlistCount).toBe(1);
	});

	// ─── AC 5: clearWatchlist removes all entries ──────────────────
	it('clearWatchlist empties localStorage and resets state', () => {
		window.localStorage.setItem(
			WATCHLIST_STORAGE_KEY,
			JSON.stringify([KEY_A, KEY_B])
		);

		const { result } = renderHook(() => useWatchlist());

		expect(result.current.watchlistCount).toBe(2);

		act(() => {
			result.current.clearWatchlist();
		});

		expect(result.current.watchlist).toEqual([]);
		expect(result.current.watchlistCount).toBe(0);
		expect(result.current.isBookmarked(KEY_A)).toBe(false);
		expect(result.current.isBookmarked(KEY_B)).toBe(false);

		const stored = JSON.parse(
			window.localStorage.getItem(WATCHLIST_STORAGE_KEY) ?? '[]'
		);
		expect(stored).toEqual([]);
	});

	// ─── Toggle round-trip: add then remove ────────────────────────
	it('toggling the same key twice returns it to the unbookmarked state', () => {
		const { result } = renderHook(() => useWatchlist());

		act(() => {
			result.current.toggleWatch(KEY_A);
		});
		expect(result.current.isBookmarked(KEY_A)).toBe(true);

		act(() => {
			result.current.toggleWatch(KEY_A);
		});
		expect(result.current.isBookmarked(KEY_A)).toBe(false);
		expect(result.current.watchlist).toEqual([]);
	});

	// ─── Graceful handling of malformed localStorage ───────────────
	it('returns empty watchlist when localStorage contains invalid JSON', () => {
		window.localStorage.setItem(WATCHLIST_STORAGE_KEY, '{ broken');

		const { result } = renderHook(() => useWatchlist());

		expect(result.current.watchlist).toEqual([]);
		expect(result.current.watchlistCount).toBe(0);
	});

	// ─── Multiple independent keys ─────────────────────────────────
	it('tracks multiple keys independently', () => {
		const { result } = renderHook(() => useWatchlist());

		act(() => {
			result.current.toggleWatch(KEY_A);
		});
		act(() => {
			result.current.toggleWatch(KEY_B);
		});

		expect(result.current.isBookmarked(KEY_A)).toBe(true);
		expect(result.current.isBookmarked(KEY_B)).toBe(true);
		expect(result.current.watchlistCount).toBe(2);

		act(() => {
			result.current.toggleWatch(KEY_A);
		});

		expect(result.current.isBookmarked(KEY_A)).toBe(false);
		expect(result.current.isBookmarked(KEY_B)).toBe(true);
		expect(result.current.watchlistCount).toBe(1);
	});
});
