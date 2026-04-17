'use client'

import { useRouter } from 'next/navigation'
import { CreateChecklistModal } from '@/components/modals'

export default function NewChecklistPage() {
  const router = useRouter()

  const handleClose = () => {
    router.push('/checklists')
  }

  const handleSubmit = (data: { name: string; description: string; projectId: string; items: string[] }) => {
    // In a real app, this would save to the database
    console.log('Creating checklist:', data)
    router.push('/checklists')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <CreateChecklistModal
        isOpen={true}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
