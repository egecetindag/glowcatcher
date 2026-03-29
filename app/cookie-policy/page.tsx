export default function CookiePolicyPage() {
  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-8 py-4">
      <div>
        <h1 className="font-serif text-3xl font-bold text-on-surface mb-2">Cookie Policy</h1>
        <p className="text-sm text-on-surface-variant">Last updated: March 2025</p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold text-on-surface">1. What Are Cookies</h2>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          Cookies are small text files stored on your device when you visit a website. They help the site remember information about your visit, making your experience smoother and more personalised.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold text-on-surface">2. How We Use Cookies</h2>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          GlowCatcher uses cookies strictly necessary for the platform to function. These include authentication cookies that keep you logged in during your session. We do not use tracking or advertising cookies.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold text-on-surface">3. Essential Cookies</h2>
        <div className="flex flex-col gap-2">
          <div className="bg-surface-container-low rounded-xl p-4 flex flex-col gap-3">
            {[
              { name: "sb-access-token", purpose: "Keeps you signed in to your GlowCatcher account", duration: "Session" },
              { name: "sb-refresh-token", purpose: "Refreshes your authentication session automatically", duration: "7 days" },
            ].map((cookie) => (
              <div key={cookie.name} className="flex flex-col gap-0.5">
                <span className="font-mono text-xs text-on-surface">{cookie.name}</span>
                <span className="text-xs text-on-surface-variant">{cookie.purpose} · {cookie.duration}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-on-surface-variant">
            These cookies are required for the site to work and cannot be disabled.
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold text-on-surface">4. Analytics</h2>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          We use Vercel Analytics to understand how visitors use GlowCatcher. This collects anonymised, aggregated data only — no personal identifiers or cross-site tracking.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold text-on-surface">5. Managing Cookies</h2>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          You can control cookies through your browser settings. Note that disabling essential cookies will prevent you from signing in or using account features. Most browsers allow you to view and delete cookies via their settings or preferences menu.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold text-on-surface">6. Contact</h2>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          If you have any questions about our use of cookies, please contact us at{" "}
          <a href="mailto:hello@glowcatcher.co.uk" className="text-primary hover:underline">
            hello@glowcatcher.co.uk
          </a>.
        </p>
      </section>
    </div>
  );
}
