export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="section-title">{title}</h1>
      <p className="section-description">{description}</p>
    </div>
  );
}
