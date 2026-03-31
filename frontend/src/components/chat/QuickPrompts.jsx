const PROMPT_GROUPS = [
  {
    label: 'Tonight',
    prompts: [
      { text: "What should I do tonight?", emoji: "\u{1F319}" },
      { text: "I'm bored, surprise me", emoji: "\u{1F634}" },
      { text: "Plan a romantic evening", emoji: "\u{1F495}" },
    ]
  },
  {
    label: 'Food & Travel',
    prompts: [
      { text: "Best restaurants near me", emoji: "\u{1F37D}\u{FE0F}" },
      { text: "Weekend trip ideas", emoji: "\u{2708}\u{FE0F}" },
    ]
  },
  {
    label: 'Entertainment',
    prompts: [
      { text: "What's trending on Netflix?", emoji: "\u{1F3AC}" },
      { text: "Any live matches?", emoji: "\u{1F3CF}" },
      { text: "Latest news", emoji: "\u{1F4F0}" },
    ]
  },
]

export default function QuickPrompts({ onSelect }) {
  return (
    <div className="px-4 py-2 space-y-2">
      {PROMPT_GROUPS.map(group => (
        <div key={group.label}>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">{group.label}</p>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {group.prompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => onSelect(prompt.text)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-white/5 rounded-full text-xs text-gray-600 dark:text-gray-400 hover:text-primary hover:border-primary/30 transition whitespace-nowrap"
              >
                <span>{prompt.emoji}</span>
                {prompt.text}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
