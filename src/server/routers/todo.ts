
import { z } from "zod";
import { procedure, router } from "../trpc";
import { prisma } from "../../../lib/db";

export const taskRouter = router({
    // for creating a new task
    createTask: procedure
    .input(z.object({ title: z.string(), description: z.string(), userId: z.string() }))
    // .mutation(async ({ input }) => {
    //   return await prisma.task.create({
    //     data: { title: input.title, completed: false, userId: input.userId },
    //   });
    // }),

    .mutation(async ({ input }) => {
        const userExists = await prisma.user.findUnique({
            where: { id: input.userId },
          });
      
          if (!userExists) {
            console.error("User not found with ID:", input.userId);
            throw new Error("User not found");
          }
      
          return await prisma.task.create({
            data: { title: input.title, description: input.description, completed: false, userId: input.userId },
          });
      }),


    // for getting all tasks
    getTasks: procedure
    .input(z.string()).query(async ({ input }) => {
        return await prisma.task.findMany({
          where: { userId: input },
        });
    }),


    // // for updating a task toggle completed
    // toggleTask: procedure
    // .input(z.string()).mutation(async ({ input }) => {
    //     const task = await prisma.task.findUnique({ where: { id: input } });
    //     if (!task) throw new Error("Task not found");
    //     return await prisma.task.update({
    //       where: { id: input },
    //       data: { completed: !task.completed },
    //     });
    // }),

    // // for  deleting a task
    // deleteTask: procedure
    // .input(z.string()).mutation(async ({ input }) => {
    //     return await prisma.task.delete({ where: { id: input } });
    // }),
//// update complete field
updateTask: procedure
.input(
  z.object({
    id: z.string(),
    title: z.string().optional(),
    description: z.string().optional(),
    completed: z.boolean().optional(),
    inProgress: z.boolean().optional(),
  })
)
.mutation(async ({ ctx, input }) => {
  return await prisma.task.update({
    where: { id: input.id },
    data: {
      title: input.title ?? undefined,
      description: input.description ?? undefined,
      completed: input.completed ?? undefined,
      inProgress: input.inProgress ?? undefined,
    },
  });
}),


editTask: procedure
.input(
  z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional(),
  })
)
.mutation(async ({ input }) => {
  return await prisma.task.update({
    where: { id: input.id },
    data: {
      title: input.title,
      description: input.description ?? undefined,
    },
  });
}),


  // for deleting a task
  // Delete a task
  deleteTask: procedure
  .input(z.string()) // Expect a task ID as input
  .mutation(async ({ input }) => {
    try {
      // Deleting the task from the database using the provided ID
      const deletedTask = await prisma.task.delete({
        where: { id: input },
      });
      return deletedTask; // Return the deleted task
    } catch (error) {
      console.error("Error deleting task:", error);
      throw new Error("Failed to delete task");
    }
  }),
  
})