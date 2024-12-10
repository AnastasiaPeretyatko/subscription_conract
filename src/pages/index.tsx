import AppLayout from "@/components/layout/AppLayout";
import { RootState } from "@/store";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Spinner,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

export default function Home() {
  const router = useRouter();
  const { isLoading } = useSelector((state: RootState) => state.contract);

  useEffect(() => {
    if (isLoading) return;
    const user = localStorage.getItem("user");
    if (user) {
      router.push("/channel");
    }
  }, [isLoading]);

  return (
    <AppLayout isAuth>
      <Flex
        width={"100vw"}
        height={"100vh"}
        align={"center"}
        justify={"center"}
      >
        {isLoading ? (
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        ) : (
          <Container
            centerContent
            my={"auto"}
            borderRadius={"md"}
            padding={8}
            boxShadow={"2xl"}
          >
            <Heading mb={8}>Добро пожаловать!</Heading>
            <Button
              width={"100%"}
              onClick={() => router.push("/auth")}
              variant={"outline"}
              colorScheme={"blue"}
            >
              Продолжить <ArrowForwardIcon />
            </Button>
          </Container>
        )}
      </Flex>
    </AppLayout>
  );
}
