import { ReactNode } from "react";
import { Container, Box } from "@mui/material";
import Header from "../header";

interface LayoutProps {
  children: ReactNode;
}

export const Wrapper = ({ children }: LayoutProps) => {
  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>{children}</Box>
      </Container>
    </>
  );
};

export default Wrapper;
