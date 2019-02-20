import React, { useState, useEffect } from "react";
import { Slide, Select, MenuItem } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { unstable_Box as Box } from "@material-ui/core/Box";
import { useWeb3Context } from "web3-react/hooks";
import DepositFromAddress from "./DepositFromAddress";
import DepositFromSnowflake from "./DepositFromSnowflake";
import WithdrawToAssociated from "./WithdrawToAssociated";
import WithdrawToSnowflake from "./WithdrawToSnowflake";
import WithdrawToEin from "./WithdrawToEin";
import WithdrawToExternal from "./WithdrawToExternal";
import ChainlinkRecovery from "./ChainlinkRecovery";
import PasswordRecovery from "./PasswordRecovery";

const styles = theme => ({
  textArea: {
    color: "white",
    fontFamily: "Monospace"
  },
  selectFields: {
    fontFamily: "Monospace"
  },
  buttons: {
    fontFamily: "Monospace"
  }
});

const TransactionOptions = ({
  classes,
  wallet,
  walletAddr,
  dailyLimit,
  identityInfo,
  ein,
  withdrawnToday,
  hasPassword
}) => {
  const [amount, setAmount] = useState();
  const [open, setOpen] = useState(false);
  const [choice, setChoice] = useState(1);
  const context = useWeb3Context();

  const handleChoice = e => {
    setChoice(e.target.value);
    setAmount(0);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleOptions = choice => {
    switch (choice) {
      case 1:
        return <DepositFromAddress walletAddr={walletAddr} />;
      case 2:
        return <DepositFromSnowflake wallet={wallet} />;
      case 3:
        return (
          <WithdrawToAssociated
            wallet={wallet}
            associatedAddresses={identityInfo[1]}
            dailyLimit={dailyLimit}
            withdrawnToday={withdrawnToday}
          />
        );
      case 4:
        return (
          <WithdrawToSnowflake
            wallet={wallet}
            dailyLimit={dailyLimit}
            ein={ein}
            withdrawnToday={withdrawnToday}
          />
        );
      case 5:
        return (
          <WithdrawToEin
            wallet={wallet}
            dailyLimit={dailyLimit}
            withdrawnToday={withdrawnToday}
          />
        );
      case 6:
        return (
          <WithdrawToExternal
            wallet={wallet}
            dailyLimit={dailyLimit}
            withdrawnToday={withdrawnToday}
          />
        );
      case 7:
        return <ChainlinkRecovery wallet={wallet} />;
      case 8:
        if (hasPassword) {
          return <PasswordRecovery wallet={wallet} />;
        } else {
          return null;
        }
    }
  };

  console.log(hasPassword);

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      marginTop={2}
    >
      <Box marginBottom={10}>
        <Select
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          value={choice}
          onChange={handleChoice}
          variant="filled"
          className={classes.textArea}
        >
          <MenuItem className={classes.selectFields} value={1}>
            Deposit From Your Address
          </MenuItem>
          <MenuItem className={classes.selectFields} value={2}>
            Deposit From Your Snowflake
          </MenuItem>
          <MenuItem className={classes.selectFields} value={3}>
            Withdraw To Associated Address
          </MenuItem>
          <MenuItem className={classes.selectFields} value={4}>
            Withdraw To Your Snowflake
          </MenuItem>
          <MenuItem className={classes.selectFields} value={5}>
            Send To Other EINs
          </MenuItem>
          <MenuItem className={classes.selectFields} value={6}>
            Send To Other Addresses
          </MenuItem>
          <MenuItem className={classes.selectFields} value={7}>
            Chainlink Recovery
          </MenuItem>
          {hasPassword ? (
            <MenuItem className={classes.selectFields} value={8}>
              Password Recovery
            </MenuItem>
          ) : null}
        </Select>
      </Box>
      <Box>
        <Box marginBottom={25} display="flex" justifyContent="center">
          <Box
            position="absolute"
            display="flex"
            justifyContent="center"
            zIndex={1}
          >
            <Slide
              direction="left"
              in={choice == 1 || choice == 2}
              aria-label="Collapse"
            >
              <Box>{"Deposit"}</Box>
            </Slide>
          </Box>
          <Box
            position="absolute"
            display="flex"
            justifyContent="center"
            zIndex={1}
          >
            <Slide
              direction="right"
              in={choice == 3 || choice == 4}
              aria-label="Collapse"
            >
              <Box>{"Withdraw"}</Box>
            </Slide>
          </Box>
          <Box
            position="absolute"
            display="flex"
            justifyContent="center"
            zIndex={1}
          >
            <Slide
              direction="down"
              in={choice == 5 || choice == 6}
              aria-label="Collapse"
            >
              <Box>{"Send"}</Box>
            </Slide>
          </Box>
          <Box
            position="absolute"
            display="flex"
            justifyContent="center"
            zIndex={1}
          >
            <Slide
              direction="up"
              in={choice == 7 || choice == 8}
              aria-label="Collapse"
            >
              <Box>{"Recover"}</Box>
            </Slide>
          </Box>
        </Box>
        <Box marginBottom={3}>{handleOptions(choice)}</Box>
      </Box>
    </Box>
  );
};

export default withStyles(styles)(TransactionOptions);
