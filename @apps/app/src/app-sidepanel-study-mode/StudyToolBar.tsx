import { Stack, Tooltip, UnstyledButton, rem } from "@mantine/core";
import styles from "./StudyToolBar.module.css";
import {
  IconTextDecrease,
  IconTextIncrease,
  IconTransferOut,
  IconPageBreak,
  IconStar,
  IconCards,
  IconColumns2,
  IconHome2,
  TablerIconsProps,
} from '@tabler/icons-react';
import { IconColumns3 } from "@tabler/icons-react";
import { FC } from "react";

interface NavbarLinkProps {
  icon: FC<TablerIconsProps>;
  disabled?: boolean;
  label: string;
  active?: boolean;
  onClick?(): void;
}


const StudyToolIcons = [
  { icon: IconHome2, label: 'Content' },
  { icon: IconTextDecrease, label: 'Text Decrease' },
  { icon: IconTextIncrease, label: 'Text Increase' },
  { icon: IconColumns2, label: 'Narrower Layout' },
  { icon: IconColumns3, label: 'Wider Layout' },
  { icon: IconTransferOut, label: 'Extract words' },
  { icon: IconPageBreak, label: 'Summarise' },
  { icon: IconPageBreak, label: 'Simplify' },
  { icon: IconStar, label: 'Favorite' },
  { icon: IconCards, label: 'Flashcards' },
] as const;

type StudyToolIconsTexts = typeof StudyToolIcons[number]['label'];
// type StudyToolIcon =  { icon: FC<TablerIconsProps>, label: StudyToolIconsTexts };


export function ToolbarButton({ icon: Icon, label, active, onClick, disabled }: NavbarLinkProps) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton disabled={disabled} onClick={onClick} className={styles.link} data-active={active || undefined}>
        <Icon style={{ width: rem(20), height: rem(20), stroke: "1.5px" }} />
      </UnstyledButton>
    </Tooltip>
  );
}


export function StudyToolbar(props: {disabled: boolean; selectedLink: StudyToolIconsTexts; onClick: (link: StudyToolIconsTexts) => void }) {
  const links = StudyToolIcons.map((link) => (
    <ToolbarButton
      {...link}
      active={link.label === props.selectedLink}
      key={link.label}
      disabled={props.disabled}
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
