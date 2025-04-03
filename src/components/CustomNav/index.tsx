'use client'

import React, { useState } from 'react'
import { updateProductPrices } from '@/actions/products'
import { toast } from '@payloadcms/ui'

const CustomNav = () => {
  const [isLoading, setIsLoading] = useState(false)

  const handleUpdate = async () => {
    if (!confirm('Вы уверены, что хотите обновить все цены?')) return

    setIsLoading(true)
    toast.loading('Обновление цен...')

    try {
      const result = await updateProductPrices()
      if (result.success) {
        if (result.updatedCount === 0) {
          toast.dismiss()
          toast.success('Все цены актуальны')
        } else {
          toast.dismiss()
          toast.success(
            `Успешно обновлено ${result.updatedCount} ${result.updatedCount == 1 ? 'цена' : result.updatedCount < 5 ? 'цены' : 'цен'}`,
          )
        }
      } else {
        toast.dismiss()
        toast.error(result.message)
      }
    } catch (error) {
      toast.dismiss()
      toast.error('Неизвестная ошибка при обновлении')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--theme-elevation-100)' }}>
      <button
        onClick={handleUpdate}
        disabled={isLoading}
        style={{
          background: 'var(--theme-elevation-150)',
          border: 'none',
          borderRadius: '0.25rem',
          color: 'var(--theme-text)',
          cursor: 'pointer',
          padding: '0.5rem 1rem',
          display: 'block',
          fontWeight: 'bold',
          width: '100%',
          opacity: isLoading ? 0.7 : 1,
        }}
      >
        {isLoading ? 'Обновление...' : 'Обновить цены'}
      </button>
    </div>
  )
}

export default CustomNav
