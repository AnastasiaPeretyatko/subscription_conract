import {
  Avatar,
  Box,
  Card,
  Heading,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import randomColor from "randomcolor";
import SubscriptionModal from "./modal/SubscriptionModal";
import { Channel, Type } from "@/types/channels";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import CloseSubscriptionAlert from "./modal/CloseSubscriptionAlert";
import moment from "moment";
import { CheckIcon, SmallCloseIcon } from "@chakra-ui/icons";
import ChangeChannelModal from "./modal/ChangeChannelModal";
import { useState } from "react";
import useParseError from "@/utils/parseError";

type Props = {
  channel: Channel;
};

const CardChannel = ({ channel }: Props) => {
  const color = randomColor();
  const { contract, account, subscriptions, typeArray } = useSelector(
    (state: RootState) => state.contract
  );
  const [types, setTypes] = useState<Type[]>([]);
  const parseError = useParseError();


  const subscription = subscriptions.find(
    (subscription) => subscription.channelId === channel.id
  );

  return (
    <Card bg={color} position={"relative"} width={"300px"} height={"360px"}>
      {channel.owner === account && <ChangeChannelModal channel={channel} />}

      <Box position={"absolute"} bottom={0} width={"100%"} bg={"white"} p={4}>
        <HStack
          position={"absolute"}
          top={"-10%"}
          left={"40%"}
          justify={"center"}
          align={"center"}
        >
          <Avatar size={"lg"} name={channel.name} />
        </HStack>
        <VStack>
          <Heading mt={8} size={"md"} color={color}>
            {channel.name}
          </Heading>
          <Text size={"sm"} color={"gray.500"}>
            {channel.description}
          </Text>

          {channel.owner === account ? (
            <Box
              color={"gray.500"}
              border="2px solid"
              borderColor={"gray.300"}
              padding={2}
              borderRadius={"md"}
            >
              Владелец
            </Box>
          ) : channel.isSub ? (
            <VStack width={"100%"}>
              {subscription && (
                <VStack width={"100%"} align={"start"} fontSize={"sm"}>
                  <Text>
                    Активна:{" "}
                    {subscription.isActive ? (
                      <CheckIcon color={"green.500"} />
                    ) : (
                      <SmallCloseIcon color={"red.500"} />
                    )}
                  </Text>
                  <Text>
                    Дата начала:{" "}
                    {moment(subscription.startDate).format("DD.MM.YYYY")}
                  </Text>
                  <Text>
                    Дата окончания:{" "}
                    {moment(subscription.endDate).format("DD.MM.YYYY")}
                  </Text>
                </VStack>
              )}
              <HStack width={"100%"}>
                <Box
                  color={"gray.500"}
                  border="2px solid"
                  borderColor={"gray.300"}
                  padding={2}
                  borderRadius={"md"}
                  textAlign={"center"}
                  flex={1}
                >
                  Вы подписаны
                </Box>

                <CloseSubscriptionAlert channel={channel} />
              </HStack>
            </VStack>
          ) : (
            <SubscriptionModal channel={channel} />
          )}
        </VStack>
      </Box>
    </Card>
  );
};

export default CardChannel;
