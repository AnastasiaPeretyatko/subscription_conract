import { VStack } from "@chakra-ui/react";
import React, { useEffect } from "react";
import Header from "../header";
import { AppDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { useApiV1 } from "@/utils/api/useApi.v1";
import { setChannel, setMyChannel } from "@/store/slice/channel.slice";
import {
  setAccount,
  setBalance,
  setContract,
  setLoading,
  setSubscription
} from "@/store/slice/contract.slice";
import { setUser } from "@/store/slice/user.slice";

const AppLayout = ({
  children,
  isAuth = false,
}: {
  children: React.ReactNode;
  isAuth?: boolean;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.contract);

  useEffect(() => {
    if (!isLoading) return;
    dispatch(setLoading(false));
    useApiV1().then((e) => {
      dispatch(setContract(e.deployedContract));
      dispatch(setAccount(e.account));
      dispatch(setChannel(e.channels));
      dispatch(setSubscription(e.subscriptions));
      dispatch(setMyChannel(e.channelOwner));
      dispatch(setBalance(e.balance));
    });

    const user = localStorage.getItem("user");

    if (user) {
      dispatch(setUser(JSON.parse(user)));
    }
  });

  return (
    <VStack maxW={"100vw"} maxH={"100vh"} height={"100vh"}>
      {!isAuth && <Header />}
      <VStack width={"100%"} height={"100%"} align={"start"} padding={4}>
        {children}
      </VStack>
    </VStack>
  );
};

export default AppLayout;
