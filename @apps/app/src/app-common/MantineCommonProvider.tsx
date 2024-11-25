import { PropsWithChildren } from "react";
import { Notifications } from "@mantine/notifications";
import '@mantine/notifications/styles.css';
import '@mantine/core/styles.css';

import {
  createTheme,
  DEFAULT_THEME,
  MantineProvider,
} from '@mantine/core';

const theme = createTheme({
  fontFamily: 'Roboto, sans-serif',
  fontFamilyMonospace: 'Monaco, Courier, monospace',
  headings: {
    // Use default theme if you want to provide default Mantine fonts as a fallback
    fontFamily: `Roboto, ${DEFAULT_THEME.fontFamily}`,
  },
});

export const MantineCommonProvider = ({ children }: PropsWithChildren) => {
  return (
    <MantineProvider theme={theme}>
      <Notifications />
      {children}
    </MantineProvider>
  );
};
