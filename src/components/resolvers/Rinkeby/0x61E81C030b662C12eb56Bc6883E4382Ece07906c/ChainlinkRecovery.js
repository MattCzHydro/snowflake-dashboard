import React, { useState, useEffect } from "react";
import { unstable_Box as Box } from "@material-ui/core/Box";
import { withStyles } from "@material-ui/core/styles";
import TransactionButton from "../../../common/TransactionButton";
import HydroDialog from "./HydroDialog";
import CallbackSpinner from "./CallbackSpinner";

const styles = theme => ({
  textArea: {
    fontFamily: "Monospace",
    color: "white"
  }
});

const ChainlinkRecovery = ({ classes, wallet }) => {
  const [message, setMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [awaitingCallback, setAwaitingCallback] = useState(false);
  const handleClose = () => {
    setDialogOpen(false);
  };

  useEffect(() => {
    if (wallet) {
      wallet.once("RaindropMessage", (error, event) => {
        let tempMsg = event.returnValues.shortMessage;
        while (tempMsg.length < 6) {
          tempMsg = "0" + tempMsg;
        }
        setMessage(tempMsg);
        setDialogOpen(true);
      });
    }
  }, [wallet, message]);

  return (
    <div>
      <CallbackSpinner awaitingCallback={awaitingCallback} />
      <Box height={40} />
      <Box display="flex" flexDirection="row">
        <Box height={25} marginLeft={3} marginTop={2} marginBottom={3.5}>
          <TransactionButton
            readyText="Send Recovery Request"
            className={classes.buttons}
            LabelProps={classes.textArea}
            method={() => wallet.methods.requestChainlinkRecover()}
            onConfirmation={(conf, receipt) => {
              return conf.events.RaindropMessage
                ? setAwaitingCallback(true)
                : null;
            }}
          />
          <HydroDialog
            message={message}
            dialogOpen={dialogOpen}
            onClose={handleClose}
          />
        </Box>
      </Box>
    </div>
  );
};

export default withStyles(styles)(ChainlinkRecovery);
