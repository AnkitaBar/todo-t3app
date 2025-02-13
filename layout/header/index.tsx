import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useRouter } from "next/router";

const Header = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/auth/login");
  };

  return (
    <AppBar position="sticky" sx={{ bgcolor: "	 #001a33",  }}>
    <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: 5 }}>
      {/* Logo */}
      <Typography
        variant="h5"
        component={Link}
        href="/"
        sx={{
          textDecoration: "none",
          color: "white",
          fontWeight: "bold",
          letterSpacing: 1,
        }}
      >
        TodoApp
      </Typography>

      {/* Navigation Links */}
      {/* <Box sx={{ display: "flex", gap: 4 }}>
        <Button color="inherit" component={Link} href="/" sx={{ fontSize: "1rem" }}>
          Home
        </Button>
        <Button color="inherit" component={Link} href="/about" sx={{ fontSize: "1rem" }}>
          About
        </Button>
        <Button color="inherit" component={Link} href="/contact" sx={{ fontSize: "1rem" }}>
          Contact
        </Button>
      </Box> */}

      {/* Authentication Buttons */}
      {session ? (
        <Button
          variant="contained"
          onClick={() => handleLogout()}
          sx={{ fontWeight: "bold", px: 3, backgroundColor:'white' , color: 'black'}}
        >
          Logout
        </Button>
      ) : (
        <Button
          variant="contained"
          component={Link}
          href="/auth/login"
          sx={{ fontWeight: "bold", px: 3, backgroundColor:'white', color: 'black' }}
        >
          Login
        </Button>
      )}
    </Toolbar>
  </AppBar>
  );
};

export default Header;
