type Props = { role: "user" | "assistant"; content: string };

export default function ChatMessage({ role, content }: Props) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={[
          "max-w-[85%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap",
          isUser ? "bg-[#151a27] border border-[#2a3245]" : "bg-[#0f1420] border border-[#20283a]",
        ].join(" ")}
      >
        {content}
      </div>
    </div>
  );
}
