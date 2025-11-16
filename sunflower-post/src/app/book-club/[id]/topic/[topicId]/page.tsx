import BookTopicPage from "@/components/BookTopicPage";

type Props = {
  params: { bookId: string; topicId: string };
};

export default function BookTopicRoute({ params }: Props) {
  const bookId = Number(params.bookId) || 1;
  const topicId = Number(params.topicId) || 1;

  return <BookTopicPage bookId={bookId} topicId={topicId} />;
}
