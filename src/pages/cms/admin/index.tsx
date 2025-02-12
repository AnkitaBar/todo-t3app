import React from "react";
import { trpc } from "../../../../utils/trpc";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
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
} from "@mui/material";

const AdminDashboard = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const { data: users, isLoading, error } = trpc.user.getAllUsers.useQuery(
    { role: session?.user.role === "admin" ? "user" : "" },
    { enabled: !!session }
  );

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error fetching users</Typography>;

  return (
    <TableContainer component={Paper} sx={{ maxWidth: 800, margin: "auto", mt: 4 }}>
      <Typography variant="h6" sx={{ textAlign: "center", my: 2 }}>
        Admin Dashboard
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Name</strong></TableCell>
            <TableCell><strong>Email</strong></TableCell>
            <TableCell><strong>Tasks</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {user._count.tasks}
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{ ml: 2 }}
                  onClick={() => router.push(`/cms/admin/tasks/${user.id}`)}
                >
                  View Tasks
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AdminDashboard;
