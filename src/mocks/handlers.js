import { rest } from 'msw'

export const handlers = [
  rest.post('/api/users', (req, res, ctx) => {
    const { name, username } = req.body
    return res(
      ctx.json({
        id: 'id',
        name,
        username,
      }),
    )
  }),
]
