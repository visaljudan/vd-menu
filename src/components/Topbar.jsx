import { AppBar, Toolbar, Typography } from "@mui/material";

const Topbar = () => {
  return (
    <AppBar position="fixed" sx={{ width: `calc(100% - 240px)`, ml: "240px" }}>
      <Toolbar>
        <Typography variant="h6" noWrap>
          Admin Dashboard
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
