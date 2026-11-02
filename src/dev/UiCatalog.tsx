import { useEffect, useState, type MouseEvent } from 'react'
import App from '../App'
import { DesignFrame } from '../designs/DesignApp'
import SinglePageDesign from '../designs/SinglePageDesign'
import MultiPageDesign from '../designs/MultiPageDesign'
import InkStudyPage from '../designs/InkStudyPage'
import ComponentShowcase from './ComponentShowcase'

const views = [
  ['components', 'Components'],
  ['a', 'Design A'],
  ['b', 'Design B'],
  ['c-home', 'Design C / Home'],
  ['c-portfolio', 'Design C / Portfolio'],
  ['c-about', 'Design C / About'],
  ['c-contact', 'Design C / Contact'],
  ['legacy', 'Legacy App'],
  ['ink-study', 'Ink study']
] as const
type View = typeof views[number][0]

function readSelection () {
  const requested = new URLSearchParams(window.location.search).get('view')
  const view = views.find(([value]) => value === requested)?.[0] ?? 'components'
  return { view, hash: window.location.hash }
}

function Preview ({ view }: { view: View }) {
  if (view === 'legacy') return <App />
  const content = view === 'components'
    ? <ComponentShowcase />
    : view === 'a' || view === 'b'
      ? <SinglePageDesign design={view} />
      : view === 'ink-study'
        ? <InkStudyPage />
        : <MultiPageDesign page={view === 'c-home' ? 'home' : view === 'c-portfolio' ? 'portfolio' : view === 'c-about' ? 'about' : 'contact'} />
  return <DesignFrame key={view} home animated>{content}</DesignFrame>
}

function isPlainClick (event: MouseEvent<HTMLDivElement>) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey
}

function catalogLinkSelection (destination: URL, currentView: View) {
  const cRoute = /^\/designs\/c(?:\/(portfolio|about|contact))?\/?$/.exec(destination.pathname)
  if (cRoute) {
    const requested = 'c-' + (cRoute[1] || 'home')
    const view = views.find(([value]) => value === requested)?.[0]
    return view ? { view, hash: destination.hash } : null
  }
  if (!currentView.startsWith('c-') || destination.pathname !== window.location.pathname) return null
  const section = destination.hash.slice(1)
  if (document.getElementById(section)) return null
  const requested = 'c-' + section.replace(/^process$/, 'about')
  const view = views.find(([value]) => value === requested)?.[0]
  return view ? { view, hash: destination.hash } : null
}

export default function UiCatalog () {
  const [selection, setSelection] = useState(readSelection)

  useEffect(() => {
    const previousTitle = document.title
    const existing = document.querySelector<HTMLMetaElement>('meta[name="robots"]')
    const previousContent = existing?.content
    const robots = existing ?? document.createElement('meta')
    robots.name = 'robots'
    robots.content = 'noindex, nofollow'
    if (!existing) document.head.append(robots)
    document.title = 'UI catalog | VicentArt'
    const onPopState = () => setSelection(readSelection())
    window.addEventListener('popstate', onPopState)
    return () => {
      window.removeEventListener('popstate', onPopState)
      document.title = previousTitle
      if (previousContent !== undefined) robots.content = previousContent
      else robots.remove()
    }
  }, [])

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(selection.hash.slice(1))
      if (target) target.scrollIntoView()
      else window.scrollTo(0, 0)
    })
    return () => cancelAnimationFrame(frame)
  }, [selection])

  function selectView (view: View, hash = '') {
    window.history.pushState(null, '', window.location.pathname + '?view=' + view + hash)
    setSelection({ view, hash })
  }

  function retainCatalogRoute (event: MouseEvent<HTMLDivElement>) {
    if (!isPlainClick(event) || !(event.target instanceof Element)) return
    const link = event.target.closest<HTMLAnchorElement>('a[href]')
    if (!link || link.target === '_blank' || link.hasAttribute('download')) return
    const destination = new URL(link.href, window.location.href)
    if (destination.origin !== window.location.origin) return
    const next = catalogLinkSelection(destination, selection.view)
    if (!next) return
    event.preventDefault()
    selectView(next.view, next.hash)
  }

  return (
    <div data-ui-catalog="">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-background px-4 py-5 text-foreground sm:px-8">
        <div><p className="text-xl font-medium">UI catalog</p><p className="mt-1 text-sm text-muted-foreground">Development only. Compare the existing views and interact with the shared controls.</p></div>
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <label className="text-sm" htmlFor="catalog-view">Preview</label>
          <select id="catalog-view" className="min-h-11 max-w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" value={selection.view} onChange={event => selectView(views.find(([value]) => value === event.currentTarget.value)?.[0] ?? 'components')}>
            {views.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
          <a className="inline-flex min-h-11 items-center text-sm underline underline-offset-4" href="/">Public site</a>
        </div>
      </header>
      <div data-catalog-preview={selection.view} onClickCapture={retainCatalogRoute}><Preview view={selection.view} /></div>
    </div>
  )
}
