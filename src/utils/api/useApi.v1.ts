import Web3 from "web3";
import MyContractJSON from "../../../build/contracts/MyContract.json";
import { useToast } from "@chakra-ui/react";

const contract = require("@truffle/contract");

const parseError = (error: any) => {
  const toast = useToast();
  const regex = /revert[^"]*/g;
  const matches = error.message.match(regex)[0].replace("revert ", "");
  toast({
    title: "Error",
    description: matches,
    status: "error",
    duration: 9000,
    isClosable: true,
  });
};

export const useApiV1 = async () => {
  try {
    const web3 = await loadWeb3();
    const { account, balance } = await loadAccounts(web3);
    const {
      deployedContract,
      channels,
      subscriptions,
      channelOwner,
    } = await loadContract(web3, account);

    return {
      account,
      deployedContract,
      channels,
      subscriptions,
      channelOwner,
      balance
    };
  } catch (error) {
    throw error
  }
};

export const loadWeb3 = async () => {
  if (typeof window !== "undefined" && window.ethereum) {
    const web3 = new Web3(window.ethereum);

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      return web3;
    } catch (error) {
      throw new Error("User denied account access");
    }
  } else if (window.web3) {
    const web3 = new Web3(window.web3.currentProvider);
    return web3;
  } else {
    throw new Error("Ethereum provider not found");

  }
};

const loadAccounts = async (web3: Web3) => {
  try {
    const accounts = await web3.eth.getAccounts();
    const balanceInWei = await web3.eth.getBalance(accounts[0]); // Баланс в Wei
    const balanceInEther = web3.utils.fromWei(balanceInWei, 'ether');
    if (accounts.length === 0) {
      parseError("No Ethereum accounts available.");
    }
    return {account:accounts[0], balance: (+balanceInEther).toFixed(2)}; // Возвращаем первый аккаунт
  } catch (error) {
    throw error
  }
};

const loadContract = async (web3: Web3, addressAccount: string) => {
  try {
    const theContract = contract(MyContractJSON);
    theContract.setProvider(web3.currentProvider);

    const deployedContract = await theContract.deployed();

    const { channelOwner, channels } = await loadChannels(
      deployedContract,
      addressAccount
    );

    const subscriptions = await loadSubscriptions(
      deployedContract,
      addressAccount
    );

    return {
      deployedContract,
      channels,
      subscriptions,
      channelOwner
    };
  } catch (error) {
    throw error
  }
};

const loadChannels = async (contract: any, addressAccount: string) => {
  try {
    const nextChannelId = await contract.nextChannelId();
    const count = nextChannelId.toNumber();
    const channels = [];

    for (let i = 0; i < count; i++) {
      const channel = await contract.channels(i);
      channels.push(channel);
    }

    const channelOwner = await contract.getChannelsOwner({
      from: addressAccount,
    });    
    return { channels, channelOwner };
  } catch (error) {
    throw error
  }
};

const loadSubscriptions = async (contract: any, addressAccount: string) => {
  try {
    // Вызов функции `getSubscriptions` из контракта
    const subscriptions = await contract.getSubscriptions({
      from: addressAccount, // Указываем текущий аккаунт
    });
    // Преобразование данных подписок в удобный для работы формат
    const formattedSubscriptions = subscriptions.map((sub: any) => ({
      id: +sub[4],
      subscriberId: sub?.subscriber,
      channelId: +sub?.channelId,
      startDate: new Date(sub?.startDate * 1000),
      endDate: new Date(sub?.endDate * 1000),
      subscriptionType: sub?.subscriptionType,
      isActive: sub?.isActive,
    }));

    return formattedSubscriptions;
  } catch (error) {
    throw error
  }
};


