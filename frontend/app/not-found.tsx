import { LinkButton } from "@/components/link-button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#12141f] px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-[#6dbf8f]">404</p>
      <h1 className="mt-3 text-3xl font-semibold text-white">Page not found</h1>
      <p className="mt-2 max-w-md text-[#a0a8b8]">
        The page you requested does not exist or may have been moved.
      </p>
      <LinkButton href="/" className="mt-6 bg-[#6dbf8f] text-[#0d1a14] hover:bg-[#5aad7d]">
        Return Home
      </LinkButton>
    </div>
  );
}
