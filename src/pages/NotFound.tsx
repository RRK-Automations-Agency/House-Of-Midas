import { Link } from "react-router-dom";
import PageMeta from "@/components/common/PageMeta";
import { getAssetUrl } from "@/lib/utils";

export default function NotFound() {
  const canonicalUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}`
    : '/404';

  return (
    <>
      <PageMeta
        title="Page Not Found | House of Midas"
        description="The requested page could not be found."
        canonicalUrl={canonicalUrl}
        noindex
      />
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background p-6 text-foreground z-1">
        <div className="mx-auto w-full max-w-[242px] text-center sm:max-w-[472px]">
          <h1 className="mb-8 text-title-md font-bold text-primary xl:text-title-2xl">ERROR</h1>

          <img src={getAssetUrl("/images/error/404.svg")} alt="404" />

          <p className="mb-6 mt-10 text-base text-muted-foreground sm:text-lg">
            The page may have been deleted or does not exist. Please check the URL is correct.
          </p>

          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-5 py-3.5 text-sm font-medium text-foreground shadow-theme-xs transition-colors hover:bg-secondary/30 hover:text-primary"
          >
            Back to home
          </Link>
        </div>

        <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()}
        </p>
      </div>
    </>
  );
}
