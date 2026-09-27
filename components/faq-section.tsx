import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

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

export function FAQSection() {
  return (
    <section id="faq" className="py-32 px-6 pb-80">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-normal mb-6 text-balance font-serif">Frequently asked questions</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            How an Jazora departure works, from the first call to the flight home. Ask the trip desk if yours is not here.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-3 py-0 my-0">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-card border border-border rounded-xl px-6 data-[state=open]:border-foreground/30"
            >
              <AccordionTrigger className="text-left text-base font-medium text-foreground hover:no-underline py-5">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5 leading-relaxed text-sm">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
