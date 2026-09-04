import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useWatchlist } from '@/hooks/useWatchlist';
import { cn } from '@/lib/utils';

interface WatchlistToggleProps {
	/** The Stellar address / creator key ID to bookmark. */
	creatorId: string;
	/** Optional extra class names applied to the wrapper button. */
	className?: string;
}

/**
 * Renders a bookmark icon button that toggles the given creator key
 * in/out of the user's localStorage watchlist.
 *
 * - Unbookmarked → outline `Bookmark` icon (click to add)
 * - Bookmarked   → filled `BookmarkCheck` icon (click to remove)
 */
export default function WatchlistToggle({
	creatorId,
	className,
}: WatchlistToggleProps) {
	const { isBookmarked, toggleWatch } = useWatchlist();
	const bookmarked = isBookmarked(creatorId);

	return (
		<button
			type="button"
			aria-label={bookmarked ? 'Remove from watchlist' : 'Add to watchlist'}
			onClick={() => toggleWatch(creatorId)}
			className={cn(
				'inline-flex items-center justify-center rounded-md p-1.5 transition-colors hover:bg-muted',
				className
			)}
		>
			{bookmarked ? (
				<BookmarkCheck className="size-5 fill-current text-foreground" />
			) : (
				<Bookmark className="size-5 text-muted-foreground" />
			)}
		</button>
	);
}
