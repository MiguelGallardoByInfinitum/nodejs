import { Router } from 'express'

import { MovieController } from '../controllers/movies.js'

export const moviesRouter = Router()
//const router = Router()

moviesRouter.get('/', MovieController.getAll)
moviesRouter.get('/:id', MovieController.getById)
moviesRouter.post('/', MovieController.create)
moviesRouter.delete('/:id', MovieController.delete)
moviesRouter.patch('/:id', MovieController.update)

//export default router
