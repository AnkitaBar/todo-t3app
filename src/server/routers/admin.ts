import { router, procedure } from "../trpc";
import { prisma } from "../../../lib/db"; // Ensure correct import path
import { z } from "zod"; // Import zod for input validation

export const userRouter = router({
  // getAllUsers: procedure.query(async () => {
  //   return await prisma.user.findMany({
  //     select: {
  //       id: true,
  //       name: true,
  //       email: true,
  //       _count: {
  //         select: { tasks: true }, // Count the number of tasks for each user
  //       },
  //     },
  //   });
  // }),



  getAllUsers: procedure
  .input(z.object({
    role: z.string().optional(), // Accept role as an optional input
  }))
  .query(async ({ input }) => {
    const { role } = input;

    // Build query based on the presence of the `role` filter
    const users = await prisma.user.findMany({
      where: role ? { role } : {}, // If role is provided, filter by it; otherwise, no filter
      select: {
        id: true,
        name: true,
        email: true,
        _count: {
          select: { tasks: true }, // Count the number of tasks for each user
        },
      },
    });

    return users;
  }),

  // Define the procedure for fetching tasks for a specific user
  getUserTasks: procedure.input(z.string()).query(async ({ input }) => {
    return prisma.task.findMany({
      where: { userId: input },
      select: {
        id: true,
        title: true,
        description: true,
        inProgress: true,
        completed: true,
      },
    }).then(tasks => 
      tasks.map(task => ({
        ...task,
        description: task.description ?? undefined, // Convert null to undefined
      }))
    );
  }),


  deleteTask: procedure
  .input(z.object({ id: z.string() })) // Expect an object { id: string }
  .mutation(async ({ input }) => {
    return prisma.task.delete({ where: { id: input.id } });
  }),


  
 
  // Edit Task Procedure
  editTask: procedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string().nullable(),
        completed: z.boolean(),
        inProgress: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      return prisma.task.update({
        where: { id: input.id },
        data: {
          title: input.title,
          description: input.description,
          completed: input.completed,
          inProgress: input.inProgress,
        },
      });
    }),


  
});
