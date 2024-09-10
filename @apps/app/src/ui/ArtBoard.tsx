import { PropsWithChildren, ReactElement } from "react";
import styles from "./Arboard.module.scss";
import { Paper, Title } from "@mantine/core";

export function ArtBoard(
  props: PropsWithChildren<{
    title?: string;
    subtitle?: string;
    className?: string;
    hero?: ReactElement;
  }>,
) {
  return (
    <Paper data-component="artboard" className={styles.artboard}>
      <header className={styles.hero}>
        <Title order={3}>{props.title && props.title}</Title>
        <Title order={4}>{props.subtitle && props.subtitle}</Title>
      </header>
      {props.hero ? <section>{props.hero}</section> : null}
      <main>
        <div className="">
          <div className="">{props.children}</div>
        </div>
      </main>
    </Paper>
  );
}
