export const metadata = {
  title: "Privacy Policy – SOS24ORE Chat Assistant",
  description:
    "Full privacy information for the SOS24ORE.it chat assistant, in compliance with EU GDPR.",
};

export default function PrivacyChatPageEN() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10 text-zinc-100">
      <h1 className="text-2xl font-bold text-emerald-400 mb-4">
        Privacy Policy – SOS24ORE.it Chat Assistant
      </h1>

      <p className="mb-4 text-zinc-300">
        In accordance with EU Regulation 2016/679 (“GDPR”) and Legislative
        Decree 196/2003, SOS24ORE.it informs users that any personal data
        provided through the automated chat assistant is processed lawfully,
        fairly, and transparently.
      </p>

      <h2 className="text-lg font-semibold text-emerald-300 mt-6">
        1. Data Controller
      </h2>
      <p className="text-zinc-300">
        The data controller is <strong>SOS24ORE S.r.l.</strong>, headquartered
        in [LEGAL ADDRESS], e-mail:{" "}
        <a
          href="mailto:info@sos24ore.it"
          className="text-emerald-400 underline"
        >
          info@sos24ore.it
        </a>
        .
      </p>

      <h2 className="text-lg font-semibold text-emerald-300 mt-6">
        2. Purpose and Legal Basis
      </h2>
      <p className="text-zinc-300">
        Data voluntarily provided via chat (text, photos, or contact
        information) is used solely for the following purposes:
      </p>
      <ul className="list-disc list-inside text-zinc-300">
        <li>Providing preliminary information about SOS24ORE services;</li>
        <li>Assessing the type of technical intervention required;</li>
        <li>
          Forwarding the request to a human operator, with the user’s explicit
          consent.
        </li>
      </ul>

      <h2 className="text-lg font-semibold text-emerald-300 mt-6">
        3. Processing Method
      </h2>
      <p className="text-zinc-300">
        Processing is carried out digitally and automatically via an AI
        assistant. Messages are anonymized and not stored beyond what is
        necessary to manage the conversation. Any uploaded images are deleted
        immediately after analysis.
      </p>

      <h2 className="text-lg font-semibold text-emerald-300 mt-6">
        4. Data Types
      </h2>
      <p className="text-zinc-300">
        The assistant may temporarily process: free-text messages, descriptions
        of issues, district or area, uploaded images, and — only if provided —
        name and contact details.
      </p>

      <h2 className="text-lg font-semibold text-emerald-300 mt-6">
        5. Data Retention
      </h2>
      <p className="text-zinc-300">
        Data is not permanently stored. Relevant details for service management
        are securely transferred to a human operator and handled according to
        internal data protection policies.
      </p>

      <h2 className="text-lg font-semibold text-emerald-300 mt-6">
        6. Communication and Recipients
      </h2>
      <p className="text-zinc-300">
        Data may be shared exclusively with authorized personnel or technical
        partners assigned to manage field interventions.
      </p>

      <h2 className="text-lg font-semibold text-emerald-300 mt-6">
        7. User Rights
      </h2>
      <p className="text-zinc-300">
        Users may exercise their rights under Articles 15–22 of the GDPR
        (access, rectification, deletion, restriction, objection) by contacting{" "}
        <a
          href="mailto:privacy@sos24ore.it"
          className="text-emerald-400 underline"
        >
          privacy@sos24ore.it
        </a>
        .
      </p>

      <h2 className="text-lg font-semibold text-emerald-300 mt-6">
        8. Security
      </h2>
      <p className="text-zinc-300">
        SOS24ORE adopts adequate technical and organizational measures to
        protect data from unauthorized access or misuse.
      </p>

      <h2 className="text-lg font-semibold text-emerald-300 mt-6">
        9. Updates
      </h2>
      <p className="text-zinc-300">
        This policy may be updated at any time. The latest version is always
        available on this page.
      </p>

      <p className="mt-8 text-sm text-zinc-500">
        Last update: {new Date().toLocaleDateString("en-GB")}
      </p>
    </main>
  );
}
