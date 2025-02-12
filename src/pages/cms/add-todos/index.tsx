"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { trpc } from "../../../../utils/trpc";
import { TextField, Button, Container, Typography, Paper, Box, CircularProgress } from "@mui/material";

const AddTask = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { data: session } = useSession();
  const queryClient = trpc.useUtils(); // For refetching tasks

  // Fetch tasks for the logged-in user
  const { data: tasks, isLoading, error, refetch } = trpc.task.getTasks.useQuery(session?.user?.id ?? "", {
    enabled: !!session?.user?.id, // Only run query if user ID exists
  });

  const createTask = trpc.task.createTask.useMutation({
    onSuccess: () => {
      refetch(); // Refetch the tasks list after adding a new task
      setTitle(""); // Clear input fields
      setDescription("");
    },
    onError: (error) => {
      console.error("Error creating task:", error);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) {
      alert("You must be logged in to create a task.");
      return;
    }

    createTask.mutate({
      title,
      description,
      userId: session.user.id,
    });
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 5, borderRadius: 2 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Create a New Task
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Title"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            margin="normal"
            multiline
            rows={4}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={createTask.isPending}
          >
            {createTask.isPending ? "Adding..." : "Add Task"}
          </Button>
        </Box>
      </Paper>

      {/* {/ Display tasks below the form /} */}
      <Paper elevation={3} sx={{ p: 4, mt: 5, borderRadius: 2 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          All Tasks
        </Typography>
        {isLoading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">Failed to load tasks.</Typography>
        ) : tasks?.length === 0 ? (
          <Typography>No tasks found.</Typography>
        ) : (
          tasks?.map((task) => (
            <Paper key={task.id} elevation={1} sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6">{task.title}</Typography>
              <Typography variant="body2">{task.description}</Typography>
            </Paper>
          ))
        )}
      </Paper>
    </Container>
  );
};

export default AddTask;
