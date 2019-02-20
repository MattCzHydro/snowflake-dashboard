import React, { useState, useEffect } from "react";
import { unstable_Box as Box } from "@material-ui/core/Box";
import { withStyles } from "@material-ui/core/styles";
import { TextField } from "@material-ui/core";
import TransactionButton from "../../../common/TransactionButton";
import Web3 from "web3";
import HydroDialog from "./HydroDialog";
import { useWeb3Context } from "web3-react/hooks";

const web3 = new Web3(Web3.givenProvider);

const styles = theme => ({
  textArea: {
    fontFamily: "Monospace",
    color: "white"
  }
});

const PasswordRecovery = ({ classes, wallet }) => {
  const context = useWeb3Context();
  const [message, setMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [recoveryPass, setRecoveryPass] = useState("");
  const [revealPass, setRevealPass] = useState("");
  const [commit, setCommit] = useState("");
  const [didCommit, setDidCommit] = useState();
  const [passHash, setPassHash] = useState("");

  const handleClose = () => {
    setDialogOpen(false);
  };

  useEffect(() => {
    if (wallet) {
      wallet.methods
        .getCommitHash(context.account)
        .call()
        .then(result => setCommit(result))
        .then(
          !commit
            ? null
            : wallet.methods
                .checkIfCommitExists(commit)
                .call()
                .then(result => setDidCommit(result))
        )
        .then(
          wallet.methods
            .getOneTimePassHash()
            .call()
            .then(result => setPassHash(result))
        );
    }
  }, [wallet, commit]);

  console.log("PassHash: ", passHash);
  console.log(
    "revealHash: ",
    web3.utils.soliditySha3(wallet._address, revealPass)
  );
  console.log(
    web3.utils.soliditySha3(
      wallet._address,
      web3.utils.soliditySha3(recoveryPass)
    )
  );

  return commit == 0 ? (
    <div>
      <Box height={40} />
      <Box display="flex" flexDirection="row">
        <Box height={25} marginLeft={3} marginTop={2} marginBottom={3.5}>
          <Box marginBottom={2}>
            <TextField
              label="Password Commit"
              type="password"
              onChange={e => setRecoveryPass(e.target.value)}
              helperText="Password"
              InputProps={{ className: classes.textArea }}
              InputLabelProps={{ className: classes.textArea }}
              FormHelperTextProps={{ className: classes.textArea }}
            />
          </Box>
          <TransactionButton
            readyText="Commit Password"
            className={classes.buttons}
            LabelProps={classes.textArea}
            method={() =>
              wallet.methods.commitHash(
                web3.utils.soliditySha3(context.account, recoveryPass)
              )
            }
          />
          <HydroDialog
            message={message}
            dialogOpen={dialogOpen}
            onClose={handleClose}
          />
        </Box>
      </Box>
    </div>
  ) : (
    <div>
      <Box height={40} />
      <Box display="flex" flexDirection="row">
        <Box height={25} marginLeft={3} marginTop={2} marginBottom={3.5}>
          <Box marginBottom={2}>
            <TextField
              label="Password Reveal"
              type="password"
              onChange={e => setRevealPass(e.target.value)}
              helperText="Password"
              InputProps={{ className: classes.textArea }}
              InputLabelProps={{ className: classes.textArea }}
              FormHelperTextProps={{ className: classes.textArea }}
            />
          </Box>
          <TransactionButton
            readyText="Send Reveal Request"
            className={classes.buttons}
            LabelProps={classes.textArea}
            method={() =>
              wallet.methods.revealAndRecover(
                web3.utils.soliditySha3(context.account, revealPass),
                context.account,
                revealPass
              )
            }
          />
        </Box>
      </Box>
    </div>
  );
};

export default withStyles(styles)(PasswordRecovery);
