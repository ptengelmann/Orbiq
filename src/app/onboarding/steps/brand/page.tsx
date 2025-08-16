import { generateBrandKit } from "./actions";

export default function BrandStep() {
  return (
    <main className="mx-auto max-w-xl px-6 py-12">
      <h1 className="text-2xl font-semibold">Create your Brand Kit</h1>
      <p className="mt-2 text-sm text-gray-600">We’ll use this to generate your media kit.</p>

      <form action={generateBrandKit} className="mt-6 grid gap-4 rounded-lg border p-4">
        <div>
          <label className="block text-sm font-medium">Brand name (optional)</label>
          <input name="brandName" placeholder="Orbiq" className="mt-1 w-full rounded-md border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Vibe / Style</label>
          <textarea name="vibe" placeholder="Bold, modern, minimal, confident..." className="mt-1 w-full rounded-md border px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Audience</label>
          <input name="audience" placeholder="Gen Z creators, fitness fans..." className="mt-1 w-full rounded-md border px-3 py-2" required />
        </div>
        <button className="rounded-md bg-black px-4 py-2 text-white hover:opacity-90">Generate & Continue</button>
      </form>
    </main>
  );
}
