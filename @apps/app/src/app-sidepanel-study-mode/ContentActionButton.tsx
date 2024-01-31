import { Tooltip, UnstyledButton, rem } from "@mantine/core";
import styles from "./StudyToolBar.module.css";
import { NavbarLinkProps } from "./ContentReadActionsBar";


export function ContentActionButton({
  icon: Icon, label, active, onClick, disabled, size=20, tooltipPosition="right"
}: NavbarLinkProps) {
  return (
    <Tooltip label={label} position={tooltipPosition} transitionProps={{ duration: 0 }}>
      <UnstyledButton
        disabled={disabled}
        onClick={onClick}
        className={styles.link}
        data-active={active || undefined}
      >
        <Icon style={{ width: rem(size), height: rem(size), stroke: "1.5px" }} />
      </UnstyledButton>
    </Tooltip>
  );
}
