import { useRef, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { tattooVideoStudies } from './tattoo-video-studies'
import { videoStudies } from './ink-video-studies'
import { artworks } from './content'
import { gorillaSketch, owlSketch } from './ink-sketches'
import { gorillaFill, owlFill } from './ink-fill-paths'
import { INK_DURATION } from './ink-timeline'
import TattooDrawReveal from './TattooDrawReveal'
import { designStyles } from './styles'

const styles = {
  page: 'py-[clamp(3rem,6vw,6rem)]',
  heading: 'mb-[clamp(2.5rem,5vw,4rem)] max-w-3xl [&_h1]:mb-5 [&_h1]:text-[clamp(2.25rem,5vw,4.5rem)] [&_h1]:font-normal [&_h1]:tracking-wide',
  studies: 'grid grid-cols-2 items-start gap-[clamp(2rem,4vw,4rem)] [@media(width<=720px)]:grid-cols-1 [@media(width<=720px)]:gap-12',
  study: 'min-w-0',
  studyHeading: 'mb-5 [&_h2]:mb-2 [&_h2]:text-[clamp(1.5rem,2.4vw,2rem)] [&_h2]:font-normal'
}

export default function InkStudyPage () {
  const startedStudies = useRef(new Set<string>())
  const [selection, setSelection] = useState({ id: tattooVideoStudies[0].id, initialComplete: false })

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className={`${designStyles.container} ${styles.page}`}
    >
      <header className={styles.heading}>
        <h1>Ink animation study</h1>
        <p className={designStyles.copy}>
          Watch the contours, shading and color build, then move across the
          finished piece to explore the views recorded on camera. The drawing takes {INK_DURATION}
          {' '}seconds at normal speed. This is a visual study, not a recreation
          of the tattooing process.
        </p>
      </header>
      <section className="mb-20" aria-labelledby="video-studies-heading">
        <header className={styles.studyHeading}>
          <h2 id="video-studies-heading">Explore the recorded views</h2>
          <p className={designStyles.copy}>Original footage, edited from left to right. Some views blend between takes; the range follows what was filmed.</p>
        </header>
        <Tabs value={selection.id} onValueChange={id => setSelection({ id, initialComplete: startedStudies.current.has(id) })} className="max-w-2xl">
          <TabsList aria-label="Video tattoo studies" className="grid h-auto w-full grid-cols-2 gap-1 sm:grid-cols-4">
            {tattooVideoStudies.map(study => <TabsTrigger key={study.id} value={study.id} className="min-h-11">{study.label}</TabsTrigger>)}
          </TabsList>
          {tattooVideoStudies.map(study => (
            <TabsContent key={study.id} value={study.id}>
              <TattooDrawReveal image={study.image} video={study.video} drawingUrl={study.drawingUrl} initialComplete={selection.id === study.id && selection.initialComplete} onAnimationStart={() => startedStudies.current.add(study.id)} />
            </TabsContent>
          ))}
        </Tabs>
      </section>
      <p className="mb-8 max-w-3xl text-lg text-body">Earlier frame sequences and the gorilla and owl photograph studies remain below.</p>
      <div className={styles.studies}>
        {videoStudies.map(study => (
          <section key={study.id} aria-labelledby={study.id + '-study-heading'} className={styles.study}>
            <header className={styles.studyHeading}>
              <h2 id={study.id + '-study-heading'}>{study.title}</h2>
              <p className={designStyles.copy}>After the drawing finishes, move the pointer or drag to explore the recorded views.</p>
            </header>
            <TattooDrawReveal image={study.image} paths={study.paths} fill={study.fill} sequence={study.sequence} />
          </section>
        ))}
        <section aria-labelledby="gorilla-study-heading" className={styles.study}>
          <header className={styles.studyHeading}>
            <h2 id="gorilla-study-heading">Gorilla and mountain</h2>
            <p className={designStyles.copy}>Face, landscape and riders.</p>
          </header>
          <TattooDrawReveal image={artworks[0]} paths={gorillaSketch} fill={gorillaFill} />
        </section>
        <section aria-labelledby="owl-study-heading" className={styles.study}>
          <header className={styles.studyHeading}>
            <h2 id="owl-study-heading">Owl eye</h2>
            <p className={designStyles.copy}>The eye and surrounding feathers.</p>
          </header>
          <TattooDrawReveal image={artworks[6]} paths={owlSketch} fill={owlFill} />
        </section>
      </div>
    </main>
  )
}
