import { HelmetProvider, Helmet } from "react-helmet-async";
import { TooltipProvider } from "@/components/ui/tooltip";

type PageMetaProps = {
  title: string;
  description?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "product";
  twitterCard?: "summary" | "summary_large_image";
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
};

const PageMeta = ({
  title,
  description,
  canonicalUrl,
  ogTitle,
  ogDescription,
  ogImage,
  ogType = "website",
  twitterCard = "summary_large_image",
  noindex = false,
  jsonLd,
}: PageMetaProps) => (
  <Helmet>
    <title>{title}</title>
    {description ? <meta name="description" content={description} /> : null}
    {canonicalUrl ? <link rel="canonical" href={canonicalUrl} /> : null}

    <meta property="og:title" content={ogTitle || title} />
    {description || ogDescription ? (
      <meta property="og:description" content={ogDescription || description || ""} />
    ) : null}
    {canonicalUrl ? <meta property="og:url" content={canonicalUrl} /> : null}
    <meta property="og:type" content={ogType} />
    {ogImage ? <meta property="og:image" content={ogImage} /> : null}

    <meta name="twitter:card" content={twitterCard} />
    <meta name="twitter:title" content={ogTitle || title} />
    {description || ogDescription ? (
      <meta name="twitter:description" content={ogDescription || description || ""} />
    ) : null}
    {ogImage ? <meta name="twitter:image" content={ogImage} /> : null}

    {noindex ? <meta name="robots" content="noindex,nofollow" /> : null}
    {jsonLd ? <script type="application/ld+json">{JSON.stringify(jsonLd)}</script> : null}
  </Helmet>
);

export const AppWrapper = ({ children }: { children: React.ReactNode }) => (
  <HelmetProvider>
    <TooltipProvider>
      {children}
    </TooltipProvider>
  </HelmetProvider>
);

export default PageMeta;
