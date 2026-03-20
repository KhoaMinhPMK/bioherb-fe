import { Box, Flex } from "@chakra-ui/react";
import Header from "../../components/Ultils/Header";
// import Sidebar from "./Sidebar";
// import Footer from "./Footer";

const MainLayout = ({ children }) => {
    return (
        <Box minHeight="100vh">
            <Header />
            <Flex>
                {/* <Sidebar /> */}
                <Box flex="1" p={4}>
                    {children}
                </Box>
            </Flex>
            {/* <Footer /> */}
        </Box>
    );
};

export default MainLayout;