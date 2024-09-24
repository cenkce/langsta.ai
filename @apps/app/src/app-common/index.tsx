import { createTheme, MantineProvider } from "@mantine/core";
import { PropsWithChildren } from "react";
import { Notifications } from "@mantine/notifications";
import '@mantine/notifications/styles.css';

const theme = createTheme({
  /** Put your mantine theme override here */
});

export const MantineCommonProvider = ({ children }: PropsWithChildren) => {
  return (
    <MantineProvider theme={theme}>
      <Notifications />
      {children}
    </MantineProvider>
  );
};
