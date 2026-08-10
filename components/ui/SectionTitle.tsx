import Badge from "./Badge";

type SectionTitleProps = {
  badge: string;
  title: string;
  description?: string;
};

export default function SectionTitle({
  badge,
  title,
  description,
}: SectionTitleProps) {
  return (
    <div className="text-center">
      <Badge>{badge}</Badge>

      <h2 className="mt-6 text-4xl font-bold md:text-5xl">
        {title}
      </h2>

      {description && (
        <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-400">
          {description}
        </p>
      )}
    </div>
  );
}