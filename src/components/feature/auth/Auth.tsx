import { SubmitHandler, useForm } from "react-hook-form";
import { Inputs } from "./Registration";
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input, VStack
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { setUser } from "@/store/slice/user.slice";
import { useRouter } from "next/router";
import useParseError from "@/utils/parseError";

const Auth = () => {
  const { contract, account } = useSelector((state: RootState) => state.contract);
  const { register, handleSubmit } = useForm<Inputs>();
  const dispatch = useDispatch<AppDispatch>();
  const parseError = useParseError();
  const router = useRouter();

  const onSubmit: SubmitHandler<Inputs> = async ({ name, email }) => {
    if(contract){
        contract
      .signIn(name, email, {from: account})
      .then((res: any) => {
        const { user, name, email } = res;
        dispatch(setUser({ user, name, email }));
        router.push("/channel");
      })
      .catch((err: any) => parseError(err));
    }else{
      parseError("Web3 or contract not initialized");
    }
  
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Heading my={4}>Вход</Heading>
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
          Войти
        </Button>
      </VStack>
    </form>
  );
};

export default Auth;
