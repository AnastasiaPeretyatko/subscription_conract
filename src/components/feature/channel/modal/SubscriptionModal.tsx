import { AppDispatch, RootState } from "@/store";
import { setLoading } from "@/store/slice/contract.slice";
import { Type } from "@/types/channels";
import { loadWeb3 } from "@/utils/api/useApi.v1";
import useParseError from "@/utils/parseError";
import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  Card,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

export type CreateChannelModalProps = {
  name: string;
};

type Props = {
  channel: any;
};

const SubscriptionModal = ({ channel }: Props) => {
  const { contract, account } = useSelector(
    (state: RootState) => state.contract
  );
  const dispatch = useDispatch<AppDispatch>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [period, setPeriod] = useState<any>(null);
  const [types, setTypes] = useState<Type[]>([]);

  const { handleSubmit } = useForm<CreateChannelModalProps>();
  const parseError = useParseError();

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

  const onSubmit: SubmitHandler<CreateChannelModalProps> = async () => {
    const newType = types.find((item) => item.id === period);
    if (!period || !newType) return;
    const web3 = await loadWeb3()
    contract
      .createSubscription(newType.id, channel.id, {
        from: account,
        value: web3.utils.toWei(newType.price.toString(), "ether"),
      })
      .then(() => {
        dispatch(setLoading(true));
        onClose();
      })
      .catch(parseError);
  };

  useEffect(() => {
    if (!isOpen) return;
    getTypes();
  }, [isOpen]);

  return (
    <>
      <Button
        variant={"solid"}
        colorScheme={"gray"}
        onClick={onOpen}
        leftIcon={<AddIcon />}
      >
        Подписаться
      </Button>

      <Modal onClose={onClose} isOpen={isOpen} isCentered size={"xl"}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>Подписка</ModalHeader>
            <ModalCloseButton />
            <ModalBody display={"flex"} flexDirection={"column"} gap={4}>
              <Text>
                На какой период времени вы хотите получать новости от канала{" "}
                {channel.name}?
              </Text>
              {!types.length ? (
                <Text color={"gray.500"}>
                  Вы пока не можете подписаться на канал, дождитесь когда автор
                  создаст варианты подписок.
                </Text>
              ) : (
                <RadioGroup onChange={setPeriod}>
                  {types.map((item) => (
                    <Card
                      key={item.id}
                      padding={4}
                      bg={"blackAlpha.50"}
                      boxShadow={"lg"}
                      width={"300px"}
                    >
                      <HStack width={"100%"} justify={"space-between"}>
                        <Text fontSize={"xl"}>{item.name}</Text>
                        <Radio value={String(item.id)} />
                      </HStack>
                      <Text>Период: {item.period / 86400} days</Text>
                      <Text>Стоимость: {item.price}</Text>
                    </Card>
                  ))}
                </RadioGroup>
              )}
            </ModalBody>
            <ModalFooter gap={4}>
              <Button variant={"ghost"} colorScheme="gray" onClick={onClose}>
                Закрыть
              </Button>
              <Button
                variant={"solid"}
                colorScheme="blue"
                type="submit"
                isDisabled={!types.length}
              >
                Сохранить
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SubscriptionModal;
