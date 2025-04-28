"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUserStore } from "@/store/user-store";
import { Button } from "./ui/button";

export default function ActiveUsers() {
  const activeUsers = useUserStore((state) => state.activeUsers);

  return (
    <TooltipProvider>
      <div className="flex -space-x-2">
        {activeUsers.map((activeUser, index) => {
          return (
            <Tooltip key={activeUser.id + index}>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  style={{ backgroundColor: activeUser.color }}
                >
                  {activeUser.name?.charAt(0).toUpperCase()}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <span>{activeUser.name}</span>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
