export default {
  '.cn-drawer': {
    '&-content': {
      userSelect: 'auto !important',
      backgroundColor: 'var(--cn-bg-1)',
      borderColor: 'var(--cn-border-3)',
      borderRadius: 'var(--cn-drawer-radius)',
      boxShadow: 'var(--cn-shadow-5)',
      overflow: 'hidden',
      outline: 'none',
      // Cap content at the viewport so a drawer never overflows the screen, regardless
      // of `size` or layout. Originally added to keep dual-pane drawers usable on small
      // viewports (the dual pane behaves like `size="full"` once the chosen size exceeds
      // 100vw / 100vh), but applies to all drawers because a drawer larger than the
      // viewport is broken UX in any context.
      maxWidth: '100vw',
      maxHeight: '100vh',
      '@apply fixed flex flex-col z-50 border': '',

      '&:where(.cn-drawer-content-right), &:where(.cn-drawer-content-left)': {
        '@apply inset-y-0 !h-auto': '',

        '&:where(.cn-drawer-content-2xs)': {
          width: 'var(--cn-drawer-2xs)'
        },
        '&:where(.cn-drawer-content-xs)': {
          width: 'var(--cn-drawer-xs)'
        },
        '&:where(.cn-drawer-content-sm)': {
          width: 'var(--cn-drawer-sm)'
        },
        '&:where(.cn-drawer-content-md)': {
          width: 'var(--cn-drawer-md)'
        },
        '&:where(.cn-drawer-content-lg)': {
          width: 'var(--cn-drawer-lg)'
        },
        '&:where(.cn-drawer-content-xl)': {
          width: 'var(--cn-drawer-xl)'
        },
        '&:where(.cn-drawer-content-full)': {
          width: 'var(--cn-drawer-full)'
        }
      },

      '&:where(.cn-drawer-content-top), &:where(.cn-drawer-content-bottom)': {
        '@apply inset-x-0 !w-auto': '',

        '&:where(.cn-drawer-content-2xs)': {
          height: 'var(--cn-drawer-2xs)'
        },
        '&:where(.cn-drawer-content-xs)': {
          height: 'var(--cn-drawer-xs)'
        },
        '&:where(.cn-drawer-content-sm)': {
          height: 'var(--cn-drawer-sm)'
        },
        '&:where(.cn-drawer-content-md)': {
          height: 'var(--cn-drawer-md)'
        },
        '&:where(.cn-drawer-content-lg)': {
          height: 'var(--cn-drawer-lg)'
        },
        '&:where(.cn-drawer-content-xl)': {
          height: 'var(--cn-drawer-xl)'
        },
        '&:where(.cn-drawer-content-full)': {
          height: 'var(--cn-drawer-full)'
        }
      },

      '&:where(.cn-drawer-content-right)': {
        '@apply border-r-0 rounded-r-cn-none right-0': ''
      },

      '&:where(.cn-drawer-content-left)': {
        '@apply border-l-0 rounded-l-cn-none left-0': ''
      },

      '&:where(.cn-drawer-content-top)': {
        '@apply border-t-0 rounded-t-cn-none top-0': ''
      },

      '&:where(.cn-drawer-content-bottom)': {
        '@apply border-b-0 rounded-b-cn-none bottom-0': ''
      },

      '&[data-vaul-drawer]:not([data-vaul-custom-container=true])::after': {
        display: 'none'
      }
    },

    '&-close-button': {
      '&-icon': {
        flexShrink: '0',
        width: `var(--cn-icon-size-sm)`,
        height: `var(--cn-icon-size-sm)`
      }
    },

    '&-backdrop': {
      backgroundColor: 'var(--cn-comp-dialog-backdrop)',
      '@apply fixed inset-0 z-50': '',

      '&-nested': {
        backgroundColor: 'var(--cn-comp-dialog-backdrop-nested)'
      }
    },

    '&-header': {
      borderBottomWidth: 'var(--cn-border-width-1)',
      borderBottomColor: 'var(--cn-border-3)',
      gap: 'var(--cn-drawer-gap)',
      padding: 'var(--cn-drawer-container)',
      '@apply flex flex-col border-b': '',

      '&-icon': {
        flexShrink: '0'
      },

      '&-icon-color': {
        color: 'var(--cn-text-2)'
      },

      '&-top': {
        gap: 'var(--cn-spacing-2-half)',
        '@apply flex items-center': ''
      },

      '&-title': {
        '@apply flex flex-col': ''
      }
    },

    '&-title': {
      font: 'var(--cn-comp-dialog-title)',
      color: 'var(--cn-text-1)',
      wordBreak: 'break-word'
    },

    '&-tagline': {
      font: 'var(--cn-caption-light)',
      color: 'var(--cn-text-2)'
    },

    '&-description': {
      font: 'var(--cn-body-normal)',
      color: 'var(--cn-text-2)'
    },

    '&-body': {
      '@apply size-full': '',

      '&-content': {
        padding: 'var(--cn-drawer-container)',
        overflowX: 'clip'
      }
    },

    '&-body-wrap': {
      '@apply flex-1 overflow-hidden relative before:absolute before:inset-x-0 before:top-0 before:z-10 after:z-10 after:absolute after:inset-x-0 after:bottom-0':
        '',

      '&:before': {
        height: 'var(--cn-drawer-fade-height)',
        background: 'var(--cn-comp-dialog-fade-start)',
        pointerEvents: 'none'
      },

      '&:after': {
        height: 'var(--cn-drawer-fade-height)',
        background: 'var(--cn-comp-dialog-fade-end)',
        pointerEvents: 'none'
      },

      '&:where(.cn-drawer-body-wrap-top)': {
        '@apply before:hidden': ''
      },

      '&:where(.cn-drawer-body-wrap-bottom)': {
        '@apply after:hidden': ''
      }
    },

    '&-footer': {
      borderTopWidth: 'var(--cn-border-width-1)',
      borderTopColor: 'var(--cn-border-3)',
      gap: 'var(--cn-drawer-gap)',
      padding: 'var(--cn-drawer-container)',
      '@apply flex flex-col border-t': ''
    },

    '&-dual-pane': {
      '--cn-drawer-dual-pane-rail-width': '19.125rem',
      '--cn-drawer-dual-pane-main-min-width': 'var(--cn-drawer-xs)',
      width: '100%',
      minWidth: '0',
      '@apply flex min-h-0 w-full min-w-0 flex-1 flex-row overflow-x-auto overflow-y-hidden': ''
    },

    '&-dual-pane-rail': {
      width: 'var(--cn-drawer-dual-pane-rail-width)',
      minWidth: 'var(--cn-drawer-dual-pane-rail-width)',
      maxWidth: 'var(--cn-drawer-dual-pane-rail-width)',
      flexShrink: '0',
      backgroundColor: 'var(--cn-bg-2)',
      borderRightWidth: 'var(--cn-border-width-1)',
      borderRightColor: 'var(--cn-border-3)',
      '@apply flex min-h-0 flex-col overflow-hidden border-r': ''
    },

    '&-dual-pane-rail-header': {
      borderBottomWidth: 'var(--cn-border-width-1)',
      borderBottomColor: 'var(--cn-border-3)',
      padding: 'var(--cn-drawer-container) var(--cn-drawer-container) var(--cn-drawer-container) var(--cn-spacing-8)',
      flexShrink: '0',
      '@apply flex flex-col border-b': '',

      '&:where(.cn-drawer-dual-pane-rail-header-at-top)': {
        borderBottomColor: 'transparent'
      }
    },

    '&-dual-pane-rail-header-title': {
      font: 'var(--cn-heading-section)',
      letterSpacing: 'var(--cn-tracking-tight)',
      color: 'var(--cn-text-1)',
      margin: '0',
      wordBreak: 'break-word'
    },

    '&-dual-pane-rail-body': {
      '@apply flex-1 min-h-0': ''
    },

    '&-dual-pane-rail-content': {
      padding: '0 var(--cn-drawer-container) var(--cn-drawer-container)'
    },

    '&-dual-pane-main': {
      minWidth: 'var(--cn-drawer-dual-pane-main-min-width)',
      '@apply flex min-h-0 flex-1 flex-col overflow-hidden': ''
    },

    '&-header-v2': {
      borderBottomWidth: 'var(--cn-border-width-1)',
      borderBottomColor: 'var(--cn-border-3)',
      padding: 'var(--cn-drawer-container)',
      '@apply flex flex-col border-b': '',
      gap: 'var(--cn-spacing-3)',

      '&-title-row': {
        '@apply flex items-start': '',
        gap: 'var(--cn-spacing-2)'
      },

      '&-icon': {
        '@apply shrink-0': ''
      },

      '&-metadata': {
        paddingTop: 'var(--cn-spacing-1)'
      },

      '&-tabs': {
        marginTop: 'calc(-1 * var(--cn-spacing-3))',
        marginBottom: 'calc(-1 * var(--cn-drawer-container))'
      }
    }
  }
}
