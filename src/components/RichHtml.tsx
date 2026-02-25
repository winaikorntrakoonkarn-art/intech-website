interface RichHtmlProps {
  html: string;
  className?: string;
}

export default function RichHtml({ html, className = "" }: RichHtmlProps) {
  // If the content does not contain HTML tags, it's plain text (backward compatible)
  const isHtml = /<[a-z][\s\S]*>/i.test(html);

  if (!isHtml) {
    return <p className={className}>{html}</p>;
  }

  return (
    <div
      className={`prose-content ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
