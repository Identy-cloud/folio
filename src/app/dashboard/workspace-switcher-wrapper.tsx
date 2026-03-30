"use client";

import { WorkspaceSwitcher } from "./workspace-switcher";
import { useWorkspace } from "./workspace-context";

export function WorkspaceSwitcherWrapper() {
  const { activeWorkspaceId, setActiveWorkspaceId } = useWorkspace();

  return (
    <WorkspaceSwitcher
      activeId={activeWorkspaceId}
      onSelect={setActiveWorkspaceId}
    />
  );
}
