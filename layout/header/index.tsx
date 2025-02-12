import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

const Header = () => {
  const { data: session } = useSession();

  return (
    <AppBar position="sticky" sx={{ bgcolor: "primary.dark", py: 1 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: 4 }}>
        {/* Logo */}
        <Typography
          variant="h5"
          component={Link}
          href="/"
          sx={{ textDecoration: "none", color: "white", fontWeight: "bold" }}
        >
          MyApp
        </Typography>

        {/* Navigation Links */}
        <Box sx={{ display: "flex", gap: 4 }}>
          <Button color="inherit" component={Link} href="/">Home</Button>
          <Button color="inherit" component={Link} href="/about">About</Button>
          <Button color="inherit" component={Link} href="/contact">Contact</Button>
        </Box>

        {/* Authentication Buttons */}
        {session ? (
          <Button color="secondary" variant="contained" onClick={() => signOut()}>
            Logout
          </Button>
        ) : (
          <Button color="primary" variant="contained" component={Link} href="/auth/login">
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
