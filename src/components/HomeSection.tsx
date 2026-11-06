export const HomeSection = () => (
  <section id="home" aria-labelledby="home-heading" className="mx-auto max-w-5xl scroll-mt-24 px-5 py-20 md:px-10 md:py-28">
    <div className="mb-8 flex justify-start border-b border-border pb-8">
      <img
        className="h-auto w-28 bg-foreground p-1"
        src="/logo.svg"
        alt="VicentArt logo"
      />
    </div>
    <h1 id="home-heading" className="mt-5 font-display text-6xl uppercase tracking-wide md:text-7xl">Vicentart</h1>
    <h2 className="mb-12 font-mono text-sm uppercase text-muted-foreground">TATTOO ARTIST</h2>
    <div className="flex flex-col gap-6 text-xl leading-relaxed text-muted-foreground">
      <p className="max-w-prose">
        Location
        <br />
        9117 Little Rd, New Port Richey, FL 34654
        <br />
        ɪ ᴍᴏsᴛʟʏ ᴡᴏʀᴋ ʙʏ ᴀᴘᴘᴏɪɴᴛᴍᴇɴᴛ. You can contact me through my
        instagram, Facebook or send a message to 813-696-1137
      </p>
      <p className="max-w-prose">
        Design Process
        <br />
        ɪ ᴀʟᴡᴀʏs ᴛᴀᴋᴇ ᴍʏ ᴛɪᴍᴇ ᴀɴᴅ ᴇɴᴊᴏʏ ᴛʜᴇ ᴘʀᴏᴄᴇss ᴄʀᴇᴀᴛɪɴɢ ᴀn ᴜɴɪǫᴜᴇ
        ᴘɪᴇᴄᴇ ғᴏʀ ᴇᴀᴄʜ ᴄᴜsᴛᴏᴍᴇʀ, ᴇᴠᴇʀʏᴛʜɪɴɢ ɪs ᴅᴇsɪɢɴᴇᴅ ʙᴇғᴏʀᴇ ʏᴏᴜ ᴀʀʀɪᴠᴇ ᴛᴏ
        ʏᴏᴜʀ ᴀᴘᴘᴏɪɴᴛᴍᴇɴᴛ ᴀɴᴅ sʜᴏᴡɴ ᴛᴏ ʏᴏᴜ ᴏɴ ʏᴏᴜʀ ᴀᴘᴘᴏɪɴᴛᴍᴇɴᴛ ᴅᴀᴛᴇ.
      </p>
      <p className="max-w-prose">
        Deposit
        <br />
        ᴀ ᴅᴇᴘᴏsɪᴛ ɪs ᴀ ᴍᴜsᴛ. ᴛʜᴇ ᴅᴇᴘᴏsɪᴛ ᴡɪʟʟ ʙᴇ ɪɴᴄʟᴜᴅᴇᴅ ɪɴ ʏᴏᴜʀ ᴘʀᴏᴊᴇᴄᴛ
        ᴛᴏᴛᴀʟ ᴘʀɪᴄᴇ. ᴏɴᴄᴇ ᴛʜᴇ ᴅᴇᴘᴏsɪᴛ ɪs ʀᴇᴄᴇɪᴠᴇᴅ, ʏᴏᴜʀ ᴀᴘᴘᴏɪɴᴛᴍᴇɴᴛ ɪs ᴛʜᴇɴ
        ᴄᴏɴғɪʀᴍᴇᴅ. ɪ ᴍᴏsᴛʟʏ ᴜsᴇ Cash app, Zelle, Apple-pay, Venmo ᴀs ᴘᴀʏᴍᴇɴᴛ
        ᴍᴇᴛʜᴏᴅ. ʙᴜᴛ, ʏᴏᴜ ᴄᴀɴ sᴛᴏᴘ ʙʏ ᴛʜᴇ sʜᴏᴘ ᴀɴᴅ ᴘᴀʏ ɪɴ ᴄᴀsʜ ᴀs ᴡᴇʟʟ.
      </p>
      <p>How to book</p>
      <ul className="ml-6 max-w-prose list-disc space-y-1">
        <li>A short description of your idea</li>
        <li>Desired size & placement</li>
        <li>Days of the week or specific dates that work for you</li>
        <li>Budget</li>
      </ul>
      <p>Rescheduling | Cancellations</p>
      <p className="max-w-prose">
        Deposits are non-refundable and a second deposit will be required if you
        want to change your appointment day. Please be sure you can make it
        before booking.
      </p>
    </div>
  </section>
)
