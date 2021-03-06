import React, { useState, useEffect } from "react";
import { unstable_Box as Box } from "@material-ui/core/Box";
import { withStyles } from "@material-ui/core/styles";
import { TextField } from "@material-ui/core";
import TransactionButton from "../../../common/TransactionButton";
import { fromDecimal } from "web3-react/utilities";
import { useAccountEffect } from "web3-react/hooks";
import HydroDialog from "./HydroDialog";
import CallbackSpinner from "./CallbackSpinner";
import Web3 from "web3";

const web3 = new Web3(Web3.givenProvider);

const styles = theme => ({
  textArea: {
    fontFamily: "Monospace",
    color: "white"
  }
});

const WithdrawToExternal = ({
  classes,
  wallet,
  dailyLimit,
  withdrawnToday
}) => {
  const [amount, setAmount] = useState("");
  const [addressTo, setAddressTo] = useState("");
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

  useEffect(() => {
    if (wallet && wallet._address) {
      wallet.once("ChainlinkCallback", (error, event) => {
        setAwaitingCallback(false);
      });
    }
  }, [wallet, awaitingCallback]);

  return (
    <div>
      <CallbackSpinner awaitingCallback={awaitingCallback} />
      <Box display="flex" flexDirection="row">
        <TextField
          label="Amount"
          onChange={e => setAmount(e.target.value)}
          helperText="Amount of Hydro you want to Send"
          InputProps={{ className: classes.textArea }}
          InputLabelProps={{ className: classes.textArea }}
          FormHelperTextProps={{ className: classes.textArea }}
        />
        <Box marginLeft={3}>
          <TextField
            label="Address"
            onChange={e => setAddressTo(e.target.value)}
            helperText="Address you want to send HYDRO to"
            InputProps={{ className: classes.textArea }}
            InputLabelProps={{ className: classes.textArea }}
            FormHelperTextProps={{ className: classes.textArea }}
          />
        </Box>
        <Box height={25} marginLeft={3} marginTop={2}>
          <TransactionButton
            readyText="Send"
            className={classes.buttons}
            LabelProps={classes.textArea}
            method={() => {
              return Number(fromDecimal(amount, 18)) < Number(dailyLimit) &&
                web3.utils.toBN(amount).add(web3.utils.toBN(withdrawnToday)) <
                  web3.utils.toBN(dailyLimit)
                ? wallet.methods.withdrawToAddress(
                    fromDecimal(amount, 18),
                    addressTo
                  )
                : wallet.methods.requestOneTimeTransferExternal(
                    fromDecimal(amount, 18),
                    addressTo
                  );
            }}
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

export default withStyles(styles)(WithdrawToExternal);
