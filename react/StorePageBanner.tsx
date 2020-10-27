import React, { useContext } from 'react'
import { defineMessages } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import { StoreGroupContext } from './contexts/StoreGroupContext'

const CSS_HANDLES = [
  'bannerContainer',
  'bannerHeader',
  'bannerSubheader',
] as const

interface PageBannerProps {
  header: string
  subheader: string
}

const StorePageBanner: StorefrontFunctionComponent<PageBannerProps> = ({
  header,
  subheader,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  const group = useContext(StoreGroupContext)

  if (!group) {
    return null
  }

  const textParser = (string: string) => {
    return string
      .replace(/{storeName}/gi, group.name)
      .replace(/{storeCity}/gi, group.address.city)
  }

  return (
    <div className={`${handles.bannerContainer} tc b t-heading-4 mt7 mb4`}>
      {header && (
        <div className={`${handles.bannerHeader}`}>{textParser(header)}</div>
      )}
      {subheader && (
        <div className={`${handles.bannerSubheader}`}>
          {textParser(subheader)}
        </div>
      )}
    </div>
  )
}

const messages = defineMessages({
  title: {
    defaultMessage: '',
    id: 'admin/editor.storePageBanner.title',
  },
  description: {
    defaultMessage: '',
    id: 'admin/editor.storePageBanner.description',
  },
})

StorePageBanner.schema = {
  title: messages.title.id,
  description: messages.description.id,
  type: 'object',
}

export default StorePageBanner
