import React, { FC, useContext, ReactNode } from 'react'
import { useLazyQuery } from 'react-apollo'
import { Helmet } from 'react-helmet'
import { useRuntime } from 'vtex.render-runtime'

import GET_STORE from './queries/getStore.graphql'
import { SpecificationGroup, StoreResult } from './typings/store'

const StoreGroupContext = React.createContext<SpecificationGroup | undefined>(
  undefined
)

interface StoreGroupProviderProps {
  group: SpecificationGroup | undefined
}
const StoreGroupProvider: FC<StoreGroupProviderProps> = ({
  group,
  children,
}) => {
  return (
    <StoreGroupContext.Provider value={group}>
      {children}
    </StoreGroupContext.Provider>
  )
}

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
      <StoreGroupProvider group={data?.getStore.item}>
        {children}
      </StoreGroupProvider>
    </>
  )
}

export const useStoreGroup = () => {
  const group = useContext(StoreGroupContext)

  return group
}

export default StoreGroup
