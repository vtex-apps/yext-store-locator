// import React from 'react'
import React, { Fragment, useContext } from 'react'
import { defineMessages } from 'react-intl'

import { StoreGroupContext } from './contexts/StoreGroupContext'

interface StoreCustomFieldProps {
  id: string
  type: string
}

const StoreConditional: StorefrontFunctionComponent<StoreCustomFieldProps> = (
  props
) => {
  const group = useContext(StoreGroupContext)
  const { id, type } = props

  if (!group || !id) {
    return null
  }

  if (type === 'text') {
    const text = group.customFields.text.find((field) => field.id === id)

    if (text?.data) {
      return <Fragment>{props.children}</Fragment>
    }
  }

  if (type === 'textList') {
    const text = group.customFields.textList.find((field) => field.id === id)

    if (text?.data.length) {
      return <Fragment>{props.children}</Fragment>
    }
  }

  if (type === 'image') {
    const image = group.customFields.image.find((field) => field.id === id)

    if (image?.data) {
      return <Fragment>{props.children}</Fragment>
    }
  }

  if (type === 'imageList') {
    const images = group.customFields.imageList.find((field) => field.id === id)

    if (images?.data?.length) {
      return <Fragment>{props.children}</Fragment>
    }
  }

  return null
}

const messages = defineMessages({
  title: {
    defaultMessage: '',
    id: 'admin/editor.storeConditional.title',
  },
  description: {
    defaultMessage: '',
    id: 'admin/editor.storeConditional.description',
  },
  idTitle: {
    defaultMessage: '',
    id: 'admin/editor.storeConditionalId.title',
  },
  idDescription: {
    defaultMessage: '',
    id: 'admin/editor.storeConditionalId.description',
  },
  typeTitle: {
    defaultMessage: '',
    id: 'admin/editor.storeConditionalType.title',
  },
  typeDescription: {
    defaultMessage: '',
    id: 'admin/editor.storeConditionalType.description',
  },
})

StoreConditional.schema = {
  title: messages.title.id,
  description: messages.description.id,
  type: 'object',
  properties: {
    id: {
      title: messages.idTitle.id,
      description: messages.idDescription.id,
      type: 'string',
      isLayout: false,
      default: '',
    },
    type: {
      title: messages.typeTitle.id,
      description: messages.typeDescription.id,
      type: 'string',
      enum: ['text', 'textList', 'image', 'imageList'],
      isLayout: false,
      default: '',
    },
  },
}

export default StoreConditional
