import { paths } from '@shared/paths';
import { Link } from 'react-router-dom';
import type { useSignUp } from '../model/hooks/useSignUp';

type Props = {
	form: ReturnType<typeof useSignUp>;
};

export const SignUpPage = ({ form }: Props) => {
	return (
		<main className="flex min-h-screen items-center justify-center bg-slate-100 px-6 py-10">
			<div className="w-full max-w-sm">
				<h1 className="mb-2 text-center text-3xl font-bold text-gray-800">
					TaskFlow
				</h1>
				<p className="mb-8 text-center text-sm text-gray-500">
					Create an account
				</p>

				<div className="overflow-hidden rounded-2xl bg-white shadow-sm">
					<form onSubmit={form.onSubmit} noValidate>
						<div className="px-8 py-8">
							{form.errorMessage && (
								<div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
									{form.errorMessage}
								</div>
							)}

							<div className="flex flex-col gap-4">
								<div className="flex flex-col gap-1.5">
									<label
										className="text-sm font-medium text-gray-700"
										htmlFor="email"
									>
										Email
									</label>
									<input
										id="email"
										type="email"
										autoComplete="email"
										placeholder="you@example.com"
										className={`w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none placeholder:text-gray-400 focus:ring-2 ${
											form.errors.email
												? 'border-red-300 focus:border-red-400 focus:ring-red-100'
												: 'focus:border-blue-400 focus:ring-blue-100'
										}`}
										disabled={form.isPending}
										{...form.register('email')}
									/>
									{form.errors.email && (
										<p className="text-xs text-red-500">
											{form.errors.email.message}
										</p>
									)}
								</div>

								<div className="flex flex-col gap-1.5">
									<label
										className="text-sm font-medium text-gray-700"
										htmlFor="password"
									>
										Password
									</label>
									<input
										id="password"
										type="password"
										autoComplete="new-password"
										placeholder="••••••••"
										className={`w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none placeholder:text-gray-400 focus:ring-2 ${
											form.errors.password
												? 'border-red-300 focus:border-red-400 focus:ring-red-100'
												: 'focus:border-blue-400 focus:ring-blue-100'
										}`}
										disabled={form.isPending}
										{...form.register('password')}
									/>
									{form.errors.password && (
										<p className="text-xs text-red-500">
											{form.errors.password.message}
										</p>
									)}
									{!form.errors.password && (
										<p className="text-xs text-gray-400">
											8+ characters, uppercase, lowercase, number, special
											character
										</p>
									)}
								</div>

								<div className="flex flex-col gap-1.5">
									<label
										className="text-sm font-medium text-gray-700"
										htmlFor="confirmPassword"
									>
										Confirm Password
									</label>
									<input
										id="confirmPassword"
										type="password"
										autoComplete="new-password"
										placeholder="••••••••"
										className={`w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none placeholder:text-gray-400 focus:ring-2 ${
											form.errors.confirmPassword
												? 'border-red-300 focus:border-red-400 focus:ring-red-100'
												: 'focus:border-blue-400 focus:ring-blue-100'
										}`}
										disabled={form.isPending}
										{...form.register('confirmPassword')}
									/>
									{form.errors.confirmPassword && (
										<p className="text-xs text-red-500">
											{form.errors.confirmPassword.message}
										</p>
									)}
								</div>

								<button
									type="submit"
									disabled={form.isPending}
									className="mt-2 w-full rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
								>
									{form.isPending ? 'Creating account…' : 'Sign Up'}
								</button>
							</div>
						</div>
					</form>

					<div className="border-t px-8 py-4 text-center text-sm text-gray-500">
						Already have an account?{' '}
						<Link
							to={paths.signIn}
							className="font-medium text-blue-500 hover:underline"
						>
							Sign in
						</Link>
					</div>
				</div>
			</div>
		</main>
	);
};
