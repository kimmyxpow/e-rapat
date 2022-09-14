import nookies from 'nookies'

export function unauthPage(ctx) {
	return new Promise((resolve) => {
		const cookies = nookies.get(ctx)

		if (cookies._token)
			ctx.res.writeHead(302, { Location: '/dashboard' }).end()

		return resolve('unauthorized')
	})
}

export function authPage(ctx) {
	return new Promise((resolve) => {
		const cookies = nookies.get(ctx)

		if (!cookies._token) ctx.res.writeHead(302, { Location: '/' }).end()

		return resolve({
			token: cookies._token,
		})
	})
}
