type TextBlockProps = {
  content: string
}
export const TextBlock: React.FC<TextBlockProps> = (props) => {
  return (
    <div className="container">
      <p>{props.content}</p>
    </div>
  )
}
