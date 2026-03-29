export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-8 py-4">
      <div>
        <h1 className="font-serif text-3xl font-bold text-on-surface mb-2">Privacy Policy</h1>
        <p className="text-sm text-on-surface-variant">Last updated: March 2025</p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold text-on-surface">1. Information We Collect</h2>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          We collect information you provide directly to us, such as your email address and username when you create an account. We also collect information about the deals you submit and interact with on the platform.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold text-on-surface">2. How We Use Your Information</h2>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          We use the information we collect to operate and improve GlowCatcher, send you service-related communications, and personalise your experience. We do not sell your personal data to third parties.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold text-on-surface">3. Data Storage</h2>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          Your data is stored securely using Supabase infrastructure. We retain your account data for as long as your account is active. You may request deletion of your account and associated data at any time by contacting us.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold text-on-surface">4. Third-Party Services</h2>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          We use third-party services including Supabase (database and authentication) and Vercel (hosting and analytics). These services may collect anonymised usage data in accordance with their own privacy policies.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold text-on-surface">5. Your Rights</h2>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          Under UK GDPR, you have the right to access, correct, or delete your personal data. You also have the right to restrict or object to certain processing. To exercise any of these rights, please contact us.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold text-on-surface">6. Contact</h2>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          If you have any questions about this Privacy Policy, please contact us at{" "}
          <a href="mailto:hello@glowcatcher.co.uk" className="text-primary hover:underline">
            hello@glowcatcher.co.uk
          </a>.
        </p>
      </section>
    </div>
  );
}
