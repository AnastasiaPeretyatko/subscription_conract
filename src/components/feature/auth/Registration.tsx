import { AppDispatch, RootState } from "@/store";
import { setUser } from "@/store/slice/user.slice";
import useParseError from "@/utils/parseError";
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

export type Inputs = {
  name: string;
  email: string;
};

const Registration = () => {
  const { register, handleSubmit } = useForm<Inputs>();
  const { contract, account } = useSelector(
    (state: RootState) => state.contract
  );
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const parseError = useParseError();

  const onSubmit: SubmitHandler<Inputs> = async ({ name, email }) => {
    contract
      .createAccount(name, email, { from: account })
      .then((res: any) => {
        const { user, name, email } = res.logs[0].args;
        dispatch(setUser({ user, name, email }));
        router.push("/channel");
      })
      .catch(parseError);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Heading my={4}>Регистрация</Heading>
      <VStack width={"100%"} gap={4}>
        <FormControl>
          <FormLabel>Name</FormLabel>
          <Input type="text" {...register("name")} />
          <FormHelperText>We&apos;ll never share your email.</FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input type="text" {...register("email")} />
          <FormHelperText>We&apos;ll never share your password.</FormHelperText>
        </FormControl>
        <Button width={"100%"} type="submit">
          Зарегистрироваться
        </Button>
      </VStack>
    </form>
  );
};

export default Registration;
