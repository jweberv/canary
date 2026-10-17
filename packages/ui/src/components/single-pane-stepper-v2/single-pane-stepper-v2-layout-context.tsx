import { createContext, ReactNode, useContext, useMemo } from 'react'

interface SinglePaneStepperV2LayoutContextValue {
  showStepBadge: boolean
  totalSteps: number
}

const SinglePaneStepperV2LayoutContext = createContext<SinglePaneStepperV2LayoutContextValue>({
  showStepBadge: true,
  totalSteps: 0
})

export function SinglePaneStepperV2LayoutProvider({
  showStepBadge,
  totalSteps,
  children
}: SinglePaneStepperV2LayoutContextValue & { children: ReactNode }) {
  const value = useMemo(() => ({ showStepBadge, totalSteps }), [showStepBadge, totalSteps])
  return <SinglePaneStepperV2LayoutContext.Provider value={value}>{children}</SinglePaneStepperV2LayoutContext.Provider>
}

export function useSinglePaneStepperV2Layout() {
  return useContext(SinglePaneStepperV2LayoutContext)
}
