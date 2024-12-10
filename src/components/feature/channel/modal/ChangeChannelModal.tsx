import { AppDispatch, RootState } from "@/store";
import { setLoading } from "@/store/slice/contract.slice";
import { Channel, Type } from "@/types/channels";
import useParseError from "@/utils/parseError";
import parseError from "@/utils/parseError";
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import {
  Button,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

export type CreateChannelModalProps = {
  name: string;
  description: string;
};

const ChangeChannelModal = ({ channel }: { channel: Channel }) => {
  const { account, contract } = useSelector(
    (state: RootState) => state.contract
  );
  // const dispatch = useDispatch<AppDispatch>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const parseError = useParseError();
  const [newType, setNewType] = useState<any | null>({
    channelId: channel.id,
    name: "",
    price: 0,
    period: 0,
  });

  const [types, setTypes] = useState<Type[]>([]);

  const getTypes = async () => {
    await contract
      .getTypesChannel(channel.id, { from: account })
      .then((res: Type[]) => {
        setTypes(
          res.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            period: item.period,
          }))
        );
      })
      .catch(parseError);
  };

  const createNewTypeChannel = async () => {
    contract
      .createSubscriptionType(
        newType.channelId,
        newType.name,
        newType.price,
        newType.period,
        {
          from: account,
        }
      )
      .then(() => {
        setNewType({ channelId: channel.id, name: "", price: 0, period: 0 });
        getTypes();
      })
      .catch(parseError);
  };

  useEffect(() => {
    if (!isOpen) return;
    getTypes();
  }, [isOpen]);

  return (
    <>
      <IconButton
        aria-label=""
        icon={<EditIcon />}
        onClick={onOpen}
        variant={"unstyled"}
        position={"absolute"}
        right={0}
        top={0}
        color={"gray.500"}
      />

      <Modal onClose={onClose} isOpen={isOpen} isCentered size={"xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Информация о канале</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDirection={"column"} gap={4} mb={5}>
            <Heading size={"sm"}>ID: {channel.id}</Heading>
            <Heading size={"sm"}>Название: {channel.name}</Heading>
            <Heading size={"sm"}>
              Описание: {channel.description || "_"}
            </Heading>
            <Heading size={"sm"}>
              Статус: {channel.isActive ? "активен" : "не активен"}
            </Heading>

            <Heading size={"sm"}>Подписки в канале</Heading>
            {!types.length ? (
              <Text color={"gray.500"}>Нет периодов подписок</Text>
            ) : (
              <Table>
                <Thead bg={"blue.100"}>
                  <Tr>
                    <Th>Имя</Th>
                    <Th>Цена</Th>
                    <Th>Период</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {types.map((item) => (
                    <Tr key={item.id}>
                      <Td>{item.name}</Td>
                      <Td>{item.price}</Td>
                      <Td>{item.period/86400}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}

            <Heading size={"xs"}>Добавить подписку</Heading>
            <HStack>
              <Input
                placeholder="name"
                value={newType.name}
                onChange={(e) =>
                  setNewType({ ...newType, name: e.target.value })
                }
              />
              <Input
                placeholder="price"
                value={newType.price}
                onChange={(e) =>
                  setNewType({ ...newType, price: Number(e.target.value) })
                }
              />
              <Input
                placeholder="period in days"
                type="number"
                value={newType.period}
                onChange={(e) =>
                  setNewType({ ...newType, period: Number(e.target.value) })
                }
              />
              <IconButton
                aria-label=""
                icon={<AddIcon />}
                onClick={createNewTypeChannel}
              />
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ChangeChannelModal;
