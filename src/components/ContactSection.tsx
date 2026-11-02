export const ContactSection = () => (
  <section id="contact" aria-labelledby="contact-heading" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-20 md:px-10 md:py-28">
    <h2 id="contact-heading" className="mb-10 font-display text-4xl uppercase tracking-wide md:text-5xl">Contact</h2>
    <div className="grid gap-8 md:grid-cols-2">
      <p className="text-2xl">You can contact me through</p>
      <ul className="space-y-3 text-xl">
        <li><a className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-muted-foreground" href="https://www.instagram.com/vicentart/">Instagram: @vicentart</a></li>
        <li><a className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-muted-foreground" href="https://www.facebook.com/vicentartattoo">Facebook: vicentartattoo</a></li>
        <li><a className="inline-flex min-h-11 items-center break-all underline underline-offset-4 hover:text-muted-foreground" href="mailto:vicentartattoo@gmail.com">Email: vicentartattoo@gmail.com</a></li>
        <li><a className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-muted-foreground" href="https://wa.me/18136961137">Whatsapp: 813-696-1137</a></li>
      </ul>
    </div>
  </section>
)
