import { ButtonHTMLAttributes, createContext, FC, ReactNode, useContext } from 'react'
import type { LinkProps } from 'react-router-dom'

import { cn } from '../../utils/cn'
import { ButtonLayout } from '../button-layout'
import { Favorite, FavoriteIconProps } from '../favorite'
import { IconPropsV2, IconV2 } from '../icon-v2'
import { Layout } from '../layout'
import { SandboxLayout } from '../layouts/SandboxLayout'
import { Link } from '../link'
import { LogoPropsV2, LogoV2 } from '../logo-v2'
import { Skeleton } from '../skeletons'
import { Text } from '../text'

export interface PageHeaderBackProps {
  linkText: string
  linkProps: LinkProps
}

export interface PageHeaderButtonProps {
  props?: ButtonHTMLAttributes<HTMLButtonElement>
  text: ReactNode
  isDialogTrigger?: boolean
}

export interface PageHeaderProps {
  backLink?: PageHeaderBackProps
  logoName?: LogoPropsV2['name']
  title: ReactNode
  iconName?: IconPropsV2['name']
  iconSize?: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  description?: ReactNode
  children?: ReactNode
  favoriteProps?: Omit<FavoriteIconProps, 'className'>
  isLoading?: boolean
  actions?: ReactNode
  headerActions?: ReactNode
}

const Header: FC<PageHeaderProps> = ({
  backLink,
  logoName,
  title,
  iconName,
  iconSize = 'lg',
  description,
  children,
  favoriteProps,
  isLoading = false,
  actions,
  headerActions
}) => {
  const scrollable = usePageScrollable()
  const titleElement =
    typeof title === 'string' ? (
      <Text as="h1" variant="heading-section" truncate>
        {title}
      </Text>
    ) : (
      title
    )

  return (
    <Layout.Vertical
      gap="md"
      className={cn(
        'w-full',
        children ? 'mb-cn-md' : 'mb-cn-2xl',
        scrollable && 'sticky top-0 z-10 bg-cn-1 pt-[var(--cn-page-container-spacing-py)]'
      )}
    >
      {(!!backLink || !!headerActions) && (
        <Layout.Horizontal className="h-cn-9">
          {!!backLink && (
            <Link prefixIcon {...backLink.linkProps}>
              {backLink.linkText}
            </Link>
          )}
          {!!headerActions && <ButtonLayout className="flex-1">{headerActions}</ButtonLayout>}
        </Layout.Horizontal>
      )}
      <Layout.Horizontal>
        <Layout.Grid gap="xs" flow="column">
          {isLoading ? (
            <>
              <Skeleton.Logo className="mt-cn-4xs" size="md" />
              <Skeleton.Typography className="w-80" variant="heading-section" />
            </>
          ) : (
            <>
              {!!logoName && <LogoV2 className="mt-cn-4xs" name={logoName} size="md" />}
              {iconName ? (
                <Layout.Horizontal gap="xs" align="center">
                  <div className="mt-cn-4xs">
                    <IconV2 name={iconName} size={iconSize} />
                  </div>
                  {titleElement}
                </Layout.Horizontal>
              ) : (
                titleElement
              )}
            </>
          )}
          {!!favoriteProps && !isLoading && <Favorite className="mt-cn-4xs" {...favoriteProps} />}
        </Layout.Grid>
        {!!actions && <ButtonLayout className="flex-1">{actions}</ButtonLayout>}
      </Layout.Horizontal>
      {!!description && <Text>{description}</Text>}
      {children}
    </Layout.Vertical>
  )
}
Header.displayName = 'PageHeader'

const PageScrollableContext = createContext(false)

export const usePageScrollable = () => useContext(PageScrollableContext)

const Root = ({
  children,
  scrollable,
  mainClassName,
  contentClassName
}: {
  children: ReactNode
  scrollable?: boolean
  mainClassName?: string
  contentClassName?: string
}) => {
  return (
    <PageScrollableContext.Provider value={!!scrollable}>
      <SandboxLayout.Main className={cn('min-h-0', { 'overflow-auto': scrollable }, mainClassName)}>
        <SandboxLayout.Content className={cn('min-h-0', { '!py-0 pb-[100vh] mb-[-100vh]': scrollable }, contentClassName)}>
          {children}
        </SandboxLayout.Content>
      </SandboxLayout.Main>
    </PageScrollableContext.Provider>
  )
}

const Content = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn('min-h-0 flex-1', className)}>{children}</div>
)

export const Page = {
  Root,
  Header,
  Content
}
