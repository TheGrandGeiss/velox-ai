'use client';

import { Outfit } from 'next/font/google';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const outfit = Outfit({ subsets: ['latin'] });

const faqs = [
  {
    question: 'Is Velox free to use?',
    // REMOVED "team features" from the answer
    answer:
      'Yes! We offer a generous free tier that includes unlimited scheduling and Google Calendar sync. We also have a Pro plan for power users who need advanced AI analytics and priority support.',
  },
  {
    question: 'Does it work with Outlook or Apple Calendar?',
    answer:
      'Currently, we focus deeply on Google Calendar integration to provide the best possible experience. Outlook and Apple Calendar support is on our roadmap for late 2026.',
  },
  {
    question: 'How secure is my data?',
    answer:
      "Security is our top priority. We use industry-standard encryption and never sell your personal data. Our AI processes your schedule to help you, but it doesn't store sensitive event details permanently.",
  },
  {
    question: 'Can I use Velox for my team?',
    // UPDATED: Honest about current state + Roadmap tease
    answer:
      'Right now, Velox is optimized for individuals. However, since we sync directly with Google Calendar, any invites you send or receive will still work perfectly. Full team collaboration features are coming in Q2!',
  },
  {
    question: 'How do I cancel my subscription?',
    answer:
      "You can cancel anytime directly from your dashboard. There are no hidden fees or lock-in contracts. If you cancel, you'll still have access until the end of your billing cycle.",
  },
];

const FAQ = () => {
  return (
    <section
      id='faq'
      className={`py-24 bg-[#f5f6f7] ${outfit.className}`}>
      <div className='max-w-3xl mx-auto px-6'>
        {/* Section Header */}
        <div className='text-center mb-16'>
          <div className='inline-block px-5 py-1.5 mb-6 border border-gray-200 rounded-full bg-white shadow-sm'>
            <h3 className='text-violet font-medium tracking-wide text-sm'>
              FAQ
            </h3>
          </div>
          <h2 className='text-4xl font-bold text-[#262626]'>
            Got questions? We've got answers.
          </h2>
        </div>

        {/* Shadcn Accordion */}
        <Accordion
          type='single'
          collapsible
          className='w-full space-y-4'>
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className='bg-white px-6 rounded-xl border border-gray-200 data-[state=open]:border-violet/50 data-[state=open]:shadow-md transition-all duration-300'>
              <AccordionTrigger className='text-lg font-medium text-[#262626] hover:text-violet hover:no-underline py-6'>
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className='text-gray-600 text-[16px] leading-relaxed pb-6'>
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
