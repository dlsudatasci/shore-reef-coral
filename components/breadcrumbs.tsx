import Link from "next/link";
import { ReactNode } from "react";

// Define the Props
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
            <span key={i} className="flex items-center h-5">
              <span className="flex items-center">
                <Link href={crumb.path ?? '/'} className="text-[#759691] hover:underline">
                  {crumb.label}
                </Link>
              </span>
              <span className="text-[#759691] text-3xl ml-2 leading-none"> &#8227; </span>
            </span>
          );
        } else {
          return (
            <span key={i} className="text-[#759691] flex items-center h-5">
              {crumb.label}
            </span>
          );
        }
      })}
    </div>
  );
};

export default Breadcrumbs;