import React, { useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import Modal from '../common/Modal'
import useApi from '@/hook/useApi'
import { createFlow } from '@/api/flow'
import Button from '../common/Button'
import Folder from '../common/Folder'

interface CreateFlowModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreateFlowModal({ isOpen, onClose }: CreateFlowModalProps) {
  const [folderName, setFolderName] = useState('')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState<{ url: string; type: string }[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { teamId } = useParams()

  const { execute: createFlowExecute, loading } = useApi(createFlow)

  if (!isOpen) return null

  const handleFolderNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFolderName(e.target.value)
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).map((file) => ({
        url: URL.createObjectURL(file),
        type: file.type.split('/')[1].toUpperCase(),
      }))
      setImages((prev) => [...prev, ...newImages].slice(0, 3))
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleCreate = async () => {
    if (!folderName.trim()) {
      alert('Please enter a folder name.')
      return
    }

    if (!description.trim()) {
      alert('Please enter a description.')
      return
    }

    if (!teamId || isNaN(Number(teamId))) {
      alert('Invalid teamId.')
      return
    }
    try {
      const imageTypes = images.map((img) => img.type)

      await createFlowExecute(
        {
          title: folderName,
          description: description,
          imageTypes: imageTypes,
        },
        Number(teamId),
      )

      onClose()
    } catch (error) {
      console.error(error)
      alert('A folder name is required.')
    }
  }

  return (
    <Modal title='Create Flow' bg='bg-front' size='2xl' onClose={onClose}>
      <div className='flex gap-10 mx-5 mb-5 max-h-[50%]'>
        <div className='flex justify-center mt-4 mb-2'>
          <Folder
            imageUrl={images[0]?.url}
            folderName={folderName}
            onChangeFolderName={handleFolderNameChange}
            onClick={triggerFileInput}
          />
        </div>
        <div className='mt-4 flex flex-col gap-4 w-full'>
          <div>
            <label className='block text-sm font-bold text-gray-900 mb-2'>DESCRIPTION</label>
            <textarea
              placeholder='Describe the purpose of this flow. (e.g., Authentication process including login and signup.)'
              value={description}
              onChange={handleDescriptionChange}
              className='w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm resize-none h-15 transition-all'
            />
          </div>

          <div>
            <h3 className='flex items-center gap-2 text-sm font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2'>
              UPLOAD IMAGE
            </h3>
            <div className='flex gap-3'>
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className='w-[30%] aspect-video bg-[#EFEFEF] rounded-md overflow-hidden flex items-center justify-center border border-gray-100'
                >
                  {images[index] ? (
                    <img
                      src={images[index].url}
                      alt={`Preview ${index}`}
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <span className='text-xs text-gray-400'>{index + 1}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <input
            type='file'
            ref={fileInputRef}
            onChange={handleImageUpload}
            multiple
            accept='image/png, image/jpeg, image/jpg'
            className='hidden'
          />

          <div className='flex justify-center mt-4'>
            <Button onClick={handleCreate} disabled={loading}>
              {loading ? 'CREATING...' : 'CREATE'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
