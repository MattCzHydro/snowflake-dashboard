import React, { useState } from "react";
import { unstable_Box as Box } from "@material-ui/core/Box";
import { withStyles } from "@material-ui/core/styles";
import { TextField } from "@material-ui/core";
import TransactionButton from "../../../common/TransactionButton";
import { useNamedContract } from "../../../../common/hooks";
import { fromDecimal } from "web3-react/utilities";
import { useWeb3Context } from "web3-react/hooks";

const styles = theme => ({
  textArea: {
    fontFamily: "Monospace",
    color: "white"
  }
});

const DepositFromAddress = ({ classes, walletAddr }) => {
  const [amount, setAmount] = useState("");
  const hydroToken = useNamedContract("token");
  const context = useWeb3Context();

  return (
    <div>
      <Box height={40} />
      <Box display="flex" flexDirection="row">
        <TextField
          label="Amount"
          onChange={e => setAmount(e.target.value)}
          helperText="Amount of Hydro you want to send"
          InputProps={{ className: classes.textArea }}
          InputLabelProps={{ className: classes.textArea }}
          FormHelperTextProps={{ className: classes.textArea }}
        />
        <Box height={25} marginLeft={3} marginTop={2}>
          <TransactionButton
            readyText="Send"
            className={classes.buttons}
            LabelProps={classes.textArea}
            method={() =>
              hydroToken.methods.approveAndCall(
                walletAddr,
                fromDecimal(amount, 18),
                "0x00"
              )
            }
            onConfirmation={context.forceAccountReRender}
          />
        </Box>
      </Box>
    </div>
  );
};

export default withStyles(styles)(DepositFromAddress);
