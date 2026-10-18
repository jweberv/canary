import { useMemo } from 'react'

import { cn } from '@utils/cn'

import { AlertDialog } from '../alert-dialog'
import { FlowEngineProvider, useEngineContext } from '../flow-stepper/engine'
import { resolveShowRootHeader } from '../flow-stepper/resolve-show-root-header'
import { useFlowStepperRailModel } from '../flow-stepper/use-flow-stepper-rail-model'
import { IconV2 } from '../icon-v2'
import { Layout } from '../layout'
import { Text } from '../text'
import { SinglePaneStepperV2LayoutProvider } from './single-pane-stepper-v2-layout-context'
import { SinglePaneStepperV2Timeline } from './single-pane-stepper-v2-timeline'
import { SinglePaneStepperV2RootProps } from './single-pane-stepper-v2-types'

const DEFAULT_REACTIVATION_PROMPT = {
  title: 'Go back?',
  description: 'Going back to this step will discard your progress on subsequent steps. Are you sure?'
}

function SinglePaneStepperV2Content({
  title,
  icon,
  stepperTitle,
  showStepperHeader,
  contentTitle,
  contentSubtitle,
  drawers,
  onClose,
  showRootHeader,
  hideHeader,
  reactivationPrompt,
  className,
  style,
  showStepBadge = true,
  hidePredictedSteps
}: Omit<SinglePaneStepperV2RootProps, 'flow' | 'onComplete' | 'onReactivate' | 'children' | 'initialEngineState'>) {
  const { drawerState, closeDrawer, pendingReactivation, confirmReactivation, cancelReactivation } = useEngineContext()
  const { totalStepsCount } = useFlowStepperRailModel()

  const prompt = reactivationPrompt || DEFAULT_REACTIVATION_PROMPT
  const showHeader = resolveShowRootHeader(showRootHeader, hideHeader) && !!(icon || title || onClose)

  const activeDrawer = useMemo(() => {
    if (!drawerState || !drawers) return null
    const DrawerComponent = drawers[drawerState.id]
    if (!DrawerComponent) return null
    return <DrawerComponent open={true} onClose={closeDrawer} props={drawerState.props} />
  }, [drawerState, drawers, closeDrawer])

  return (
    <>
      <Layout.Vertical
        gap="none"
        className={cn('cn-single-pane-stepper-root', 'cn-single-pane-stepper-v2-root', className)}
        style={style}
      >
        {showHeader && (
          <Layout.Horizontal as="header" align="center" gap="sm" className="cn-single-pane-stepper-header">
            {icon}
            {title && (
              <Text as="h1" variant="heading-section" color="foreground-1" className="!m-0 min-w-0 flex-1">
                {title}
              </Text>
            )}
            {!title && <div className="flex-1" />}
            {onClose && (
              <button type="button" onClick={onClose} aria-label="Close" className="cn-single-pane-stepper-close-btn">
                <IconV2 name="xmark" size="sm" />
              </button>
            )}
          </Layout.Horizontal>
        )}

        <div className="cn-single-pane-stepper-v2-body">
          {(showStepperHeader && stepperTitle) || contentTitle || contentSubtitle ? (
            <Layout.Vertical className="cn-single-pane-stepper-content-header">
              {showStepperHeader && stepperTitle && (
                <h2 className="cn-single-pane-stepper-content-title">{stepperTitle}</h2>
              )}
              {contentTitle && <h2 className="cn-single-pane-stepper-content-title">{contentTitle}</h2>}
              {contentSubtitle && <p className="cn-single-pane-stepper-content-subtitle">{contentSubtitle}</p>}
            </Layout.Vertical>
          ) : null}

          <SinglePaneStepperV2LayoutProvider showStepBadge={showStepBadge} totalSteps={totalStepsCount}>
            <SinglePaneStepperV2Timeline hidePredictedSteps={hidePredictedSteps} />
          </SinglePaneStepperV2LayoutProvider>
        </div>
      </Layout.Vertical>

      {activeDrawer}

      <AlertDialog.Root
        open={!!pendingReactivation}
        onOpenChange={open => {
          if (!open) cancelReactivation()
        }}
        onConfirm={confirmReactivation}
        onCancel={cancelReactivation}
        theme="warning"
      >
        <AlertDialog.Content title={prompt.title}>
          <p className="cn-stepper-go-back-body">{prompt.description}</p>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </>
  )
}

export function SinglePaneStepperV2Root({
  flow,
  onComplete,
  onReactivate,
  disableAutoScroll,
  initialEngineState,
  children,
  ...props
}: SinglePaneStepperV2RootProps) {
  return (
    <FlowEngineProvider
      flow={flow}
      onComplete={onComplete}
      onReactivate={onReactivate}
      disableAutoScroll={disableAutoScroll}
      initialEngineState={initialEngineState}
    >
      <SinglePaneStepperV2Content {...props} />
      {children}
    </FlowEngineProvider>
  )
}
