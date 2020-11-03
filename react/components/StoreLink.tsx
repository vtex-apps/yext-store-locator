import React, { FC } from 'react'
import slugify from 'slugify'
import { useCssHandles } from 'vtex.css-handles'
import { Link, useRuntime } from 'vtex.render-runtime'

import { SpecificationGroup } from '../typings/store'

interface StoreLinkProps {
  item: SpecificationGroup
}
const Slugify = (str: string) => {
  return slugify(str, { lower: true, remove: /[*+~.()'"!:@]/g })
}

const CSS_HANDLES = ['storeLink'] as const

const StoreLink: FC<StoreLinkProps> = ({ item }) => {
  const { location } = useRuntime()
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <Link
      className={`${handles.storeLink} b no-underline underline-hover vtex-link`}
      page="store.storedetail"
      onClick={() => location.reload()}
      params={{
        slug: `${Slugify(
          `${item.name} ${item.address.state} ${item.address.postalCode}`
        )}`,
        store_id: item.id,
      }}
    >
      {`${item.name} - ${item.address.city}`}
    </Link>
  )
}

export default StoreLink
