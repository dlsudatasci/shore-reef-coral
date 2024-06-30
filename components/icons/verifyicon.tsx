import { BadgeCheckIcon } from "@heroicons/react/solid";
import cn from "classnames";

export function VerifyIcon({ variant = "primary" }) {
    return (
        <BadgeCheckIcon className={cn("w-6 h-6 ml-1", {
            "text-primary": variant === "primary",
            "text-secondary": variant === "secondary",
            "text-t-highlight": variant === "t-highlight",
        })} />
    );
}