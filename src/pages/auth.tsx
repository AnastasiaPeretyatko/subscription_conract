import {
  Flex,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import Auth from "@/components/feature/auth/Auth";
import Registration from "@/components/feature/auth/Registration";
import AppLayout from "@/components/layout/AppLayout";

const Authrization = () => {
  return (
    <AppLayout isAuth>
      <Flex
        align={"center"}
        justify={"center"}
        width={"100%"}
        height={"100%"}
      >
        <Tabs
          position="relative"
          variant="unstyled"
          my={"auto"}
          borderRadius={"md"}
          padding={4}
          boxShadow={"2xl"}
          width={"500px"}
        >
          <TabList>
            <Tab>Вход</Tab>
            <Tab>Регистрация</Tab>
          </TabList>
          <TabIndicator
            mt="-1.5px"
            height="2px"
            bg="blue.500"
            borderRadius="1px"
          />
          <TabPanels>
            <TabPanel>
              <Auth />
            </TabPanel>
            <TabPanel>
              <Registration />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </AppLayout>
  );
};

export default Authrization;
