import {
	ArrowRightOnRectangleIcon,
	ArrowSmallRightIcon,
	ChatBubbleBottomCenterTextIcon,
	Cog8ToothIcon,
	CogIcon,
	CursorArrowRippleIcon,
	InformationCircleIcon,
	RectangleStackIcon,
	SignalIcon,
	Square3Stack3DIcon,
	Squares2X2Icon,
	UserGroupIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import nookies from 'nookies'
import Router, { useRouter } from 'next/router'

const Aside = () => {
	const [open, setOpen] = useState(false)
	const [user, setUser] = useState({})

	useEffect(() => {
		setUser(JSON.parse(nookies.get()._user))
	}, [])

	const logoutHandler = () => {
		nookies.destroy(null, '_token')
		nookies.destroy(null, '_user')

		Router.push('/')
	}

	const router = useRouter()

	return (
		<aside
			className={`h-full min-w-[260px] w-[260px] max-w-[260px] py-12 px-8 bg-white flex justify-between flex-col lg:static fixed inset-y-0 left-0 lg:translate-x-0 ${
				open ? 'translate-x-0' : '-translate-x-full'
			} transition-all duration-300`}
		>
			<div className='relative'>
				<button
					onClick={() => setOpen(!open)}
					className='absolute lg:opacity-0 -right-24 bg-zinc-800 text-white rounded-full h-10 w-10 grid place-items-center'
				>
					<ArrowSmallRightIcon
						className={`w-4 absolute ${
							open ? 'rotate-180' : 'rotate-0'
						} transition-all duration-300`}
					/>
				</button>
				<div className='space-y-8'>
					<div className='flex items-center gap-2'>
						<picture>
							<source srcSet='/img/Logo.png' type='image/png' />
							<img src='/img/Logo.png' alt='Logo' />
						</picture>
						<span className='font-bold text-2xl text-zinc-800'>
							E-Rapat
						</span>
					</div>
					<div className='space-y-4'>
						<span className='text-zinc-400 uppercase tracking-widest text-sm font-bold'>
							MENU
						</span>
						<div className='space-y-2'>
							<Link href='/dashboard'>
								<a
									className={`flex items-center gap-2 py-3 px-4 rounded-lg transition-all duration-200 font-semibold ${
										router.pathname == '/dashboard'
											? 'bg-zinc-800 text-white hover:bg-zinc-900 focus:bg-zinc-900'
											: 'hover:bg-zinc-200 focus:bg-zinc-200 text-zinc-800'
									}`}
								>
									<Squares2X2Icon className='w-6' />
									<span>Dashboard</span>
								</a>
							</Link>
							{user.role === 'super_admin' && (
								<>
									<Link href='/dashboard/users'>
										<a
											className={`flex items-center gap-2 py-3 px-4 rounded-lg transition-all duration-200 font-semibold ${
												router.pathname ==
												'/dashboard/users'
													? 'bg-zinc-800 text-white hover:bg-zinc-900 focus:bg-zinc-900'
													: 'hover:bg-zinc-200 focus:bg-zinc-200 text-zinc-800'
											}`}
										>
											<UserGroupIcon className='w-6' />
											<span>User</span>
										</a>
									</Link>
								</>
							)}
							{user.role === 'admin' && (
								<>
									<Link href='/dashboard/categories'>
										<a
											className={`flex items-center gap-2 py-3 px-4 rounded-lg transition-all duration-200 font-semibold ${
												router.pathname ==
												'/dashboard/categories'
													? 'bg-zinc-800 text-white hover:bg-zinc-900 focus:bg-zinc-900'
													: 'hover:bg-zinc-200 focus:bg-zinc-200 text-zinc-800'
											}`}
										>
											<Square3Stack3DIcon className='w-6' />
											<span>Category</span>
										</a>
									</Link>
								</>
							)}
							<Link href='/dashboard/meetings'>
								<a
									className={`flex items-center gap-2 py-3 px-4 rounded-lg transition-all duration-200 font-semibold ${
										router.pathname == '/dashboard/meetings'
											? 'bg-zinc-800 text-white hover:bg-zinc-900 focus:bg-zinc-900'
											: 'hover:bg-zinc-200 focus:bg-zinc-200 text-zinc-800'
									}`}
								>
									<ChatBubbleBottomCenterTextIcon className='w-6' />
									<span>Meeting</span>
								</a>
							</Link>
						</div>
					</div>
				</div>
			</div>
			<div className='flex gap-1'>
				<button
					onClick={logoutHandler.bind(this)}
					className='h-10 w-10 rounded-full bg-red-600 text-white grid place-items-center hover:bg-red-700 focus:bg-red-700 transition-all duration-200'
				>
					<ArrowRightOnRectangleIcon className='w-5' />
				</button>
			</div>
		</aside>
	)
}

export default Aside
