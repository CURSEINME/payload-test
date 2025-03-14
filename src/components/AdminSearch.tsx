'use client'

import React, { useState } from 'react'

const CategorySearch = () => {
  const [categoryId, setCategoryId] = useState('')
  const data: any = []
  const isLoading = false

  return (
    <div>
      <input
        type="text"
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        placeholder="Введите ID категории"
      />
      {isLoading ? (
        <p>Загрузка...</p>
      ) : (
        <ul>{data?.docs?.map((product: any) => <li key={product.id}>{product.title}</li>)}</ul>
      )}
    </div>
  )
}

export default CategorySearch
