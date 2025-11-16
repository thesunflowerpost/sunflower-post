import BookDiscussionPage from "@/components/BookDiscussionPage";

type Props = {
  params: { id: string };
};

export default function BookClubDiscussionRoute({ params }: Props) {
  const bookId = Number(params.id) || 1;
  return <BookDiscussionPage bookId={bookId} />;
}
