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
} from "@tabler/icons-react";
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
  { icon: IconHome2, label: "Content", slug: "content" },
  { icon: IconTextDecrease, label: "Text Decrease", slug: "text-decrease" },
  { icon: IconTextIncrease, label: "Text Increase", slug: "text-increase" },
  { icon: IconColumns2, label: "Narrower Layout", slug: "layout-decrease" },
  { icon: IconColumns3, label: "Wider Layout", slug: "layout-increase" },
  { icon: IconTransferOut, label: "Extract words", slug: "words" },
  { icon: IconPageBreak, label: "Summarise", slug: "summary" },
  { icon: IconPageBreak, label: "Simplify", slug: "simplify" },
  { icon: IconStar, label: "Favorite", slug: "favorite" },
  { icon: IconCards, label: "Flashcards", slug: "flashcards" },
] as const;

export type StudyToolIconsSlugs = (typeof StudyToolIcons)[number]["slug"];
export type StudyToolContentSlugs = "words" | "summary" | "simplify" | "flashcards" | "content";

export function ToolbarButton({
  icon: Icon,
  label,
  active,
  onClick,
  disabled,
}: NavbarLinkProps) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton
        disabled={disabled}
        onClick={onClick}
        className={styles.link}
        data-active={active || undefined}
      >
        <Icon style={{ width: rem(20), height: rem(20), stroke: "1.5px" }} />
      </UnstyledButton>
    </Tooltip>
  );
}

export function StudyToolbar(props: {
  disabled: boolean;
  selectedLink: StudyToolIconsSlugs;
  onClick: (link: StudyToolIconsSlugs) => void;
}) {
  const links = StudyToolIcons.map((link) => (
    <ToolbarButton
      {...link}
      active={link.slug === props.selectedLink}
      key={link.label}
      disabled={props.disabled}
      onClick={() => {
        props.onClick(link.slug);
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
