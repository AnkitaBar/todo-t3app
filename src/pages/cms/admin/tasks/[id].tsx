import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { trpc } from "../../../../../utils/trpc";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { getSession } from "next-auth/react";
import { Session } from "next-auth";


type Task = {
  id: string;
  title: string;
  description?: string;
  deadline?: Date | null;
  completed: boolean;
  inProgress: boolean;
};

const UserTasksPage = () => {
    const router = useRouter();
  const { id } = router.query;



  // Fetch tasks
  const { data: tasks, isLoading, error } = trpc.user.getUserTasks.useQuery(id as string, {
    enabled: !!id,
  });

  // Mutations for editing and deleting tasks
  const utils = trpc.useContext();
  const editTaskMutation = trpc.task.editTask.useMutation({
    onSuccess: () => {
      utils.user.getUserTasks.invalidate(); // Refresh UI
      handleClose(); // Close dialog
    },
  });

  const deleteTaskMutation = trpc.task.deleteTask.useMutation({
    onSuccess: () => {
      utils.user.getUserTasks.invalidate(); // Refresh UI
    },
  });

  // State for dialog
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Open Edit Dialog
  const handleOpen = (task: Task) => {
    setSelectedTask(task);
    setOpen(true);
  };

  // Close Dialog
  const handleClose = () => {
    setOpen(false);
    setSelectedTask(null);
  };

  // Handle Task Update
  const handleEditTask = () => {
    if (selectedTask) {
      editTaskMutation.mutate({
        id: selectedTask.id,
        title: selectedTask.title,
        description: selectedTask.description,
        deadline: selectedTask.deadline ? selectedTask.deadline.toISOString() : '',
      });
    }
  };

  
  // Handle Task Delete
  const handleDeleteTask = (taskId: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTaskMutation.mutate(taskId); // Pass only taskId instead of { id: taskId }
    }
  };

  if (isLoading) return <Typography>Loading tasks...</Typography>;
  if (error) return <Typography>Error fetching tasks</Typography>;

  return (
    <TableContainer component={Paper} sx={{ maxWidth: 800, margin: "auto", mt: 4, p: 2 }}>
      <Typography variant="h6" sx={{ textAlign: "center", my: 2 }}>
        User Tasks
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Title</strong></TableCell>
            <TableCell><strong>Description</strong></TableCell>
            <TableCell><strong>Status</strong></TableCell>
            <TableCell><strong>Deadline</strong></TableCell> 
            <TableCell><strong>Actions</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks?.map((task) => (
            <TableRow key={task.id}>
              <TableCell>{task.title}</TableCell>
              <TableCell>{task.description || "No description"}</TableCell>
              <TableCell>
                {task.completed ? "Completed" : task.inProgress ? "In Progress" : "Pending"}
              </TableCell>
              <TableCell>
                {task.deadline ? new Date(task.deadline).toLocaleDateString() : "No deadline"}
              </TableCell> 
              <TableCell>
                <IconButton color="primary" onClick={() => handleOpen({ ...task, deadline: task.deadline ? new Date(task.deadline) : null })}>
                  <Edit />
                </IconButton>
                <IconButton color="error" onClick={() => handleDeleteTask(task.id)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button onClick={() => router.back()} 
            sx={{ mt: 3, mb: 2 , bgcolor: "	 #001a33" ,color:'white'}}
            variant="contained">
        Back
      </Button>

      {/* {/ {/ Edit Task Dialog /} /} */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            value={selectedTask?.title || ""}
            onChange={(e) => setSelectedTask((prev) => ({ ...prev!, title: e.target.value }))}
            sx={{ my: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            value={selectedTask?.description || ""}
            onChange={(e) => setSelectedTask((prev) => ({ ...prev!, description: e.target.value }))}
            sx={{ my: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          <Button onClick={handleEditTask} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
};

export default UserTasksPage;
