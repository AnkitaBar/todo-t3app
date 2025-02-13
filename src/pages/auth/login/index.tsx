import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { TextField, Button, Typography, Container, Box, CircularProgress, Link } from "@mui/material";

export const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
    });

    if (res?.error) {
      setError(res.error);
      setLoading(false);
      return;
    }

    // Fetch session data to get user role
    const sessionRes = await fetch("/api/auth/session");
    const session = await sessionRes.json();

    if (session?.user?.role === "admin") {
      router.push("/cms/admin");
    } else {
      router.push("/cms/add-todos");
    }

    setLoading(false);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, p: 4, boxShadow: 3, borderRadius: 2, bgcolor: "background.paper" }}>
        <Typography variant="h4" gutterBottom align="center">
          Login
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            type="email"
            label="Email"
            variant="outlined"
            margin="normal"
            required
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <TextField
            fullWidth
            type="password"
            label="Password"
            variant="outlined"
            margin="normal"
            required
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          {error && (
            <Typography color="error" align="center" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            // color="primary"
            sx={{ mt: 3, mb: 2 , bgcolor: "	 #001a33" ,color:'white'}}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>
        </form>

        <Typography align="center">
          Don't have an account?{" "}
          <Link href="/auth/register" underline="hover"
          sx={{color: "	 #001a33", fontWeight:'bold'}}>
            Sign Up
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;
