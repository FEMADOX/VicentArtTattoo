const siteStyles = {
  preview: 'min-h-dvh bg-background font-body text-left text-lg leading-relaxed text-foreground [&_section]:min-h-0 [&_img]:block [&_img]:max-w-full [&_:is(main,section,[id])]:scroll-mt-[calc(var(--design-header-height)+1.5rem)] [&_main:focus]:outline-none [&_address]:not-italic [&_svg]:shrink-0',
  container: 'mx-auto w-full max-w-7xl px-5 md:px-8 xl:px-10',
  section: 'py-16 md:py-24 xl:py-30',
  heading: 'font-display text-[clamp(2rem,3.6vw,3.5rem)] leading-tight font-normal tracking-wide uppercase',
  copy: 'max-w-[70ch] text-lg leading-relaxed text-body',
  eyebrow: 'mb-4 font-mono text-xs text-muted-foreground',
  sectionIntro: 'mb-12 [&_p:not(:first-child)]:mt-4 max-[720px]:mb-8',
  textLink: 'inline-flex min-h-11 items-center gap-2 font-mono text-xs leading-relaxed text-link underline-offset-4 transition-colors duration-150 hover:text-foreground hover:underline',
  panel: 'border border-border bg-card p-8 [&_:is(h2,h3)]:mb-4 [&_:is(h2,h3)]:text-2xl max-[1000px]:p-6',
  brand: 'inline-flex min-h-11 items-center gap-3 font-display text-2xl font-normal tracking-wide text-foreground [&_img]:size-11 [&_img]:rounded-full [&_img]:bg-primary [&_img]:p-1',
  policy: 'border border-border p-6 text-base leading-relaxed text-body [&_strong]:font-normal [&_strong]:text-foreground [&_p]:mt-2',
  checklist: 'mt-6 grid list-none gap-4 p-0 [&_li]:flex [&_li]:items-start [&_li]:gap-3 [&_li]:text-lg [&_svg]:mt-1 [&_svg]:text-muted-foreground',
  profession: 'mt-3 font-display text-2xl text-body'
}

export default siteStyles
