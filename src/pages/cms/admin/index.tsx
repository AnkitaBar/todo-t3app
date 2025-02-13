import React, { useEffect, useState } from "react";
import { trpc } from "../../../../utils/trpc";
import { getSession, useSession } from "next-auth/react";
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
import { Session } from "next-auth";

const AdminDashboard = () => {
    const [adminSession, setAdminSession] = useState<Session | null>(null);
  
  const { data: session } = useSession();
  const router = useRouter();

   useEffect(() => {
      const fetchSession = async () => {
        const sessionData = await getSession();
        setAdminSession(sessionData);
      };
      fetchSession();
    }, []);
    console.log(adminSession)

  const { data: users, isLoading, error } = trpc.user.getAllUsers.useQuery(
    { role: session?.user.role === "admin" ? "user" : "" },
    { enabled: !!session }
  );

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error fetching users</Typography>;

  return (
    <TableContainer component={Paper} sx={{ maxWidth: 800, margin: "auto", mt: 4 }}>
      <Typography variant="h6" sx={{ textAlign: "center", my: 2 }}>
        Welcome {adminSession?.user?.name || "Admin"} 
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
                  sx={{ ml: 2 ,  bgcolor: "	 #001a33" ,color:'white'}}
                
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
