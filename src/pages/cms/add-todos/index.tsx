"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { trpc } from "../../../../utils/trpc";
import { TextField, Button, Container, Typography, Paper, Box, CircularProgress } from "@mui/material";
import KanbanBoard from "../all-todos";

const AddTask = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState(""); // Deadline state
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
      setDeadline(""); // Clear the deadline field after successful creation
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

    const formattedDeadline = deadline ? new Date(deadline).toISOString() : new Date().toISOString();

    createTask.mutate({
      title,
      description,
      userId: session.user.id,
      deadline: formattedDeadline, // Pass the formatted deadline
    });
  };



  return (
    <>
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
          {/* {/ Deadline input field /} */}
            <TextField
              fullWidth
              label="Deadline"
              variant="outlined"
              type="date" // Use date input type
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
              margin="normal"
              InputLabelProps={{
                shrink: true, // To keep the label above the field for date input
              }}
            />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3, mb: 2 , bgcolor: "	 #001a33" ,color:'white'}}
            disabled={createTask.isPending}
          >
            {createTask.isPending ? "Adding..." : "Add Task"}
          </Button>
        </Box>
      </Paper>

      {/* {/ Display tasks below the form /} */}
    </Container>
    <br/>
      <KanbanBoard/>
      </>
  );
};

export default AddTask;
