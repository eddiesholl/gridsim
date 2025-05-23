import { Box, ScrollArea, ScrollAreaProps } from "@mantine/core";

export const PageWrapper = ({ children, ...rest }: ScrollAreaProps) => (
  <ScrollArea h="100%" type="scroll" {...rest}>
    <Box w="100%" p="md" pt={0}>
      {children}
    </Box>
  </ScrollArea>
);
