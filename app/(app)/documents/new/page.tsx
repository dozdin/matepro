'use client'

import { useRouter } from 'next/navigation'
import { UploadDocumentModal } from '@/components/modals'

export default function NewDocumentPage() {
  const router = useRouter()

  const handleClose = () => {
    router.push('/documents')
  }

  const handleSubmit = (data: {
    name: string
    description: string
    category: string
    projectId: string | null
    file: File
  }) => {
    // In a real app, this would upload to storage and save to database
    console.log('Uploading document:', data)
    router.push('/documents')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <UploadDocumentModal
        isOpen={true}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
