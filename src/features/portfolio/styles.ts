const portfolioStyles = {
  lightbox: 'h-[min(92dvh,960px)] max-w-4xl grid-rows-[auto_minmax(0,1fr)_auto] gap-4 p-4 sm:p-6 min-[480px]:[@media(height<=500px)]:grid-cols-[minmax(0,1fr)_minmax(16rem,0.65fr)] min-[480px]:[@media(height<=500px)]:grid-rows-[auto_minmax(0,1fr)] min-[480px]:[@media(height<=500px)]:gap-3 min-[480px]:[@media(height<=500px)]:p-4',
  lightboxHeader: 'grid min-h-20 grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:min-h-11 min-[480px]:[@media(height<=500px)]:col-span-full min-[480px]:[@media(height<=500px)]:min-h-11',
  lightboxFrame: 'relative min-h-0 min-w-0 overflow-y-auto bg-background',
  lightboxImage: 'absolute inset-0 size-full object-contain',
  lightboxFooter: 'grid gap-3 min-[480px]:[@media(height<=500px)]:self-end',
  lightboxCaption: 'min-h-16 text-center font-mono text-xs/5 text-muted-foreground',
  lightboxControls: 'grid min-h-11 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2',
  artwork: 'group/artwork block w-full overflow-hidden border border-border bg-card p-0 text-left text-foreground transition-colors duration-150 hover:border-input focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring',
  artworkImage: 'aspect-3/4 w-full bg-background object-contain',
  artworkCaption: 'flex min-h-20 flex-wrap items-center justify-between gap-3 p-4 font-mono text-xs text-muted-foreground [&>span:last-child]:flex [&>span:last-child]:items-center [&>span:last-child]:gap-2 [&>span:last-child]:text-foreground'
}

export default portfolioStyles
