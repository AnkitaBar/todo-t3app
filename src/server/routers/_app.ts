import { z } from 'zod';
import { procedure, router } from '../trpc';
import { taskRouter } from './todo';
import { userRouter } from './admin';
export const appRouter = router({
   task: taskRouter,
   user: userRouter,

});
// export type definition of API
export type AppRouter = typeof appRouter;