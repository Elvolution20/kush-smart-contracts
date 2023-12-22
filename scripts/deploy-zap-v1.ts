import { ethers, network, run } from "hardhat";
import config from "../config";

const main = async () => {
  // Compile contracts
  await run("compile");
  console.log("Compiled contracts.");

  const networkName = network.name;

  // Sanity checks
  if (networkName === "mainnet") {
    if (!process.env.KEY_MAINNET) {
      throw new Error("Missing private key, refer to README 'Deployment' section");
    }
  } else if (networkName === "testnet") {
    if (!process.env.KEY_TESTNET) {
      throw new Error("Missing private key, refer to README 'Deployment' section");
    }
  }

  if (!config.KushRouter[networkName] || config.KushRouter[networkName] === ethers.constants.AddressZero) {
    throw new Error("Missing router address, refer to README 'Deployment' section");
  }

  if (!config.WETH[networkName] || config.WETH[networkName] === ethers.constants.AddressZero) {
    throw new Error("Missing WETH address, refer to README 'Deployment' section");
  }

  console.log("Deploying to network:", networkName);

  // Deploy KushZapV1
  console.log("Deploying KushZap V1..");

  const KushZapV1 = await ethers.getContractFactory("KushZapV1");

  const kushZap = await KushZapV1.deploy(
    config.WETH[networkName],
    config.KushRouter[networkName],
    config.MaxZapReverseRatio[networkName]
  );

  await kushZap.deployed();

  console.log("KushZap V1 deployed to:", kushZap.address);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
