import React, { ReactNode } from 'react'
import { useLazyQuery } from 'react-apollo'
import { Helmet } from 'react-helmet'
import { useRuntime } from 'vtex.render-runtime'

import GET_STORE from './queries/getStore.graphql'
import { StoreResult } from './typings/store'
import { StoreGroupContext } from './contexts/StoreGroupContext'

interface StoreGroupProps {
  children: ReactNode
}

const StoreGroup: StorefrontFunctionComponent<StoreGroupProps> = ({
  children,
}) => {
  const { history } = useRuntime()
  const [getStore, { data, called }] = useLazyQuery<StoreResult>(GET_STORE)

  if (history && !called) {
    const locationId = history.location.state.navigationRoute.params.store_id

    getStore({
      variables: {
        locationId,
      },
    })
  }

  return (
    <>
      {data && (
        <Helmet>
          <title>{data.getStore.item.name}</title>
          <script type="application/ld+json">
            {data.getStoreSchema.response}
          </script>
        </Helmet>
      )}
      <StoreGroupContext.Provider value={data?.getStore.item}>
        {children}
      </StoreGroupContext.Provider>
    </>
  )
}

export default StoreGroup
