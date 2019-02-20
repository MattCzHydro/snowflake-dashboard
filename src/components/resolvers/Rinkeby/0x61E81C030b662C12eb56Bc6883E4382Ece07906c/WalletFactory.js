import React, { useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { toDecimal } from "web3-react/utilities";
import { useAccountEffect, useWeb3Context } from "web3-react/hooks";
import {
  useGenericContract,
  useNamedContract,
  useEINDetails
} from "../../../../common/hooks";
import TransactionButton from "../../../common/TransactionButton";
import TransactionOptions from "./TransactionOptions";
import TextField from "@material-ui/core/TextField";
import { ABI, ABI2 } from "./index";
import { unstable_Box as Box } from "@material-ui/core/Box";
import Web3 from "web3";
import disableScroll from "disable-scroll";

const web3 = new Web3(Web3.givenProvider);

const styles = theme => ({
  root: {
    marginTop: "2.5%",
    marginRight: "10%",
    marginLeft: "10%",
    marginBottom: "2.5%"
  },
  textArea: {
    fontFamily: "Monospace",
    color: "white"
  }
});

const WalletFactory = ({ classes, ein }) => {
  const context = useWeb3Context();
  const [walletAddress, setCurrentWallet] = useState("");
  const [dailyLimit, setDailyLimit] = useState("");
  const [withdrawnToday, setWithdrawnToday] = useState("");
  const [hydroBalance, setHydroBalance] = useState("");
  const [identityInfo, setIdentityInfo] = useState({});
  const [linkBalance, setLinkBalance] = useState("");
  const [hasPassword, setHasPassword] = useState("");
  const [tempPass, setTempPass] = useState("");
  const [chainlinkCallback, setChainlinkCallback] = useState(true);
  const [hydroId, setHydroId] = useState("");

  const snowflakeContract = useNamedContract("snowflake");
  const identityContract = useNamedContract(1484);

  const einDetails = useEINDetails(ein);

  const factory = useGenericContract(
    "0x61E81C030b662C12eb56Bc6883E4382Ece07906c",
    ABI
  );
  const wallet = useGenericContract(walletAddress, ABI2);

  useAccountEffect(() => {
    factory.methods
      .getWalletByEIN(ein)
      .call()
      .then(result => setCurrentWallet(result))
      .catch(error => console.log(error))
      .then(
        identityContract.methods
          .getIdentity(ein)
          .call()
          .then(result => setIdentityInfo(result))
      );
  });

  useAccountEffect(() => {
    if (walletAddress) {
      wallet.methods
        .getDailyLimit()
        .call()
        .then(result => setDailyLimit(result))
        .then(
          wallet.methods
            .getHydroBalance()
            .call()
            .then(result => setHydroBalance(result))
        )
        .then(
          wallet.methods
            .getWithdrawnToday()
            .call()
            .then(result => setWithdrawnToday(result))
        )
        .then(
          wallet.methods
            .getLinkBalance()
            .call()
            .then(result => setLinkBalance(result))
        )
        .then(
          wallet.methods
            .getHasPassword()
            .call()
            .then(result => setHasPassword(result))
        );
    }
  }, [walletAddress, withdrawnToday, hydroBalance, linkBalance, hasPassword]);

  useEffect(() => {
    disableScroll.on();
    if (wallet && wallet._address) {
      wallet.once("ChainlinkCallback", (event, error) => {
        setChainlinkCallback(!chainlinkCallback);
        wallet.methods
          .getHydroBalance()
          .call()
          .then(result => setHydroBalance(result));
      });
    }
    return () => {
      disableScroll.off();
    };
  }, [wallet, chainlinkCallback]);

  return !einDetails ? null : einDetails.resolvers.includes(walletAddress) ? (
    <div className={classes.root}>
      <Box
        color="white"
        bgcolor="palevioletred"
        display="flex"
        border={1}
        fontSize={35}
        fontFamily="Monospace"
        borderRadius={16}
        p={{ xs: 2, sm: 3, md: 4 }}
        justifyContent="center"
        flexDirection="column"
        alignItems="center"
      >
        <Box marginBottom={1}>{"Chainlinked HYDRO Wallet"}</Box>
        <Box fontSize={25} marginBottom={1}>
          {walletAddress}
        </Box>
        <Box fontSize={18} display="flex" flexDirection="row" marginBottom={5}>
          <Box marginRight={3}>
            {"EIN: "} {ein}
          </Box>
          <Box marginRight={3}>
            {"Daily limit: "} {toDecimal(dailyLimit, 18)} {" HYDRO"}
          </Box>
          <Box marginRight={3}>
            {"Withdrawn Today: "} {toDecimal(withdrawnToday, 18)} {" HYDRO"}
          </Box>
          <Box marginRight={3}>
            {"Balance: "} {toDecimal(hydroBalance, 18)} {" HYDRO"}
          </Box>
          <Box>
            {"LINK: "} {toDecimal(linkBalance, 18)}
          </Box>
        </Box>
        <Box display="flex" flexDirection="column">
          <TransactionOptions
            wallet={wallet}
            walletAddr={walletAddress}
            dailyLimit={dailyLimit}
            identityInfo={identityInfo}
            ein={ein}
            withdrawnToday={withdrawnToday}
            hasPassword={hasPassword}
          />
        </Box>
      </Box>
    </div>
  ) : (
    <div className={classes.root}>
      <Box
        color="white"
        bgcolor="palevioletred"
        display="flex"
        border={1}
        fontSize={35}
        fontFamily="Monospace"
        borderRadius={12}
        p={{ xs: 2, sm: 3, md: 4 }}
        justifyContent="center"
        flexDirection="column"
        alignItems="center"
      >
        <Box fontSize={28}>
          {"Your current wallet: "} {walletAddress}
        </Box>
        <Box fontSize={24} marginBottom={15}>
          {"Would you like to add it as a resolver?"}
        </Box>
        <Box
          marginBottom={5}
          width="100%"
          flexDirection="row"
          justifyContent="center"
        >
          <TextField
            label="Your HydroID"
            helperText="Input your HydroID"
            onChange={e => setHydroId(e.target.value)}
            fullWidth
            InputProps={{ className: classes.textArea }}
            InputLabelProps={{ className: classes.textArea }}
            FormHelperTextProps={{ className: classes.textArea }}
            style={{ width: "50%" }}
          />
        </Box>
        <Box
          marginBottom={5}
          width="100%"
          flexDirection="row"
          justifyContent="center"
        >
          <TextField
            label="Optional: Set a Password for recovery"
            helperText="Input your wallet password"
            type="password"
            onChange={e => setTempPass(e.target.value)}
            fullWidth
            InputProps={{ className: classes.textArea }}
            InputLabelProps={{ className: classes.textArea }}
            FormHelperTextProps={{ className: classes.textArea }}
            style={{ width: "50%" }}
          />
        </Box>
        <Box marginBottom={10}>
          <TransactionButton
            readyText="Set Resolver"
            method={() =>
              tempPass.length == 0
                ? snowflakeContract.methods.addResolver(
                    walletAddress,
                    true,
                    0,
                    "0x00"
                  )
                : snowflakeContract.methods.addResolver(
                    walletAddress,
                    true,
                    0,
                    web3.utils.soliditySha3(tempPass)
                  )
            }
            onConfirmation={context.forceAccountReRender}
          />
        </Box>
      </Box>
    </div>
  );
};

export default withStyles(styles)(WalletFactory);
