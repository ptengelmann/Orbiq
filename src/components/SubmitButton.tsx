"use client";
import { useFormStatus } from "react-dom";

export default function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-white hover:opacity-90 disabled:opacity-60"
    >
      {pending ? "Generating…" : children}
    </button>
  );
}
