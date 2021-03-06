import React from "react";
<<<<<<< HEAD
import classnames from "classnames";
=======
>>>>>>> 50ae16359aa344b75a484ad15b00036cfecf791f
import { Button } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import { withTheme, withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { useWeb3Context, useTransactionManager } from "web3-react/hooks";
import { getEtherscanLink } from "web3-react/utilities";

const styles = theme => ({
  ready: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    "&:hover": {
      backgroundColor: theme.palette.primary.dark
    }
  },
  sendingPending: {
    backgroundColor: theme.palette.grey[300],
    color: theme.palette.getContrastText(theme.palette.grey[300]),
    "&:hover": {
      backgroundColor: theme.palette.grey[500]
    }
  },
  error: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    "&:hover": {
      backgroundColor: theme.palette.error.dark
    }
  },
  success: {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.contrastText,
    "&:hover": {
      backgroundColor: theme.palette.success.dark
    }
  }
});

const ProgressIcon = withTheme()(({ theme }) => (
  <CircularProgress size={theme.typography.button.fontSize} />
));

function TransactionButton({
  show,
  method,
  readyText,
  classes,
  onTransactionHash,
  onConfirmation,
  transactionOptions,
<<<<<<< HEAD
  LabelProps,
=======
>>>>>>> 50ae16359aa344b75a484ad15b00036cfecf791f
  disabled
}) {
  const context = useWeb3Context();
  const [
    transactionState,
    transactionData,
    sendTransaction,
    resetTransaction
  ] = useTransactionManager(method, {
    handlers: { transactionHash: onTransactionHash, receipt: onConfirmation },
    transactionOptions: transactionOptions
  });
<<<<<<< HEAD

  console.log(transactionData);
=======
>>>>>>> 50ae16359aa344b75a484ad15b00036cfecf791f

  switch (transactionState) {
    case "ready":
      return (
        <Button
          style={show ? undefined : { display: "none" }}
          variant="contained"
          onClick={sendTransaction}
<<<<<<< HEAD
          className={classnames(classes.ready, LabelProps)}
=======
          className={classes.ready}
>>>>>>> 50ae16359aa344b75a484ad15b00036cfecf791f
          disabled={disabled}
        >
          {readyText}
        </Button>
      );
    case "sending":
      return (
        <Button
          style={show ? undefined : { display: "none" }}
          variant="contained"
          disabled={true}
          className={classes.sendingPending}
        >
          <ProgressIcon />
        </Button>
      );
    case "pending":
      return (
        <Button
          style={show ? undefined : { display: "none" }}
          variant="contained"
          className={classnames(classes.sendingPending, LabelProps)}
          component="a"
          href={getEtherscanLink(
            context.networkId,
            "transaction",
            transactionData.transactionHash
          )}
          target="_blank"
        >
          <span>
            Pending Confirmation <ProgressIcon />
          </span>
        </Button>
      );
    case "success":
      return (
        <Button
          style={show ? undefined : { display: "none" }}
          variant="contained"
          className={classnames(classes.success, LabelProps)}
          component="a"
          href={getEtherscanLink(
            context.networkId,
            "transaction",
            transactionData.transactionHash
          )}
          target="_blank"
        >
          <span>Success!</span>
        </Button>
      );
    case "error":
      return (
        <Button
          style={show ? undefined : { display: "none" }}
          variant="contained"
          onClick={resetTransaction}
          className={classnames(classes.error, LabelProps)}
        >
          <span>Error. Retry?</span>
        </Button>
      );
    default:
      throw Error("This should not happen™.");
  }
}

TransactionButton.propTypes = {
  show: PropTypes.bool,
  method: PropTypes.func.isRequired,
  readyText: PropTypes.node.isRequired,
  classes: PropTypes.object.isRequired,
  onTransactionHash: PropTypes.func,
  onConfirmation: PropTypes.func,
<<<<<<< HEAD
  transactionOptions: PropTypes.object,
  LabelProps: PropTypes.string
=======
  transactionOptions: PropTypes.object
>>>>>>> 50ae16359aa344b75a484ad15b00036cfecf791f
};

TransactionButton.defaultProps = {
  show: true,
  onTransactionHash: () => {},
  onConfirmation: () => {}
};

export default withStyles(styles)(TransactionButton);
