import { UnstyledButton, UnstyledButtonProps } from "@mantine/core";
import { createLink, LinkComponent } from "@tanstack/react-router";
import * as React from "react";
import classes from "./styles.module.css";

type MantineAnchorProps = Omit<UnstyledButtonProps, "href">;

const MantineLinkComponent = React.forwardRef<
  HTMLButtonElement,
  MantineAnchorProps
>((props, ref) => {
  return <UnstyledButton ref={ref} {...props} className={classes.control} />;
});

const CreatedLinkComponent = createLink(MantineLinkComponent);

export const MTLink: LinkComponent<typeof MantineLinkComponent> = (props) => {
  return <CreatedLinkComponent preload="intent" {...props} />;
};
