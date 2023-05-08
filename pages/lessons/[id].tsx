import { useState } from "react";
import cn from "classnames";
import {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import { getLesson, getLessonIds, getLessons } from "@lib/lessons";
import Link from "next/link";
import styles from "@styles/Lesson.module.css";
import ButterflyFish from "@components/icons/butterfly-fish";
import Waves from "@components/icons/waves";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { MarkdownImage } from "@components/markdown-image";
import rehypeRaw from "rehype-raw";
import unwrapImages from "remark-unwrap-images";
import { MarkdownHeading } from "@components/markdown-heading";

const Lesson: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  lessons,
  lessonData,
}) => {
  const [selected, setSelected] = useState<0 | 1>(0);
  const lessonNumber = (lessonData.order - 1).toString().padStart(2, "0");
  return (
    <>
      <section className="bg-primary text-secondary px-4 py-10">
        <div className="grid gap-6 sm:grid-cols-[1fr_220px] max-w-6xl mx-auto items-end">
          <div>
            <h3 className="font-comic-cat">LESSON {lessonNumber}:</h3>
            <h1 className="font-comic-cat mb-4">{lessonData.title}</h1>
            {lessonData.url && (
              <iframe
                className="w-full aspect-video"
                src={lessonData.url}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
            {lessonData.image && (
              <Image
                src={lessonData.image}
                alt={lessonData.title}
                width={600}
                height={400}
                className="w-full"
              />
            )}
          </div>
          <div className={cn(styles["lesson-list-wrapper"])}>
            <ul>
              {lessons.map((lesson, index) => (
                <li
                  className={cn(
                    "border-2  border-secondary px-2 py-1 hover:bg-secondary",
                    lesson.id === lessonData.id ? "bg-secondary" : "",
                    index === lessons.length - 1 ? "border-b-2" : "border-b-0"
                  )}
                  key={lesson.id}
                >
                  <Link
                    href={`/lessons/${lesson.id}`}
                    className={cn(
                      lesson.id === lessonData.id
                        ? "text-primary"
                        : "text-secondary"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <Waves
                        className={cn(
                          "w-6",
                          lesson.id === lessonData.id
                            ? "fill-primary"
                            : "fill-secondary"
                        )}
                      />
                      {(lesson.order - 1).toString().padStart(2, "0")}
                    </span>
                    <p className="pl-8">{lesson.title}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <p
            className="max-w-prose sm:col-span-2"
            dangerouslySetInnerHTML={{ __html: lessonData.description }}
          />
        </div>
      </section>
      <section className="py-24 relative">
        <Image
          src="/bg2.png"
          alt="Checkered background"
          className="z-0 bg-repeat"
          quality={100}
          fill
        />
        <div className="container mx-auto text-primary max-w-6xl px-4 relative z-10">
          <div className="outline-primary outline-2 outline w-min flex font-comic-cat mb-8">
            <button
              className={cn("p-2 w-24 block", {
                "bg-primary text-secondary": !selected,
              })}
              onClick={() => setSelected(0)}
            >
              Lesson
            </button>
            <button
              className={cn("p-2 w-24 block", {
                "bg-primary text-secondary": selected,
              })}
              onClick={() => setSelected(1)}
            >
              Resources
            </button>
          </div>
          <div className="bg-primary p-2 inline-flex items-center gap-3 mb-5">
            <ButterflyFish className="fill-secondary w-6" />
            <h3 className="text-secondary text-sm">LESSON {lessonNumber}</h3>
          </div>
          <ReactMarkdown
            className={cn(styles.lesson, selected === 0 ? "block" : "!hidden")}
            rehypePlugins={[rehypeRaw]}
            remarkPlugins={[unwrapImages]}
            components={{
              div: ({ node, ...props }) => {
                switch (props.className) {
                  case "grid-layout-2":
                    return (
                      <div className="grid md:grid-cols-2 mt-5">
                        {props.children}
                      </div>
                    );

                  case "grid-layout-3":
                    return (
                      <div className="grid md:grid-cols-3 mt-5">
                        {props.children}
                      </div>
                    );

                  default:
                    return <div>{props.children}</div>;
                }
              },
              img: ({ node, ...props }) => (
                <MarkdownImage src={props.src} alt={props.alt} />
              ),
              h1: ({ node, ...props }) => (
                <MarkdownHeading icons={lessonData.icons}>{props.children}</MarkdownHeading>
              ),
            }}
          >
            {lessonData.content}
          </ReactMarkdown>
          {selected === 1 && (
            <div>
              {lessonData.resources ? (
                <div>
                  {lessonData.resources.map((resource, index) => {
                    const resourceName = Object.keys(resource)[0];
                    const link = resource[resourceName];
                    return (
                      <a
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        className={cn(
                          "text-primary border-primary border-2  hover:bg-primary  hover:text-secondary inline-flex items-center",
                          styles["resource-link"]
                        )}
                      >
                        <Waves className="fill-primary w-14 h-6" />
                        <span className="border-l-2 border-primary p-2">
                          {resourceName}
                        </span>
                      </a>
                    );
                  })}
                </div>
              ) : (
                <div>
                  <h3 className="text-2xl">None for this lesson.</h3>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Lesson;

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getLessonIds();

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }: GetStaticPropsContext) => {
  const lessons = getLessons();
  const lessonData = await getLesson((params?.id as string) ?? "");

  return {
    props: {
      lessons,
      lessonData,
    },
  };
};
