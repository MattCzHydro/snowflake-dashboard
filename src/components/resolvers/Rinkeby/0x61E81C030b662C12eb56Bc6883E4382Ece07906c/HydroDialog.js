import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import { unstable_Box as Box } from "@material-ui/core/Box";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";

const styles = theme => ({
  title: {
    color: "white",
    fontFamily: "Monospace",
    fontSize: 24
  },
  message: {
    color: "white",
    fontFamily: "Monospace",
    fontSize: 16
  }
});

const HydroDialog = ({ message, onClose, dialogOpen, classes }) => {
  return (
    <div>
      <Dialog open={dialogOpen} onClose={onClose}>
        <Box
          color="white"
          bgcolor="palevioletred"
          display="flex"
          border={1}
          borderRadius={4}
          justifyContent="center"
          flexDirection="column"
          alignitems="center"
        >
          <DialogTitle
            classes={{ root: classes.title }}
            disableTypography={true}
          >
            {"HydroID Message"}
          </DialogTitle>
          <DialogContent>
            <Box display="flex" justifyContent="center" alignItems="center">
              <DialogContentText classes={{ root: classes.message }}>
                {message}
              </DialogContentText>
            </Box>
          </DialogContent>
        </Box>
      </Dialog>
    </div>
  );
};

export default withStyles(styles)(HydroDialog);
