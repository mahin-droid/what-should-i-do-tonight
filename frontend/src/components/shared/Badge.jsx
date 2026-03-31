export default function Badge({ text, variant = 'default', pulse = false }) {
  const variants = {
    default: 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
    primary: 'bg-primary/20 text-primary',
    success: 'bg-success/20 text-success',
    warning: 'bg-warning/20 text-warning',
    danger: 'bg-danger/20 text-danger',
    live: 'bg-danger/20 text-danger',
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {pulse && <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />}
      {text}
    </span>
  )
}
