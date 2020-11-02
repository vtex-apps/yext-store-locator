import React, { useContext } from 'react'
import { defineMessages } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import { StoreGroupContext } from './contexts/StoreGroupContext'

const CSS_HANDLES = [
  'brandsContainer',
  'brandsLabel',
  'brandsList',
  'brandsItem',
] as const

interface StoreBrandsProps {
  label: string
}

const StoreBrands: StorefrontFunctionComponent<StoreBrandsProps> = ({
  label,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  const group = useContext(StoreGroupContext)

  if (!group) {
    return null
  }

  return (
    <div className={`${handles.brandsContainer} mb7`}>
      {label && (
        <div className={`${handles.brandsLabel} b t-heading-6`}>{label}</div>
      )}
      <div>
        <ul
          className={`${handles.brandsList}`}
          style={{ columnCount: 3, padding: 0 }}
        >
          {group.brands.map((brand, i) => (
            <li
              key={i}
              className={handles.brandsItem}
            >
              {brand}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

const messages = defineMessages({
  title: {
    defaultMessage: '',
    id: 'admin/editor.storeBrands.title',
  },
  description: {
    defaultMessage: '',
    id: 'admin/editor.storeBrands.description',
  },
  labelTitle: {
    defaultMessage: '',
    id: 'admin/editor.storeBrandsLabel.title',
  },
  labelDescription: {
    defaultMessage: '',
    id: 'admin/editor.storeBrandsLabel.description',
  },
})

StoreBrands.schema = {
  title: messages.title.id,
  description: messages.description.id,
  type: 'object',
  properties: {
    label: {
      title: messages.labelTitle.id,
      description: messages.labelDescription.id,
      type: 'string',
      isLayout: false,
      default: '',
    },
  },
}

export default StoreBrands
