import { useCallback, useEffect, useMemo, useRef } from 'react'

import { IconV2 } from '@components/icon-v2'
import { Text } from '@components/text'
import { cn } from '@utils/cn'

import { CardContextProvider, useEngineContext } from '../split-pane-stepper/split-pane-stepper-context'
import { CardStatus } from '../split-pane-stepper/split-pane-stepper-types'

function statusToStepState(status: CardStatus) {
  if (status === 'completed') return 'completed'
  if (status === 'error') return 'error'
  if (status === 'skipped') return 'skipped'
  return 'active'
}

function collectPredictedPath(
  subSteps: Record<string, { next?: string }>,
  cardHistory: { subStepId: string }[],
  activeSubStepId: string
) {
  const predicted: string[] = []
  const visited = new Set(cardHistory.map(entry => entry.subStepId))
  let current = subSteps[activeSubStepId]?.next
  while (current && subSteps[current] && !visited.has(current)) {
    predicted.push(current)
    visited.add(current)
    current = subSteps[current].next
  }
  return predicted
}

export function SinglePaneStepperV2Timeline() {
  const { flow, cardHistory, activeSubStepId, registerScrollToCard, requestReactivation } = useEngineContext()
  const containerRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef(activeSubStepId)
  activeRef.current = activeSubStepId

  const predictedPath = useMemo(
    () => collectPredictedPath(flow.subSteps, cardHistory, activeSubStepId),
    [flow.subSteps, cardHistory, activeSubStepId]
  )

  const scrollToCard = useCallback((subStepId: string) => {
    const container = containerRef.current
    if (!container) return
    const cardEl = container.querySelector(`[data-card-id="${subStepId}"]`) as HTMLElement | null
    if (!cardEl) return

    const containerRect = container.getBoundingClientRect()
    const cardRect = cardEl.getBoundingClientRect()
    const offset = cardRect.top - containerRect.top + container.scrollTop

    if (typeof container.scrollTo === 'function') {
      container.scrollTo({ top: Math.max(0, offset - 16), behavior: 'smooth' })
    } else {
      container.scrollTop = Math.max(0, offset - 16)
    }
  }, [])

  useEffect(() => {
    registerScrollToCard(scrollToCard)
  }, [registerScrollToCard, scrollToCard])

  useEffect(() => {
    if (activeRef.current) {
      const timeoutId = setTimeout(() => scrollToCard(activeRef.current), 50)
      return () => clearTimeout(timeoutId)
    }
  }, [scrollToCard])

  return (
    <div ref={containerRef} className="cn-single-pane-stepper-v2-card-stack">
      <ol className="cn-stepper-list cn-single-pane-stepper-v2-list" aria-label="Progress steps">
        {cardHistory.map((entry, index) => {
          const config = flow.subSteps[entry.subStepId]
          if (!config) return null
          const CardComponent = config.component
          const derivedState = statusToStepState(entry.status)
          const isLastVisible = index === cardHistory.length - 1 && predictedPath.length === 0

          return (
            <li
              key={entry.subStepId}
              data-card-id={entry.subStepId}
              className="cn-stepper-step-item cn-single-pane-stepper-v2-step-item"
            >
              <div
                className={cn('cn-stepper-step', `cn-stepper-step-${derivedState}`)}
                aria-current={entry.status === 'active' ? 'step' : undefined}
              >
                <button
                  type="button"
                  className="cn-single-pane-stepper-v2-indicator-btn"
                  aria-label={
                    entry.status === 'completed' || entry.status === 'skipped'
                      ? `Go back to ${config.title || entry.subStepId}`
                      : `Step ${index + 1}: ${config.title || entry.subStepId}`
                  }
                  disabled={entry.status === 'active' || entry.status === 'error'}
                  onClick={() => {
                    if (entry.status === 'completed' || entry.status === 'skipped') {
                      requestReactivation(entry.subStepId)
                    }
                  }}
                >
                  <span className="cn-stepper-indicator">
                    {derivedState === 'completed' || derivedState === 'skipped' ? (
                      <IconV2 name="check" size="xs" />
                    ) : derivedState === 'error' ? (
                      <IconV2 name="xmark-circle" size="xs" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </span>
                </button>
              </div>

              {!isLastVisible && (
                <span
                  className={cn('cn-stepper-connector', `cn-stepper-connector-${derivedState}`)}
                  aria-hidden="true"
                />
              )}

              <CardContextProvider subStepId={entry.subStepId} status={entry.status}>
                <CardComponent />
              </CardContextProvider>
            </li>
          )
        })}

        {predictedPath.map((subStepId, index) => {
          const config = flow.subSteps[subStepId]
          if (!config) return null
          const stepNumber = cardHistory.length + index + 1
          const isLast = index === predictedPath.length - 1

          return (
            <li key={subStepId} className="cn-stepper-step-item cn-single-pane-stepper-v2-step-item">
              <div className="cn-stepper-step cn-stepper-step-upcoming">
                <span className="cn-single-pane-stepper-v2-indicator-btn" aria-hidden="true">
                  <span className="cn-stepper-indicator">
                    <span>{stepNumber}</span>
                  </span>
                </span>
              </div>
              {!isLast && <span className="cn-stepper-connector cn-stepper-connector-upcoming" aria-hidden="true" />}
              <div className="cn-single-pane-stepper-v2-card cn-single-pane-stepper-v2-card-upcoming">
                <Text
                  as="h3"
                  variant="body-strong"
                  color="foreground-3"
                  className="cn-single-pane-stepper-v2-card-title"
                >
                  {config.title}
                </Text>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
