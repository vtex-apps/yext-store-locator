/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext } from 'react'
import { defineMessages } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import { StoreGroupContext } from './contexts/StoreGroupContext'

const CSS_HANDLES = ['logoContainer'] as const

interface StoreLogoProps {
  width: string
  height: string
}

const StoreLogo: StorefrontFunctionComponent<StoreLogoProps> = ({
  width,
  height,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  const group = useContext(StoreGroupContext)

  if (!group) {
    return null
  }

  return (
    <div style={{ height, width }} className={handles.logoContainer}>
      <img src={group.logo.image.url} alt="Logo" />
    </div>
  )
}

const messages = defineMessages({
  title: {
    defaultMessage: '',
    id: 'admin/editor.storeLogo.title',
  },
  description: {
    defaultMessage: '',
    id: 'admin/editor.storeLogo.description',
  },
})

StoreLogo.defaultProps = {
  width: '300px',
  height: '300px',
}

StoreLogo.schema = {
  title: messages.title.id,
  description: messages.description.id,
  type: 'object',
  properties: {},
}

export default StoreLogo
