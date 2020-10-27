import React, { useContext } from 'react'
import { defineMessages } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import { Slider } from 'vtex.store-components'

import { StoreGroupContext } from './contexts/StoreGroupContext'

const CSS_HANDLES = [
  'customDataTextContainer',
  'customDataTextListContainer',
  'customDataTextListLabel',
  'customDataTextList',
  'customDataTextListItem',
  'customDataImageContainer',
  'customDataImageListContainer',
  'customDataImageListItem',
] as const

interface StoreCustomFieldProps {
  label: string
  id: string
  type: 'text' | 'textList' | 'image' | 'imageList'
  altText: string
}

const StoreCustomData: StorefrontFunctionComponent<StoreCustomFieldProps> = ({
  label,
  id,
  type,
  altText,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  const group = useContext(StoreGroupContext)

  if (!group || !id) {
    return null
  }

  if (type === 'text') {
    const text = group.customFields.text.find((field) => field.id === id)

    if (text) {
      return (
        text && (
          <div className={`${handles.customDataTextContainer}`}>
            {text.data}
          </div>
        )
      )
    }
  }

  if (type === 'textList') {
    const text = group.customFields.textList.find((field) => field.id === id)

    if (text) {
      return (
        <div className={`${handles.customDataTextListContainer}`}>
          {label && (
            <div className={`${handles.customDataTextListLabel} b t-heading-6`}>
              {label}
            </div>
          )}
          <div>
            <ul className={`${handles.customDataTextList} mb2`}>
              {text.data.map((item, i) => (
                <li className={`${handles.customDataTextListItem} mb2`} key={i}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )
    }
  }

  if (type === 'image') {
    const image = group.customFields.image.find((field) => field.id === id)

    if (image) {
      return (
        <div className={`${handles.customDataImageContainer}`}>
          <img src={image.data.url} alt={altText} />
        </div>
      )
    }
  }

  if (type === 'imageList') {
    const images = group.customFields.imageList.find((field) => field.id === id)

    const sliderSettings = {
      className: 'ph8 mw8 mv8',
      dots: true,
      infinite: true,
      slidesToScroll: 1,
      slidesToShow: 2,
      autoplay: true,
      speed: 500,
    }

    if (images) {
      return (
        <div
          className={`${handles.customDataImageListContainer} flex items-center justify-center`}
        >
          <Slider sliderSettings={sliderSettings}>
            {images.data.map((item, i) => (
              <div className={`${handles.customDataImageListItem} ph4`} key={i}>
                <img src={item.image.url} alt={altText} />
              </div>
            ))}
          </Slider>
        </div>
      )
    }
  }

  return null
}

const messages = defineMessages({
  title: {
    defaultMessage: '',
    id: 'admin/editor.storeCustomData.title',
  },
  description: {
    defaultMessage: '',
    id: 'admin/editor.storeCustomData.description',
  },
  labelTitle: {
    defaultMessage: '',
    id: 'admin/editor.storeCustomDataLabel.title',
  },
  labelDescription: {
    defaultMessage: '',
    id: 'admin/editor.storeCustomDataLabel.description',
  },
  idTitle: {
    defaultMessage: '',
    id: 'admin/editor.storeCustomDataId.title',
  },
  idDescription: {
    defaultMessage: '',
    id: 'admin/editor.storeCustomDataId.description',
  },
  typeTitle: {
    defaultMessage: '',
    id: 'admin/editor.storeCustomDataType.title',
  },
  typeDescription: {
    defaultMessage: '',
    id: 'admin/editor.storeCustomDataType.description',
  },
  altTextTitle: {
    defaultMessage: '',
    id: 'admin/editor.storeCustomDataAltText.title',
  },
  altTextDescription: {
    defaultMessage: '',
    id: 'admin/editor.storeCustomDataAltText.description',
  },
})

StoreCustomData.schema = {
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
    altText: {
      title: messages.altTextTitle.id,
      description: messages.altTextDescription.id,
      type: 'string',
      isLayout: false,
      default: '',
    },
  },
}

export default StoreCustomData
