import React, { useState, useEffect } from "react";
import { unstable_Box as Box } from "@material-ui/core/Box";
import { withStyles } from "@material-ui/core/styles";
import { TextField, Select, MenuItem } from "@material-ui/core";
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
  },
  selectField: {
    fontSize: 14,
    fontFamily: "Monospace",
    color: "white"
  }
});

const WithdrawToAssociated = ({
  classes,
  wallet,
  associatedAddresses,
  withdrawnToday,
  dailyLimit
}) => {
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
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

  const handleAddressChange = e => {
    setAddress(e.target.value);
  };

  return (
    <div>
      <CallbackSpinner awaitingCallback={awaitingCallback} />
      <Box display="flex" flexDirection="row">
        <TextField
          label="Amount"
          onChange={e => setAmount(e.target.value)}
          helperText="Amount of Hydro you want to withdraw"
          InputProps={{ className: classes.textArea }}
          InputLabelProps={{ className: classes.textArea }}
          FormHelperTextProps={{ className: classes.textArea }}
        />
        <Box marginTop={1.5} marginLeft={3}>
          <Select
            autoWidth
            label="Associated Addresses"
            onChange={handleAddressChange}
            value={associatedAddresses}
            InputProps={{ className: classes.selectField }}
            MenuProps={{ className: classes.selectField }}
            SelectDisplayProps={{ className: classes.selectField }}
          >
            {associatedAddresses.map(address => (
              <MenuItem key={address} value={address}>
                {address}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Box marginLeft={3} marginTop={2}>
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
                    address
                  )
                : wallet.methods.requestOneTimeTransferExternal(
                    fromDecimal(amount, 18),
                    address
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

export default withStyles(styles)(WithdrawToAssociated);
