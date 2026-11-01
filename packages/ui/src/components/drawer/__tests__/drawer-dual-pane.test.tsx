import React from 'react'

import { render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'

import { Drawer } from '../index'

vi.mock('vaul', () => {
  const DrawerRoot = ({ children, ...props }: any) => (
    <div data-testid="drawer-root" {...props}>
      {children}
    </div>
  )
  DrawerRoot.displayName = 'DrawerRoot'

  const DrawerNestedRoot = ({ children, ...props }: any) => (
    <div data-testid="drawer-nested-root" {...props}>
      {children}
    </div>
  )
  DrawerNestedRoot.displayName = 'DrawerNestedRoot'

  const DrawerTrigger = ({ children, asChild, ...props }: any) =>
    asChild ? (
      <>{children}</>
    ) : (
      <button data-testid="drawer-trigger" type="button" {...props}>
        {children}
      </button>
    )
  DrawerTrigger.displayName = 'DrawerTrigger'

  const DrawerContent = React.forwardRef(({ children, ...props }: any, ref) => (
    <div ref={ref} data-testid="drawer-content" {...props}>
      {children}
    </div>
  ))
  DrawerContent.displayName = 'DrawerContent'

  const DrawerPortal = ({ children }: any) => <div data-testid="drawer-portal">{children}</div>
  DrawerPortal.displayName = 'DrawerPortal'

  const DrawerOverlay = ({ children, ...props }: any) => (
    <div data-testid="drawer-overlay" {...props}>
      {children}
    </div>
  )
  DrawerOverlay.displayName = 'DrawerOverlay'

  const DrawerClose = ({ children, asChild, ...props }: any) =>
    asChild ? (
      <>{children}</>
    ) : (
      <button data-testid="drawer-close" type="button" {...props}>
        {children}
      </button>
    )
  DrawerClose.displayName = 'DrawerClose'

  const DrawerTitleComponent = React.forwardRef<any, any>(({ children, ...props }, ref) => (
    <h2 ref={ref} data-testid="drawer-title" {...props}>
      {children}
    </h2>
  ))
  DrawerTitleComponent.displayName = 'DrawerTitle'

  const DrawerDescriptionComponent = React.forwardRef<any, any>(({ children, ...props }, ref) => (
    <p ref={ref} data-testid="drawer-description" {...props}>
      {children}
    </p>
  ))
  DrawerDescriptionComponent.displayName = 'DrawerDescription'

  return {
    Drawer: {
      Root: DrawerRoot,
      NestedRoot: DrawerNestedRoot,
      Trigger: DrawerTrigger,
      Content: DrawerContent,
      Portal: DrawerPortal,
      Overlay: DrawerOverlay,
      Close: DrawerClose,
      Title: DrawerTitleComponent,
      Description: DrawerDescriptionComponent
    }
  }
})

vi.mock('@/context', async () => {
  const actual = await vi.importActual('@/context')

  return {
    ...actual,
    usePortal: () => ({ portalContainer: document.body }),
    DialogOpenContext: {
      Provider: ({ children }: any) => <>{children}</>
    },
    useRegisterDialog: () => ({ handleCloseAutoFocus: vi.fn() })
  }
})

vi.mock('@/components', async () => {
  const actual = await vi.importActual('@/components')

  const MockScrollArea = React.forwardRef<any, any>(({ children, className, classNameContent, ...props }, ref) => (
    <div ref={ref} data-testid="scroll-area" className={className} {...props}>
      <div className={classNameContent}>{children}</div>
    </div>
  ))
  MockScrollArea.displayName = 'ScrollArea'

  return {
    ...actual,
    ScrollArea: MockScrollArea,
    useScrollArea: () => ({
      isTop: true,
      isBottom: false,
      onScrollTop: vi.fn(),
      onScrollBottom: vi.fn()
    })
  }
})

const renderDualPane = ({ title }: { title?: React.ReactNode } = {}) =>
  render(
    <Drawer.Root open>
      <Drawer.Content>
        <Drawer.DualPane>
          <Drawer.Rail aria-label="Glossary" title={title}>
            <dl>
              <dt>API</dt>
              <dd>Application Programming Interface</dd>
            </dl>
          </Drawer.Rail>
          <Drawer.DualPaneMain>
            <Drawer.Header>
              <Drawer.Title>Main pane title</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <p>Main pane content</p>
            </Drawer.Body>
          </Drawer.DualPaneMain>
        </Drawer.DualPane>
      </Drawer.Content>
    </Drawer.Root>
  )

describe('Drawer dual pane layout', () => {
  test('renders dual-pane structure with independent scroll areas', async () => {
    renderDualPane()

    expect(screen.getByRole('complementary', { name: 'Glossary' })).toBeInTheDocument()
    expect(screen.getByText('Main pane title')).toBeInTheDocument()
    expect(screen.getByText('Main pane content')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getAllByTestId('scroll-area')).toHaveLength(2)
    })
  })
})

describe('Drawer.Rail (generic rail)', () => {
  const renderRail = (railProps: Partial<React.ComponentProps<typeof Drawer.Rail>> = {}) =>
    render(
      <Drawer.Root open>
        <Drawer.Content>
          <Drawer.DualPane>
            <Drawer.Rail aria-label="Glossary" {...railProps}>
              <dl>
                <dt>API</dt>
                <dd>Application Programming Interface</dd>
                <dt>SDK</dt>
                <dd>Software Development Kit</dd>
              </dl>
            </Drawer.Rail>
            <Drawer.DualPaneMain>
              <Drawer.Body>
                <p>Reference glossary while completing the form.</p>
              </Drawer.Body>
            </Drawer.DualPaneMain>
          </Drawer.DualPane>
        </Drawer.Content>
      </Drawer.Root>
    )

  test('renders an aside with the rail chrome class and forwarded aria-label', () => {
    renderRail()

    const rail = screen.getByRole('complementary', { name: 'Glossary' })
    expect(rail.tagName).toBe('ASIDE')
    expect(rail).toHaveClass('cn-drawer-dual-pane-rail')
  })

  test('renders the title heading when title prop is provided', () => {
    renderRail({ title: 'Reference' })

    expect(screen.getByRole('heading', { name: 'Reference' })).toBeInTheDocument()
  })

  test('omits the title heading when title prop is not provided', () => {
    renderRail()

    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })

  test('renders arbitrary children inside the rail body (no enforced list semantics)', () => {
    renderRail({ title: 'Glossary' })

    expect(screen.getByText('Application Programming Interface')).toBeInTheDocument()
    expect(screen.getByText('Software Development Kit')).toBeInTheDocument()
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })
})

describe('Nested drawers inside a dual pane drawer', () => {
  test('a Drawer.Root inside Drawer.DualPaneMain renders as a nested root', () => {
    render(
      <Drawer.Root open>
        <Drawer.Content>
          <Drawer.DualPane>
            <Drawer.Rail aria-label="Pipeline steps">
              <p>Steps</p>
            </Drawer.Rail>
            <Drawer.DualPaneMain>
              <Drawer.Body>
                <Drawer.Root open>
                  <Drawer.Content>
                    <Drawer.Title>Nested from main pane</Drawer.Title>
                  </Drawer.Content>
                </Drawer.Root>
              </Drawer.Body>
            </Drawer.DualPaneMain>
          </Drawer.DualPane>
        </Drawer.Content>
      </Drawer.Root>
    )

    expect(screen.getAllByTestId('drawer-root')).toHaveLength(1)
    expect(screen.getAllByTestId('drawer-nested-root')).toHaveLength(1)
    expect(screen.getByText('Nested from main pane')).toBeInTheDocument()
  })

  test('a Drawer.Root inside Drawer.Rail renders as a nested root', () => {
    render(
      <Drawer.Root open>
        <Drawer.Content>
          <Drawer.DualPane>
            <Drawer.Rail aria-label="Reference">
              <Drawer.Root open>
                <Drawer.Content>
                  <Drawer.Title>Nested from rail</Drawer.Title>
                </Drawer.Content>
              </Drawer.Root>
            </Drawer.Rail>
            <Drawer.DualPaneMain>
              <Drawer.Body>
                <p>Main pane</p>
              </Drawer.Body>
            </Drawer.DualPaneMain>
          </Drawer.DualPane>
        </Drawer.Content>
      </Drawer.Root>
    )

    expect(screen.getAllByTestId('drawer-root')).toHaveLength(1)
    expect(screen.getAllByTestId('drawer-nested-root')).toHaveLength(1)
    expect(screen.getByText('Nested from rail')).toBeInTheDocument()
  })

  test('multiple nesting levels inside a dual pane stack as nested roots', () => {
    render(
      <Drawer.Root open>
        <Drawer.Content>
          <Drawer.DualPane>
            <Drawer.Rail aria-label="Pipeline steps">
              <p>Steps</p>
            </Drawer.Rail>
            <Drawer.DualPaneMain>
              <Drawer.Body>
                <Drawer.Root open>
                  <Drawer.Content>
                    <Drawer.Title>Level 1 nested</Drawer.Title>
                    <Drawer.Body>
                      <Drawer.Root open>
                        <Drawer.Content>
                          <Drawer.Title>Level 2 nested</Drawer.Title>
                        </Drawer.Content>
                      </Drawer.Root>
                    </Drawer.Body>
                  </Drawer.Content>
                </Drawer.Root>
              </Drawer.Body>
            </Drawer.DualPaneMain>
          </Drawer.DualPane>
        </Drawer.Content>
      </Drawer.Root>
    )

    expect(screen.getAllByTestId('drawer-root')).toHaveLength(1)
    expect(screen.getAllByTestId('drawer-nested-root')).toHaveLength(2)
    expect(screen.getByText('Level 1 nested')).toBeInTheDocument()
    expect(screen.getByText('Level 2 nested')).toBeInTheDocument()
  })
})
