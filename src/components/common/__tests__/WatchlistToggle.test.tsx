import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, beforeEach } from 'vitest';
import { WATCHLIST_STORAGE_KEY } from '@/hooks/useWatchlist';
import WatchlistToggle from '../WatchlistToggle';

const CREATOR_ID = 'GABCDEF1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ1234';

describe('WatchlistToggle', () => {
	beforeEach(() => {
		window.localStorage.clear();
	});

	// ─── AC 1: Bookmark icon starts as outline and fills after click ─
	it('shows outline icon when unbookmarked, fills after click', async () => {
		const user = userEvent.setup();

		render(<WatchlistToggle creatorId={CREATOR_ID} />);

		const button = screen.getByRole('button', {
			name: /add to watchlist/i,
		});
		// Outline bookmark icon should be present
		expect(button).toBeInTheDocument();
		expect(button.querySelector('svg')).toBeInTheDocument();

		await user.click(button);

		// After clicking, label should change to "Remove from watchlist"
		expect(
			screen.getByRole('button', { name: /remove from watchlist/i })
		).toBeInTheDocument();
	});

	// ─── AC 2: Unbookmarking shows outline icon ────────────────────
	it('shows outline icon after unbookmarking', async () => {
		const user = userEvent.setup();

		// Seed with an existing bookmark
		window.localStorage.setItem(
			WATCHLIST_STORAGE_KEY,
			JSON.stringify([CREATOR_ID])
		);

		render(<WatchlistToggle creatorId={CREATOR_ID} />);

		// Should start with "Remove from watchlist"
		const button = screen.getByRole('button', {
			name: /remove from watchlist/i,
		});
		expect(button).toBeInTheDocument();

		await user.click(button);

		// After clicking, label should change back to "Add to watchlist"
		expect(
			screen.getByRole('button', { name: /add to watchlist/i })
		).toBeInTheDocument();
	});

	// ─── AC 3: Filled icon on mount for pre-bookmarked keys ────────
	it('renders as bookmarked on mount when key is already in localStorage', () => {
		window.localStorage.setItem(
			WATCHLIST_STORAGE_KEY,
			JSON.stringify([CREATOR_ID])
		);

		render(<WatchlistToggle creatorId={CREATOR_ID} />);

		expect(
			screen.getByRole('button', { name: /remove from watchlist/i })
		).toBeInTheDocument();
	});

	// ─── AC 4: Bookmark icon persists across re-renders ────────────
	it('bookmark state persists across component re-renders', async () => {
		const user = userEvent.setup();

		const { rerender } = render(
			<WatchlistToggle creatorId={CREATOR_ID} />
		);

		// Bookmark the key
		await user.click(
			screen.getByRole('button', { name: /add to watchlist/i })
		);

		expect(
			screen.getByRole('button', { name: /remove from watchlist/i })
		).toBeInTheDocument();

		// Re-render the component
		rerender(<WatchlistToggle creatorId={CREATOR_ID} />);

		// State should persist — still shows "Remove from watchlist"
		expect(
			screen.getByRole('button', { name: /remove from watchlist/i })
		).toBeInTheDocument();
	});

	// ─── AC 5: Unbookmark after refresh (re-mount) ─────────────────
	it('persists bookmark state across unmount and remount', async () => {
		const user = userEvent.setup();

		const { unmount } = render(
			<WatchlistToggle creatorId={CREATOR_ID} />
		);

		// Bookmark the key
		await user.click(
			screen.getByRole('button', { name: /add to watchlist/i })
		);

		// Unmount
		unmount();

		// Remount
		render(<WatchlistToggle creatorId={CREATOR_ID} />);

		// Should still be bookmarked
		expect(
			screen.getByRole('button', { name: /remove from watchlist/i })
		).toBeInTheDocument();
	});

	// ─── localStorage is updated after click ────────────────────────
	it('persists toggle to localStorage', async () => {
		const user = userEvent.setup();

		render(<WatchlistToggle creatorId={CREATOR_ID} />);

		await user.click(
			screen.getByRole('button', { name: /add to watchlist/i })
		);

		const stored = JSON.parse(
			window.localStorage.getItem(WATCHLIST_STORAGE_KEY) ?? '[]'
		);
		expect(stored).toContain(CREATOR_ID);
	});
});
