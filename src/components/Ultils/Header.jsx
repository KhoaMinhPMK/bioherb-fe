import { Box, Flex, Text, Button } from "@chakra-ui/react";

const Header = () => {
    return (
        <Box bg="teal.500" color="white" p={4}>
            <Flex justify="space-between" align="center">
                <Text fontSize="xl" fontWeight="bold">
                    MyApp
                </Text>
                <Button colorScheme="teal">Login</Button>
            </Flex>
        </Box>
    );
};

export default Header;