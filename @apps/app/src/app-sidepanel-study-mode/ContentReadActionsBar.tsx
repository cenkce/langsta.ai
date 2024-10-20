import { Stack } from "@mantine/core";
import styles from "./StudyToolBar.module.css";
import {
  IconTextDecrease,
  IconTextIncrease,
  IconColumns2,
  TablerIconsProps,
  IconStar,
  IconReload,
} from "@tabler/icons-react";
import { IconColumns3 } from "@tabler/icons-react";
import { FC } from "react";
import { ContentActionButton } from "./ContentActionButton";

export interface NavbarLinkProps {
  icon: FC<TablerIconsProps>;
  disabled?: boolean;
  label: string;
  active?: boolean;
  onClick?(): void;
  size?: number;
  tooltipPosition?: "left" | "right" | "top" | "bottom";
}

const StudyToolIcons = [
  { icon: IconTextDecrease, label: "Text Decrease", slug: "text-decrease" },
  { icon: IconTextIncrease, label: "Text Increase", slug: "text-increase" },
  { icon: IconColumns2, label: "Narrower Layout", slug: "layout-decrease" },
  { icon: IconColumns3, label: "Wider Layout", slug: "layout-increase" },
  { icon: IconStar, label: "Favorite", slug: "favorite" },
  { icon: IconReload, label: "Reload Content", slug: "reset" },
] as const;

export type ContentReadActionsSlugsType = (typeof StudyToolIcons)[number]["slug"];
export const ContentReadActionsSlugs = StudyToolIcons.map((icon) => icon.slug);

export function ContentReadActionsBar(props: {
  disabled: boolean;
  selectedLink?: ContentReadActionsSlugsType;
  onClick: (link: ContentReadActionsSlugsType) => void;
  className?: string;
  size?: number;
  loading?: boolean;
}) {
  const links = StudyToolIcons.map((link) => (
    <ContentActionButton
      {...link}
      // active={link.slug === props.selectedLink}
      key={link.label}
      disabled={props.disabled || (link.slug === 'reset' && props.loading)}
      size={props.size}
      tooltipPosition="bottom"
      onClick={() => {
        props.onClick(link.slug);
      }}
    />
  ));
   
  return (
    <nav className={styles.actionsBar}>
      <div>
        <Stack className={props.className} justify="center"  gap={10}>
          {links}
        </Stack>
      </div>
    </nav>
  );
}
