import { useState } from "react";
import { useRouter } from "next/router";
import { TextField, Button, Typography, Container, Box, CircularProgress, Link } from "@mui/material";

export const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setIsSuccess(true);
      setMessage("Registration successful! Redirecting to login...");
      setTimeout(() => router.push("/auth/login"), 2000);
    } else {
      setIsSuccess(false);
      setMessage(data.error || "Something went wrong");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, p: 4, boxShadow: 3, borderRadius: 2, bgcolor: "background.paper" }}>
        <Typography variant="h4" gutterBottom align="center">
          Sign Up
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            name="name"
            label="Name"
            variant="outlined"
            margin="normal"
            required
            onChange={handleChange}
          />
          <TextField
            fullWidth
            name="email"
            type="email"
            label="Email"
            variant="outlined"
            margin="normal"
            required
            onChange={handleChange}
          />
          <TextField
            fullWidth
            name="password"
            type="password"
            label="Password"
            variant="outlined"
            margin="normal"
            required
            onChange={handleChange}
          />

          {message && (
            <Typography color={isSuccess ? "success.main" : "error.main"} align="center" sx={{ mt: 1 }}>
              {message}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 , bgcolor: "	 #001a33" ,color:'white'}}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Register"}
          </Button>
        </form>

        <Typography align="center">
          Already have an account?{" "}
          <Link href="/auth/login" underline="hover"
                    sx={{color: "	 #001a33", fontWeight:'bold'}}
                    >

            Login
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Register;
