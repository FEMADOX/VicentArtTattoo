import { designStyles } from '../designs/styles'
import { cn } from '../lib/utils'
import { Skeleton } from './ui/skeleton'

export function ContentSkeleton ({ view = 'components' }: { view?: string }) {
  const study = view === 'ink-study'
  const components = view === 'components'
  const portfolio = view === 'c-portfolio'
  const contact = view === 'c-contact'

  return (
    <>
      <p className="sr-only" role="status">{study ? 'Loading ink animation study...' : 'Loading content...'}</p>
      <main id="main-content" tabIndex={-1} aria-busy="true" data-loading-skeleton={view} className={cn(designStyles.container, 'min-h-dvh py-12')}>
        <div aria-hidden="true" className="flex flex-col gap-12">
          <div className="flex max-w-3xl flex-col gap-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-5/6" />
          </div>
          {components
            ? (
                <div className="flex flex-col gap-10">
                  <Skeleton className="h-8 w-32" />
                  {[0, 1].map(row => (
                    <div key={row} className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
                      {[0, 1, 2, 3, 4].map(column => (
                        <div key={column} className="flex flex-col gap-3">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-11 w-full max-w-40 rounded-full" />
                        </div>
                      ))}
                    </div>
                  ))}
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-40 w-full" />
                </div>
              )
            : (
                <div className={cn('grid gap-8 max-[720px]:grid-cols-1', portfolio ? 'grid-cols-3' : 'grid-cols-2')}>
                  {(study ? [0, 1] : portfolio ? [0, 1, 2] : [0]).map(item => (
                    <div key={item} className="flex min-w-0 flex-col gap-5">
                      {study ? <Skeleton className="h-8 w-2/3" /> : null}
                      <Skeleton className={cn('w-full', contact ? 'h-64' : 'aspect-3/4')} />
                      <Skeleton className="h-4 w-3/4" />
                      {study ? <Skeleton className="h-11 w-40 rounded-full" /> : null}
                    </div>
                  ))}
                  {!study && !portfolio
                    ? (
                        <div className="flex flex-col justify-center gap-6">
                          <Skeleton className="h-12 w-3/4" />
                          <Skeleton className="h-5 w-full" />
                          <Skeleton className="h-5 w-5/6" />
                          <Skeleton className="h-5 w-2/3" />
                          <Skeleton className="mt-4 h-11 w-48 rounded-full" />
                        </div>
                      )
                    : null}
                </div>
              )}
        </div>
      </main>
    </>
  )
}

export function CatalogSkeleton () {
  return (
    <div>
      <div aria-hidden="true" className="flex flex-wrap items-center justify-between gap-6 border-b border-border px-4 py-5 sm:px-8">
        <div className="flex max-w-full flex-col gap-3">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <Skeleton className="h-11 w-64 max-w-full" />
      </div>
      <ContentSkeleton view={new URLSearchParams(window.location.search).get('view') ?? 'components'} />
    </div>
  )
}
