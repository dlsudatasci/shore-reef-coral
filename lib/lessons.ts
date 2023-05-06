import fs from "fs";
import path from "path";
import matter from "gray-matter";

const lessonsDirectory = path.join(process.cwd(), "posts/lessons");

type LessonData = {
  title: string;
  description: string;
  order: number;
  url?: string;
  image?: string;
  resources: Array<any>;
};

export function getLessons() {
  const fileNames = fs.readdirSync(lessonsDirectory);
  const allData = fileNames.map((fileName) => {
    const fullPath = path.join(lessonsDirectory, fileName);
    const contents = fs.readFileSync(fullPath, "utf8");

    const matterResult = matter(contents);

    return {
      id: fileName.replace(/.md$/, ""),
      title: matterResult.data.title,
      order: matterResult.data.order,
    } as { id: string; title: string; order: number };
  });

  return allData.sort(({ order: a }, { order: b }) => {
    if (a < b) {
      return -1;
    } else if (a > b) {
      return +1;
    }

    return 0;
  });
}

export function getLessonIds() {
  const fileNames = fs.readdirSync(lessonsDirectory);

  return fileNames.map((fileName) => ({
    params: {
      id: fileName.replace(/.md$/, ""),
      locale: "en",
    },
  }));
}

export async function getLesson(id: string) {
  const fullPath = path.join(lessonsDirectory, id + ".md");
  const contents = fs.readFileSync(fullPath, "utf8");

  const matterResult = matter(contents);

  return {
    id,
    content: matterResult.content,
    ...(matterResult.data as LessonData),
  };
}
