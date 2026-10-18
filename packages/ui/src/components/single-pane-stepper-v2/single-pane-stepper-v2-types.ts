import { type ReactNode } from 'react'

import type { SinglePaneStepperRootProps } from '../flow-stepper/stepper-root-props'

export type SinglePaneStepperV2RootProps = SinglePaneStepperRootProps

export interface SinglePaneStepperV2CardProps {
  title: string
  description?: string
  /**
   * Text shown as the chat message once this step is completed.
   * Prefer also passing `answer` via `complete({ answer })` so it survives remounts.
   */
  answer?: string
  children: ReactNode
  className?: string
}
