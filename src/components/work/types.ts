export type WorkItem = {
  id: string
  name: string
  accent: string
  image?: string
  url?: string
  tags?: readonly string[]
  category: string
  problem: string
  solution: string
  impact: string
}
