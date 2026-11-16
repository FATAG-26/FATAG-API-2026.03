type SkeletonProps = {
  className?: string
}

function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`skeleton-shimmer relative overflow-hidden rounded bg-gray-200 ${className}`}
    />
  )
}

export default Skeleton
