import React from 'react'
import { defineMessages } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import { useStoreGroup } from './StoreGroup'

const CSS_HANDLES = ['storeTitle'] as const

const StoreTitle = () => {
  const handles = useCssHandles(CSS_HANDLES)
  const group = useStoreGroup()

  if (!group) {
    return null
  }

  return (
    <h1
      className={`${handles.storeTitle} tc`}
    >{`${group.name} - ${group.address.city}`}</h1>
  )
}

const messages = defineMessages({
  title: {
    defaultMessage: '',
    id: 'admin/editor.StoreTitle.title',
  },
  description: {
    defaultMessage: '',
    id: 'admin/editor.StoreTitle.description',
  },
})

StoreTitle.schema = {
  title: messages.title.id,
  description: messages.description.id,
  type: 'object',
}

export default StoreTitle
