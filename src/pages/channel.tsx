import CardChannel from "@/components/feature/channel/CardChannel";
import CreateChannelModal from "@/components/feature/channel/modal/CreateChannelModal";
import AppLayout from "@/components/layout/AppLayout";
import { AppDispatch, RootState } from "@/store";
import { changeSubChannel } from "@/store/slice/channel.slice";
import { Heading, HStack, SimpleGrid, Text, Wrap } from "@chakra-ui/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const ChannelsPage = () => {
  const { subscriptions } = useSelector((state: RootState) => state.contract);
  const { channel } = useSelector((state: RootState) => state.channel);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    for (let i = 0; i < subscriptions.length; i++) {
      const subscription = subscriptions[i];
      dispatch(changeSubChannel({ id: subscription.channelId }));
    }
  }, [subscriptions]);

  return (
    <AppLayout>
      <HStack width={"100%"} justify={"space-between"} mb={8}>
        <Heading>Каналы</Heading>
        <CreateChannelModal />
      </HStack>
      {!channel.length ? (
        <Text color={"gray.500"}>У вас нет каналов</Text>
      ) : (
        <Wrap width={"100%"}>
          {channel.map((channel) => (
            <CardChannel channel={channel} key={channel.id} />
          ))}
        </Wrap>
      )}
    </AppLayout>
  );
};

export default ChannelsPage;
