import { siteConfig } from "@/lib/site"

const organizationId = `${siteConfig.url}/#organization`
const websiteId = `${siteConfig.url}/#website`

const faqs = [
  {
    question: "What does Jazora actually run on a trip?",
    answer:
      "We design the route and operate it. That covers international flights, hotels or ryokan, ground transport, local guides, and a trip desk you can reach while you are abroad. Meals are included where the itinerary says so.",
  },
  {
    question: "Do you run group trips and private journeys?",
    answer:
      "Both. Group departures are fixed dates with a small group, usually 8 to 14 travelers. Private journeys use the same operators and guides, scheduled around your dates and pace.",
  },
  {
    question: "How do visas and entry rules work?",
    answer:
      "We tell you what your passport needs for each country on the route and help you prepare the paperwork. You submit the application in your own name. If a rule changes before departure, the trip desk updates you.",
  },
  {
    question: "What is included in the price?",
    answer:
      "The listed price is per person and covers the international flights on the itinerary, accommodations, planned transport, and guiding. Optional experiences and most dinners are called out before you reserve.",
  },
  {
    question: "Is there support once we have left?",
    answer:
      "Yes. A local lead travels with the group or meets you on arrival, and the Jazora desk is staffed around the clock for delays, medical issues, and itinerary changes.",
  },
  {
    question: "What if I need to cancel?",
    answer:
      "Each departure lists its cancellation window. Cancel before that date for a refund minus the planning fee. After that, we rebook you onto a later departure when seats remain, or apply the travel cover you chose at booking.",
  },
]

export function JsonLd() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["TravelAgency", "Organization"],
        "@id": organizationId,
        name: siteConfig.name,
        alternateName: siteConfig.shortName,
        url: siteConfig.url,
        logo: `${siteConfig.url}/images/logo/logomain.png`,
        image: `${siteConfig.url}/trips/georgia/01.jpg`,
        description: siteConfig.description,
        email: siteConfig.email,
        telephone: siteConfig.phone,
        areaServed: [
          { "@type": "Country", name: "United Arab Emirates" },
          { "@type": "Country", name: "Georgia" },
          { "@type": "Country", name: "Armenia" },
          { "@type": "Country", name: "Azerbaijan" },
        ],
        sameAs: [siteConfig.instagram],
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: siteConfig.phone,
            contactType: "customer service",
            availableLanguage: ["English", "Arabic"],
            areaServed: "AE",
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: siteConfig.url,
        name: siteConfig.name,
        description: siteConfig.description,
        publisher: { "@id": organizationId },
        inLanguage: "en",
      },
      {
        "@type": "WebPage",
        "@id": `${siteConfig.url}/#webpage`,
        url: siteConfig.url,
        name: `${siteConfig.name} — ${siteConfig.tagline}`,
        description: siteConfig.description,
        isPartOf: { "@id": websiteId },
        about: { "@id": organizationId },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${siteConfig.url}/trips/georgia/01.jpg`,
        },
        inLanguage: "en",
      },
      {
        "@type": "FAQPage",
        "@id": `${siteConfig.url}/#faq`,
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  )
}
