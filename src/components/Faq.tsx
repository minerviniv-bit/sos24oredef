export default function Faq({ items }:{items:{q:string;a:string}[]}) {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Domande frequenti</h2>
      <div className="divide-y divide-neutral-800 rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900/50">
        {items.map((it, i) => (
          <details key={i} className="p-5 open:bg-neutral-900">
            <summary className="cursor-pointer text-white font-semibold">{it.q}</summary>
            <p className="text-neutral-300 mt-2">{it.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

