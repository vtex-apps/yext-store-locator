import React, { useContext } from 'react'
import { defineMessages, FormattedMessage } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import { useLazyQuery } from 'react-apollo'

import GET_UBER_LINK from './queries/getUberLink.graphql'
import { StoreGroupContext } from './contexts/StoreGroupContext'

const CSS_HANDLES = ['uberLinkContainer', 'uberLink'] as const

const StoreUberLink: StorefrontFunctionComponent = () => {
  const handles = useCssHandles(CSS_HANDLES)
  const [getLink, { data, called }] = useLazyQuery(GET_UBER_LINK)
  const group = useContext(StoreGroupContext)

  if (group && !called) {
    getLink({
      variables: {
        locationId: group.id,
      },
    })
  }

  if (data?.getUberLink) {
    return (
      <div className={handles.uberLinkContainer}>
        <a className={`${handles.uberLink}`} href={data.getUberLink.uberLink}>
          <FormattedMessage id="store/yext-store-locator.storeUberLink.linkText" />
        </a>
      </div>
    )
  }

  return null
}

const messages = defineMessages({
  title: {
    defaultMessage: '',
    id: 'admin/editor.storeUberLink.title',
  },
  description: {
    defaultMessage: '',
    id: 'admin/editor.storeUberLink.description',
  },
})

StoreUberLink.schema = {
  title: messages.title.id,
  description: messages.description.id,
  type: 'object',
  properties: {},
}

export default StoreUberLink
