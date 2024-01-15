import { Stack, Tooltip, UnstyledButton, rem } from "@mantine/core";
import { Icon } from "react-feather";
import styles from "./StudyToolBar.module.css";
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

const StudyTools = [
  { icon: IconTextDecrease, label: 'Text Decrease' },
  { icon: IconTextIncrease, label: 'Text Increase' },
  { icon: IconColumns2, label: 'Narrower Layout' },
  { icon: IconColumns3, label: 'Wider Layout' },
  { icon: IconTransferOut, label: 'Extract words' },
  { icon: IconPageBreak, label: 'Summarise' },
  { icon: IconPageBreak, label: 'Simplify' },
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


export function StudyToolbar(props: {onClick: (link: string) => void }) {
  const links = StudyTools.map((link) => (
    <ToolbarButton
      {...link}
      key={link.label}
      onClick={() => {
        props.onClick(link.label);
      }}
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
