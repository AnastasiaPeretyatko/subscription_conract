import { AppDispatch, RootState } from "@/store";
import {
  changeOneSubscription,
  setLoading,
} from "@/store/slice/contract.slice";
import { Channel } from "@/types/channels";
import useParseError from "@/utils/parseError";
import { CloseIcon } from "@chakra-ui/icons";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Button,
  IconButton,
} from "@chakra-ui/react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

type Props = {
  channel: Channel;
};

export default function CloseSubscriptionAlert({ channel }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef(null);
  const { contract, account } = useSelector(
    (state: RootState) => state.contract
  );
  const dispatch = useDispatch<AppDispatch>();
  const parseError = useParseError();

  const onClick = async () => {
    await contract
      .suspendSubscription(channel.id, { from: account })
      .then(() => {
        dispatch(setLoading(true));
        onClose();
      })
      .catch(parseError);
  };

  return (
    <>
      <IconButton aria-label="" icon={<CloseIcon />} onClick={onOpen} />

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Отменить подписку
            </AlertDialogHeader>

            <AlertDialogBody>
              Вы действительно хотите отменить подписку? Подписка будет
              действовать до конца срока.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Закрыть
              </Button>
              <Button colorScheme="red" onClick={onClick} ml={3}>
                Отменить
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
