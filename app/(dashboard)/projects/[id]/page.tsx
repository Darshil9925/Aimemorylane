export default function ProjectPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Project {params.id}</h1>
      <p className="text-gray-400">Project viewer coming in Phase 3</p>
    </div>
  )
}
