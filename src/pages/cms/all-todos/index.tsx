import { Container, Typography, Paper, Box, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from "@mui/material";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "../../../../utils/trpc";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from "react";

interface Task {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  inProgress: boolean;
  userId: string;
}

export const KanbanBoard = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // Fetch tasks from database
  const { data: tasks, isLoading, error } = trpc.task.getTasks.useQuery(session?.user?.id ?? "", {
    enabled: !!session?.user?.id,
  });

  // Mutation to update task status
  const updateTask = trpc.task.updateTask.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries<any>([["task.getTasks", { userId: session?.user?.id }]]);
    },
  });


 // Mutation to delete task
const deleteTask = trpc.task.deleteTask.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries<any>([["task.getTasks", { userId: session?.user?.id }]]);
    },
  });
  

  // Mutation to edit task
  const editTask = trpc.task.editTask.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries<any>([["task.getTasks", { userId: session?.user?.id }]]);
    },
  });

  // Categorize tasks
  const allTasks = tasks?.filter((task) => !task.completed && !task.inProgress) || [];
  const inProgressTasks = tasks?.filter((task) => task.inProgress && !task.completed) || [];
  const doneTasks = tasks?.filter((task) => task.completed) || [];

  // Handle Drag & Drop
  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const newStatus =
      destination.droppableId === "inProgress"
        ? { completed: false, inProgress: true }
        : destination.droppableId === "done"
        ? { completed: true, inProgress: false }
        : { completed: false, inProgress: false };

    updateTask.mutate({ id: draggableId, ...newStatus });
  };

  const handleDeleteTask = (id: string) => {
    deleteTask.mutate( id );
  };

  // Dialog state for editing task
  const [open, setOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const handleOpenDialog = (task: Task) => {
    setCurrentTask(task);
    setNewTitle(task.title);
    setNewDescription(task.description || "");
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setCurrentTask(null);
    setNewTitle("");
    setNewDescription("");
  };

  const handleUpdateTask = () => {
    if (currentTask) {
      editTask.mutate({
        id: currentTask.id,
        title: newTitle,
        description: newDescription,
      });
    }
    handleCloseDialog();
  };

  if (isLoading) return <Typography>Loading tasks...</Typography>;
  if (error) return <Typography color="error">Failed to load tasks.</Typography>;

  return (
    <Container>
      <Typography variant="h4" textAlign="center" gutterBottom>
        Kanban Board
      </Typography>
      <DragDropContext onDragEnd={onDragEnd}>
        <Box display="flex" justifyContent="space-around" gap={3}>
          <KanbanColumn title="All Tasks" tasks={allTasks} id="allTasks" onDelete={handleDeleteTask} onEdit={handleOpenDialog} />
          <KanbanColumn title="In Progress" tasks={inProgressTasks} id="inProgress" onDelete={handleDeleteTask} onEdit={handleOpenDialog} />
          <KanbanColumn title="Done" tasks={doneTasks} id="done" onDelete={handleDeleteTask} onEdit={handleOpenDialog} />
        </Box>
      </DragDropContext>

      {/* {/ Edit Task Dialog /} */}
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Description"
            fullWidth
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            margin="normal"
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdateTask} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

// Kanban Column Component
interface KanbanColumnProps {
  title: string;
  tasks: Task[];
  id: string;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ title, tasks, id, onDelete, onEdit }) => {
  return (
    <Droppable droppableId={id}>
      {(provided) => (
        <Paper
          ref={provided.innerRef}
          {...provided.droppableProps}
          elevation={3}
          sx={{ p: 3, width: 300, minHeight: 400, bgcolor: "#f5f5f5", borderRadius: 2 }}
        >
          <Typography variant="h6" fontWeight="bold" textAlign="center" gutterBottom>
            {title}
          </Typography>
          {tasks.map((task, index) => (
            <Draggable key={task.id} draggableId={task.id} index={index}>
              {(provided) => (
                <Paper
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  sx={{ p: 2, mb: 2, bgcolor: "white", borderRadius: 2 }}
                >
                  <Typography variant="h6">{task.title}</Typography>
                  <Typography variant="body2">{task.description}</Typography>

                  {/* {/ Edit and Delete buttons /} */}
                  <Box display="flex" justifyContent="flex-end" gap={1}>
                    <IconButton onClick={() => onEdit(task)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => onDelete(task.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Paper>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </Paper>
      )}
    </Droppable>
  );
};

export default KanbanBoard;
