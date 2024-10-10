import { Stack } from "@mantine/core";
import styles from "./StudyToolBar.module.css";
import {
  TablerIconsProps,
  IconCards,
  IconPageBreak,
  IconTransferOut,
  IconHome2,
  IconPuzzle
} from "@tabler/icons-react";
import { FC } from "react";
import { classNames } from "@espoojs/utils";
import { ContentActionButton } from "./ContentActionButton";

export interface NavbarLinkProps {
  icon: FC<TablerIconsProps>;
  disabled?: boolean;
  label: string;
  active?: boolean;
  onClick?(): void;
}

const Icons = [
  { icon: IconHome2, label: "Content", slug: "content" },
  { icon: IconTransferOut, label: "Extract words", slug: "words" },
  { icon: IconPageBreak, label: "Summarise", slug: "summary" },
  { icon: IconPageBreak, label: "Simplify", slug: "simplify" },
  { icon: IconCards, label: "Flashcards", slug: "flashcards" },
  { icon: IconPuzzle, label: "Crosswords", slug: "corsswords" },
] as const;

export type ContentStudyActionsIconsSlugsType = (typeof Icons)[number]["slug"];
export const ContentStudyActionsIconsSlugs = Icons.map((icon) => icon.slug);

export function ContentStudyActionsBar(props: {
  disabled: boolean;
  selectedLink: ContentStudyActionsIconsSlugsType;
  onClick: (link: ContentStudyActionsIconsSlugsType) => void;
  className?: string;
}) {
  const links = Icons.map((link) => (
    <ContentActionButton
      {...link}
      active={link.slug === props.selectedLink}
      key={link.label}
      disabled={props.disabled}
      size={30}
      onClick={() => {
        props.onClick(link.slug);
      }}
    />
  ));
   
  return (
    <nav className={classNames(styles.actionsBar)}>
      <div>
        <Stack className={props.className} justify="center" gap={10}>
          {links}
        </Stack>
      </div>
    </nav>
  );
}
