import Link from "next/link";
import { ReactNode } from "react";

// define the Props
export type CrumbItem = {
  label?: ReactNode; // e.g., Python
  path?: string; // e.g., /development/programming-languages/python
};

export type BreadcrumbsProps = {
  items: CrumbItem[];
};

const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  const crumbs = items.filter((crumb) => Object.keys(crumb).length > 0);
  return (
    <div className="flex gap-2 items-start mt-10">
      {crumbs.map((crumb, i) => {
        const isLastItem = i === crumbs.length - 1;
        if (!isLastItem) {
          return (
            <>
              <Link
                href={crumb.path ?? '/'}
                key={i}
                className="text-[#759691] hover:underline"
              >
                {crumb.label}
              </Link>
              {/* separator */}
              <span className="text-[#759691] text-3xl m-0 leading-none"> &#8227; </span>
            </>
          );
        } else {
          return crumb.label;
        }
      })}
    </div>
  );
};
export default Breadcrumbs;
