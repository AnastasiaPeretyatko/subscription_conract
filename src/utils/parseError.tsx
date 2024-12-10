import { useToast } from "@chakra-ui/react";

const useParseError = () => {
  const toast = useToast();

  const parseError = (error: any) => {
    const regex = /revert[^"]*/g;
    const matches = error.message.match(regex)?.[0]?.replace("revert ", "") || "Unknown error";

    toast({
      title: "Error",
      description: matches,
      status: "error",
      duration: 9000,
      isClosable: true,
    });
  };

  return parseError;
};

export default useParseError;
