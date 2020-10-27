import React from 'react'

import { SpecificationGroup } from '../typings/store'

export const StoreGroupContext = React.createContext<
  SpecificationGroup | undefined
>(undefined)
