import React from 'react'
import { defineMessages, FormattedMessage } from 'react-intl'
import { Link } from 'vtex.render-runtime'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = ['backLinkContainer', 'backLink'] as const

interface StoreBackLinkProps {
  label: string
}

const StoreBackLink: StorefrontFunctionComponent<StoreBackLinkProps> = ({
  label,
}) => {
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <div className={handles.backLinkContainer}>
      <Link className={`${handles.backLink}`} page="store.storelocator">
        {label ?? (
          <FormattedMessage id="store/yext-store-locator.storeBackLink.linkText" />
        )}
      </Link>
    </div>
  )
}

const messages = defineMessages({
  title: {
    defaultMessage: '',
    id: 'admin/editor.storeBackLink.title',
  },
  description: {
    defaultMessage: '',
    id: 'admin/editor.storeBackLink.description',
  },
  labelTitle: {
    defaultMessage: '',
    id: 'admin/editor.storeBackLinkLabel.title',
  },
  labelDescription: {
    defaultMessage: '',
    id: 'admin/editor.storeBackLinkLabel.description',
  },
})

StoreBackLink.schema = {
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

export default StoreBackLink
