import React from "react";
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { unstable_Box as Box } from "@material-ui/core/Box";

const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2
  }
});

const CallbackSpinner = ({ awaitingCallback, classes }) => {
  return awaitingCallback == true ? (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="Column"
      fontFamily="Monospace"
      fontSize={24}
      color="white"
      marginBottom={3}
    >
      {"Awaiting Chainlink Callback"}
      <CircularProgress className={classes.progress} />
    </Box>
  ) : (
    <Box height={40} />
  );
};

export default withStyles(styles)(CallbackSpinner);
