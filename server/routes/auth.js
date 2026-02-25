import { Router } from 'express'

const router = Router()

router.get('/github', (_req, res) => {
  const { GITHUB_ID, FRONTEND_URL } = process.env
  const params = new URLSearchParams({
    client_id: GITHUB_ID,
    redirect_uri: `${FRONTEND_URL}/auth/github/callback`,
    scope: 'read:user user:email repo',
  })
  res.redirect(`https://github.com/login/oauth/authorize?${params}`)
})

router.get('/github/callback', async (req, res) => {
  const { GITHUB_ID, GITHUB_SECRET, FRONTEND_URL } = process.env
  const { code } = req.query
  if (!code) return res.redirect(`${FRONTEND_URL}/auth/signin`)

  try {
    const tokenData = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: GITHUB_ID, client_secret: GITHUB_SECRET, code }),
    }).then((r) => r.json())

    if (!tokenData.access_token) return res.redirect(`${FRONTEND_URL}/auth/signin`)

    const userData = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    }).then((r) => r.json())

    req.session.accessToken = tokenData.access_token
    req.session.user = {
      login: userData.login,
      name: userData.name,
      avatarUrl: userData.avatar_url,
      bio: userData.bio,
      publicRepos: userData.public_repos,
      followers: userData.followers,
      following: userData.following,
      createdAt: userData.created_at,
      htmlUrl: userData.html_url,
    }

    res.redirect(`${FRONTEND_URL}/dashboard`)
  } catch (err) {
    console.error('[Auth]', err)
    res.redirect(`${FRONTEND_URL}/auth/signin`)
  }
})

router.get('/me', (req, res) => {
  if (!req.session?.user) return res.status(401).json({ error: 'Not authenticated' })
  res.json(req.session.user)
})

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid')
    res.json({ ok: true })
  })
})

export default router
