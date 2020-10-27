import React, { FC } from 'react'
import slugify from 'slugify'
import { Link, useRuntime } from 'vtex.render-runtime'

import { SpecificationGroup } from '../typings/store'

interface StoreLinkProps {
  item: SpecificationGroup
}
const Slugify = (str: string) => {
  return slugify(str, { lower: true, remove: /[*+~.()'"!:@]/g })
}

const StoreLink: FC<StoreLinkProps> = ({ item }) => {
  const { location } = useRuntime()

  return (
    <Link
      className="b no-underline underline-hover"
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
