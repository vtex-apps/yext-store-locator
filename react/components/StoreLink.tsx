import React, { FC } from 'react'
import slugify from 'slugify'
import { Link } from 'vtex.render-runtime'

import { SpecificationGroup } from '../typings/store'

interface StoreLinkProps {
  item: SpecificationGroup
}
const Slugify = (str: string) => {
  return slugify(str, { lower: true, remove: /[*+~.()'"!:@]/g })
}

const StoreLink: FC<StoreLinkProps> = ({ item }) => {
  return (
    <Link
      className="b no-underline underline-hover"
      page="store.storedetail"
      params={{
        slug: `${Slugify(
          `${item.name} ${item.address.state} ${item.address.postalCode}`
        )}`,
        store_id: String(item.id).replace('1_', ''),
      }}
    >
      {`${item.name} - ${item.address.city}`}
    </Link>
  )
}

export default StoreLink
