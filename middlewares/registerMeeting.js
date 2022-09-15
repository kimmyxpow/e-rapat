import nookies from 'nookies'

export function unRegisterMeetingPage(ctx) {
	return new Promise((resolve) => {
		const cookies = nookies.get(ctx)

		if (cookies._id_meeting)
			ctx.res.writeHead(302, { Location: '/register' }).end()

		return resolve('unauthorized')
	})
}

export function registerMeetingPage(ctx) {
	return new Promise((resolve) => {
		const cookies = nookies.get(ctx)

		if (!cookies._id_meeting)
			ctx.res.writeHead(302, { Location: '/scan' }).end()

		return resolve({
			token: cookies._id_meeting,
		})
	})
}
