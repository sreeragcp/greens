import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/parent/register")({
  beforeLoad: () => {
    throw redirect({ to: "/parent" });
  },
});
