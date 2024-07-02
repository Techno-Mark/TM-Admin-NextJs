import { Box } from "@material-ui/core";
import { CircularProgress } from "@mui/material";

export const CustomLoadingOverlay = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    height="100%"
    width="100%"
  >
    <CircularProgress size={30} sx={{ color: "#002641 !important" }} />
  </Box>
);
