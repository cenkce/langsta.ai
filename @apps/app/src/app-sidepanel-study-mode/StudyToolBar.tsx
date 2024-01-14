import { Stack, Tooltip, UnstyledButton, rem } from "@mantine/core";
import { Icon } from "react-feather";
import styles from "./StudyToolBar.module.css";
import { useState } from "react";
import {
  IconTextDecrease,
  IconTextIncrease,
  IconTransferOut,
  IconPageBreak,
  IconStar,
  IconCards,
  IconColumns2,
} from '@tabler/icons-react';
import { IconColumns3 } from "@tabler/icons-react";

interface NavbarLinkProps {
  icon: Icon;
  label: string;
  active?: boolean;
  onClick?(): void;
}

const mockdata = [
  { icon: IconTextDecrease, label: 'Text Decrease' },
  { icon: IconTextIncrease, label: 'Text Increase' },
  { icon: IconColumns2, label: 'Narrower Layout' },
  { icon: IconColumns3, label: 'Wider Layout' },
  { icon: IconTransferOut, label: 'Extract words' },
  { icon: IconPageBreak, label: 'Summarise' },
  { icon: IconStar, label: 'Favorite' },
  { icon: IconCards, label: 'Flashcards' },
];

export function ToolbarButton({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton onClick={onClick} className={styles.link} data-active={active || undefined}>
        <Icon style={{ width: rem(20), height: rem(20), stroke: "1.5px" }} />
      </UnstyledButton>
    </Tooltip>
  );
}


export function StudyToolbar() {
  const [active, setActive] = useState(2);

  const links = mockdata.map((link, index) => (
    <ToolbarButton
      {...link}
      key={link.label}
      active={index === active}
      onClick={() => setActive(index)}
    />
  ));

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarMain}>
        <Stack justify="center" gap={0}>
          {links}
        </Stack>
      </div>
    </nav>
  );
}
