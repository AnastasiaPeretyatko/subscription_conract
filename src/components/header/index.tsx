import { AppDispatch, RootState } from "@/store";
import { logout } from "@/store/slice/user.slice";
import {
  Avatar,
  Button,
  HStack,
  IconButton,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoIosLogOut } from "react-icons/io";

const Header = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const { balance } = useSelector((state: RootState) => state.contract);

  const router = useRouter();

  const LogOut = () => {
    router.push("/auth");
    dispatch(logout());
  };

  return (
    <HStack
      width={"100%"}
      padding={4}
      justify={"end"}
      boxShadow={"md"}
      gap={4}
      justifyContent={"space-between"}
    >
      <HStack gap={8}>
        <Link href="/my-channel">Мои каналы</Link>
        <Link href="/channel">Все каналы</Link>
      </HStack>
      <HStack>
        <Avatar name={user?.name} />
        <VStack align={"start"} gap={0}>
          <Text fontSize={"md"}>{user?.name}</Text>
          <Text fontSize={"sm"} color={"gray.500"}>
            {user?.email}
          </Text>
        </VStack>
        <Text>Count: {balance || 0}</Text>
        <IconButton
          size={"md"}
          aria-label=""
          variant={"unstyled"}
          icon={<IoIosLogOut />}
          onClick={LogOut}
        />
      </HStack>
    </HStack>
  );
};

export default Header;
