export type CatalogPlace = {
  id: string
  name: string
  flag: string
  image: string
  /** Matches a cinematic strip destination when available */
  featuredId?: string
}

/** Full destination library shown from the + buttons */
export const destinationCatalog: CatalogPlace[] = [
  { id: "india", name: "India", flag: "🇮🇳", image: "/destinations/india.jpg" },
  { id: "uae", name: "UAE", flag: "🇦🇪", image: "/destinations/uae.jpg" },
  { id: "oman", name: "Oman", flag: "🇴🇲", image: "/destinations/oman.jpg" },
  {
    id: "thailand",
    name: "Thailand",
    flag: "🇹🇭",
    image: "/trips/thailand/web/01.jpg",
    featuredId: "thailand",
  },
  {
    id: "jordan",
    name: "Jordan",
    flag: "🇯🇴",
    image: "/trips/jordan/web/01.jpg",
    featuredId: "jordan",
  },
  {
    id: "georgia",
    name: "Georgia",
    flag: "🇬🇪",
    image: "/trips/georgia/web/01.jpg",
    featuredId: "georgia",
  },
  {
    id: "saudi-arabia",
    name: "Saudi Arabia",
    flag: "🇸🇦",
    image: "/destinations/saudi-arabia.jpg",
  },
  { id: "qatar", name: "Qatar", flag: "🇶🇦", image: "/destinations/qatar.jpg" },
  {
    id: "armenia",
    name: "Armenia",
    flag: "🇦🇲",
    image: "/trips/armenia/web/01.jpg",
    featuredId: "armenia",
  },
  {
    id: "azerbaijan",
    name: "Azerbaijan",
    flag: "🇦🇿",
    image: "/trips/azerbaijan/web/01.jpg",
    featuredId: "azerbaijan",
  },
  {
    id: "kazakhstan",
    name: "Kazakhstan",
    flag: "🇰🇿",
    image: "/destinations/kazakhstan.jpg",
  },
  { id: "egypt", name: "Egypt", flag: "🇪🇬", image: "/destinations/egypt.jpg" },
  {
    id: "malaysia",
    name: "Malaysia",
    flag: "🇲🇾",
    image: "/destinations/malaysia.jpg",
  },
  {
    id: "uzbekistan",
    name: "Uzbekistan",
    flag: "🇺🇿",
    image: "/trips/uzbekistan/web/01.jpg",
    featuredId: "uzbekistan",
  },
  {
    id: "kyrgyzstan",
    name: "Kyrgyzstan",
    flag: "🇰🇬",
    image: "/trips/kyrgyzstan/web/01.jpg",
    featuredId: "kyrgyzstan",
  },
  {
    id: "srilanka",
    name: "Sri Lanka",
    flag: "🇱🇰",
    image: "/trips/srilanka/web/01.jpg",
    featuredId: "srilanka",
  },
  { id: "kuwait", name: "Kuwait", flag: "🇰🇼", image: "/destinations/kuwait.jpg" },
  {
    id: "nepal",
    name: "Nepal",
    flag: "🇳🇵",
    image: "/trips/nepal/web/01.jpg",
    featuredId: "nepal",
  },
  {
    id: "vietnam",
    name: "Vietnam",
    flag: "🇻🇳",
    image: "/trips/vietnam/web/01.jpg",
    featuredId: "vietnam",
  },
  {
    id: "bahrain",
    name: "Bahrain",
    flag: "🇧🇭",
    image: "/destinations/bahrain.jpg",
  },
]
