import { queryClient, supabaseClient } from '@shared/lib';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter as Router } from 'react-router-dom';
import { SupabaseProvider } from '@/app/providers/supabase.tsx/supabase-provider';
import { AppRoute } from './router/react-router-dom-provider';

export const Providers = () => {
	return (
		<SupabaseProvider client={supabaseClient}>
			<QueryClientProvider client={queryClient}>
				<Router>
					<AppRoute />
				</Router>
				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</SupabaseProvider>
	);
};
