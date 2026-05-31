import { use } from "react"

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Project {id}</h1>
      <p className="text-gray-400">Project detail viewer — coming soon</p>
    </div>
  )
}
