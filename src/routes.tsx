import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import CreatorDetailPage from './pages/CreatorDetailPage';
import CreatorDashboardPage from './pages/CreatorDashboardPage';
import NotificationsPage from './pages/NotificationsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import FollowingPage from './pages/FollowingPage';
import GovernancePage from './pages/GovernancePage';

export const routes = [
	{
		path: '/',
		element: <HomePage />,
	},
	{
		path: '/creators',
		element: <HomePage />,
	},
	{
		path: '/leaderboard',
		element: <LeaderboardPage />,
	},
	{
		path: '/creator/:id',
		element: <CreatorDetailPage />,
	},
	{
		path: '/creators/:id',
		element: <CreatorDetailPage />,
	},
	{
		path: '/creator/:id/dashboard',
		element: <CreatorDashboardPage />,
	},
	{
		path: '/creators/:id/dashboard',
		element: <CreatorDashboardPage />,
	},
	{
		path: '/notifications',
		element: <NotificationsPage />,
	},
	{
		path: '/profile',
		element: <ProfilePage />,
	},
	{
		path: '/following',
		element: <FollowingPage />,
	},
	{
		path: '/governance',
		element: <GovernancePage />,
	},
	{
		path: '*',
		element: <NotFoundPage />,
	},
];
