import Image from "next/image";
import { useState } from "react";

type Props = {
  src?: string;
  alt?: string;
};
export const MarkdownImage = ({ src, alt }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="block relative w-[90%] mx-auto mb-7 mt-5 aspect-video markdown-image">
      <Image
        src={src ?? ""}
        alt={alt ?? ""}
        onClick={handleClick}
        className="cursor-pointer object-cover w-full"
        fill
      />
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 !col-span-2" onClick={handleClick}>
          <div className="relative bg-white p-4 rounded shadow-md aspect-video w-[60%]">
            <Image
              src={src ?? ""}
              alt={alt ?? ""}
              className="cursor-pointer object-cover w-full"
              fill
            />
            <button
              onClick={handleClick}
              className="absolute top-0 right-0 mt-2 mr-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 border border-red-700 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
