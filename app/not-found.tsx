import Link from "next/link";
import SevenEight from "@/components/SevenEight";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl py-10 text-center">
      <p className="label">404</p>
      <h1 className="display mt-2 text-3xl">No such residue.</h1>
      <p className="mt-3 text-sm text-fg-2">The address resolves to nothing in the catalog. The sequencer below counts in seven while you decide where to go.</p>
      <div className="mt-8">
        <SevenEight />
      </div>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/compounds" className="btn btn-primary">compounds</Link>
        <Link href="/" className="btn">home</Link>
      </div>
    </div>
  );
}
