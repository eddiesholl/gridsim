import { UnstyledButton, UnstyledButtonProps } from "@mantine/core";
import {
  createLink,
  LinkComponent,
  useRouterState,
} from "@tanstack/react-router";
import clsx from "clsx";
import * as React from "react";
import classes from "./styles.module.css";

type MantineAnchorProps = Omit<UnstyledButtonProps, "href">;

const MantineLinkComponent = React.forwardRef<
  HTMLButtonElement,
  MantineAnchorProps & { "data-status"?: "active" | "inactive" }
>((props, ref) => {
  return (
    <UnstyledButton
      ref={ref}
      {...props}
      className={clsx(classes.control, props.className)}
    />
  );
});

const CreatedLinkComponent = createLink(MantineLinkComponent);

export const MTLink: LinkComponent<typeof MantineLinkComponent> = (props) => {
  const routerState = useRouterState();
  const isActive =
    routerState.location.pathname === props.to ||
    (typeof props.to === "string" &&
      routerState.location.pathname.startsWith(props.to) &&
      props.to !== "/"); // Special case for root path

  return (
    <CreatedLinkComponent
      preload="intent"
      {...props}
      data-status={isActive ? "active" : "inactive"}
    />
  );
};
