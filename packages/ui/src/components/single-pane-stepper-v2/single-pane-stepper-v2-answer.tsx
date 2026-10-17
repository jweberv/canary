import { Button } from '@components/button'
import { MessageBubble } from '@components/chat'
import { CopyButton } from '@components/copy-button'
import { IconV2 } from '@components/icon-v2'
import { Text } from '@components/text'

import { useEngineContext } from '../split-pane-stepper/split-pane-stepper-context'

function formatMessageTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

export interface SinglePaneStepperV2AnswerProps {
  subStepId: string
  answer: string
  completedAt?: number
  showRestart: boolean
}

export function SinglePaneStepperV2Answer({
  subStepId,
  answer,
  completedAt,
  showRestart
}: SinglePaneStepperV2AnswerProps) {
  const { requestReactivation } = useEngineContext()

  return (
    // eslint-disable-next-line jsx-a11y/aria-role
    <MessageBubble.Root role="user" className="cn-single-pane-stepper-v2-answer">
      <MessageBubble.Content>
        <MessageBubble.Text>{answer}</MessageBubble.Text>
      </MessageBubble.Content>
      <MessageBubble.Footer>
        {showRestart && (
          <Button
            iconOnly
            variant="ghost"
            size="sm"
            ignoreIconOnlyTooltip
            aria-label="Edit this answer"
            onClick={() => requestReactivation(subStepId)}
          >
            <IconV2 name="edit-pencil" size="sm" />
          </Button>
        )}
        <CopyButton name={answer} buttonVariant="ghost" size="sm" />
        {completedAt ? (
          <Text variant="caption-normal" color="foreground-3">
            {formatMessageTime(completedAt)}
          </Text>
        ) : null}
      </MessageBubble.Footer>
    </MessageBubble.Root>
  )
}
