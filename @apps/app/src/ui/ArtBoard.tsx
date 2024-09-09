import { PropsWithChildren } from "react";
import styles from "./Arboard.module.scss";
import { Paper, Title } from "@mantine/core";

export function ArtBoard(
  props: PropsWithChildren<{
    theme?: string;
    title?: string;
    subtitle?: string;
    className?: string;
  }>,
) {

  return (
    <Paper
      data-theme={props.theme}
      data-component="artboard"
      className={styles.artboard}
    >
      <header>
      <Title>
          {props.title && <h2 className="card-title">{props.title}</h2>}
        </Title>
        <Title order={4} >
          {props.subtitle && <h3 className="text-left">{props.subtitle}</h3>}
        </Title>
      </header>
      <main>
        <div className="h-full flex flex-col overflow-hidden">
          <div className="h-full flex flex-col overflow-x-scroll">
            {props.children}
          </div>
        </div>
      </main>
    </Paper>
  );
}
