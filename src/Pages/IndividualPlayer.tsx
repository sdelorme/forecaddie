import { Box, Typography } from "@mui/material";

export default function IndividualPlayerInfo() {
  return (
    <Box
      sx={{
        flexGrow: 1,
        backgroundColor: "whitesmoke",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h3">This will hold information for individual player</Typography>
    </Box>
  );
}
