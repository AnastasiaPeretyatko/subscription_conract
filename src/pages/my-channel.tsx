import CardChannel from "@/components/feature/channel/CardChannel";
import CreateChannelModal from "@/components/feature/channel/modal/CreateChannelModal";
import AppLayout from "@/components/layout/AppLayout";
import { RootState } from "@/store";
import { Heading, HStack, Text, Wrap } from "@chakra-ui/react";
import { useSelector } from "react-redux";

const MyChannelPage = () => {
  const { myChannel } = useSelector((state: RootState) => state.channel);

  return (
    <AppLayout>
      <HStack width={"100%"} justify={"space-between"} mb={8}>
        <Heading>Мои каналы</Heading>
        <CreateChannelModal />
      </HStack>

      {!myChannel.length ? (
        <Text color={"gray.500"}>У вас нет каналов</Text>
      ) : (
        <Wrap width={"100%"}>
          {myChannel.map((channel) => (
            <CardChannel channel={channel} key={channel.id} />
          ))}
        </Wrap>
      )}
    </AppLayout>
  );
};

export default MyChannelPage;
