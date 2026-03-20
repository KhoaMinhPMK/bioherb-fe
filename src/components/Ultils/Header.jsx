import { Box, Flex, Text } from "@chakra-ui/react";

const headerItems = [
    {
        label: "Trang chủ",
        url: "/",
    },
    {
        label: "Sản phẩm",
        url: "/products",
    },
    {
        label: "Về chúng tôi",
        url: "/about",
    },
    {
        label: "Liên hệ",
        url: "/contact",
    },
];

const Header = () => {
    return (
        <Box bg="teal.700" color="white" p={4}>
            <Flex justify="space-between" align="center">
                <Text fontSize="md" fontWeight="bold">
                    Bioherb.vn
                </Text>
                <Flex gap={6}>
                    {headerItems.map((item) => (
                        <Text
                            key={item.url}
                            mx={2}
                            cursor="pointer"
                            _hover={{ textDecoration: "underline" }}
                        >
                            {item.label}
                        </Text>
                    ))}
                </Flex>
            </Flex>
        </Box>
    );
};

export default Header;