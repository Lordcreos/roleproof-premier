import { createFileRoute } from "@tanstack/react-router";
import { CoverLetterPage } from "../pages/CoverLetterPage";

export const Route = createFileRoute("/reports/$id/cover-letter")({
  head: () => ({
    meta: [
      { title: "Cover Letter Studio · RoleProof" },
      { name: "description", content: "Compose a cover letter from the verified evidence in your RoleProof report. Pick sources, edit paragraphs, and see quality signals live." },
      { property: "og:title", content: "Cover Letter Studio · RoleProof" },
      { property: "og:description", content: "Turn a RoleProof report into an evidence-backed cover letter you can actually edit." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CoverLetterRoute,
});

function CoverLetterRoute() {
  const { id } = Route.useParams();
  return <CoverLetterPage id={id} />;
}