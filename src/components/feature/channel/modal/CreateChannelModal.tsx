import { AppDispatch, RootState } from "@/store";
import { setLoading } from "@/store/slice/contract.slice";
import useParseError from "@/utils/parseError";
import parseError from "@/utils/parseError";
import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

export type CreateChannelModalProps = {
  name: string;
  description: string;
};

const CreateChannelModal = () => {
  const { account, contract } = useSelector(
    (state: RootState) => state.contract
  );
  const dispatch = useDispatch<AppDispatch>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { register, handleSubmit } = useForm<CreateChannelModalProps>();
  const parseError = useParseError();


  const onSubmit: SubmitHandler<CreateChannelModalProps> = async (data) => {
    contract
      ?.createChannel(data.name, data.description, {
        from: account,
      })
      .then(() => {
        dispatch(setLoading(true));
        onClose();
      })
      .catch((err: any) => parseError(err));
  };

  return (
    <>
      <Button
        variant={"solid"}
        colorScheme={"blue"}
        onClick={onOpen}
        leftIcon={<AddIcon />}
      >
        Создать канал
      </Button>

      <Modal onClose={onClose} isOpen={isOpen} isCentered size={"xl"}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>Создать новый канал</ModalHeader>
            <ModalCloseButton />
            <ModalBody display={"flex"} flexDirection={"column"} gap={4}>
              <FormControl>
                <FormLabel color={"gray.500"}>Name</FormLabel>
                <Input variant={"filled"} {...register("name")} />
              </FormControl>
              <FormControl>
                <FormLabel color={"gray.500"}>Description</FormLabel>
                <Textarea variant={"filled"} {...register("description")} />
              </FormControl>
            </ModalBody>
            <ModalFooter gap={4}>
              <Button variant={"ghost"} colorScheme="gray" onClick={onClose}>
                Close
              </Button>
              <Button variant={"solid"} colorScheme="blue" type="submit">
                Save
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateChannelModal;
