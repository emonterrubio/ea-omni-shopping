"use client";

import Link from "next/link";
import {
  Mail,
  Phone,
  MessageCircle,
  HelpCircle,
  FileText,
  Users,
} from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

const contactCards = [
  {
    title: "Email Support",
    description: "Send us an email for general inquiries and support",
    href: "mailto:it-support@ea.com",
    action: "it-support@ea.com",
    icon: Mail,
  },
  {
    title: "Phone Support",
    description: "Call us for urgent technical support",
    href: "tel:+18005550123",
    action: "+1-800-555-0123",
    icon: Phone,
  },
  {
    title: "Live Chat",
    description: "Chat with our support team in real-time",
    href: "mailto:it-support@ea.com?subject=Live%20Chat%20Request",
    action: "Start Chat",
    icon: MessageCircle,
  },
] as const;

const faqs = [
  {
    question: "How do I place an order for hardware?",
    answer:
      "Browse our catalog, add items to cart, and complete checkout with your business information and approval details.",
  },
  {
    question: "What is the typical delivery time?",
    answer:
      "Most hardware items are delivered within 5 business days. Express shipping options are available for urgent needs.",
  },
  {
    question: "Can I return or exchange hardware?",
    answer:
      "Yes, we offer a 30-day return policy for unopened items. Contact support for return authorization and instructions.",
  },
  {
    question: "How do I get approval for expensive items?",
    answer:
      "Items over $500 require Finance Partner and Budget Owner approval. The system will guide you through the approval process.",
  },
] as const;

export default function SupportPage() {
  return (
    <PageLayout>
      <Breadcrumb
        items={[{ label: "Support & Help", isActive: true }]}
        className="mb-6"
      />

      <div className="text-left mb-8">
        <h1 className="text-4xl lg:text-5xl font-medium text-gray-900 mt-4 lg:mt-6 mb-3">
          Support &amp; Help
        </h1>
        <p className="text-base lg:text-lg text-gray-600">
          Get help with your IT hardware needs and technical support
        </p>
      </div>

      {/* Contact methods */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-8">
        {contactCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex flex-col"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-blue-600" aria-hidden="true" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                {card.title}
              </h2>
              <p className="text-sm text-gray-600 mb-4 flex-1">
                {card.description}
              </p>
              <a
                href={card.href}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
              >
                {card.action}
              </a>
            </div>
          );
        })}
      </div>

      {/* FAQ + side cards */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 mb-8">
        {/* FAQ */}
        <section
          id="faq"
          className="lg:col-span-3 bg-white rounded-lg border border-gray-200 shadow-sm p-6 lg:p-8"
        >
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="w-6 h-6 text-blue-600" aria-hidden="true" />
            <h2 className="text-2xl font-semibold text-gray-900">FAQ</h2>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            Find answers to commonly asked questions
          </p>

          <ul className="space-y-5">
            {faqs.map((faq) => (
              <li
                key={faq.question}
                className="border-l-2 border-gray-200 pl-4"
              >
                <h3 className="text-base font-semibold text-gray-900 mb-1">
                  {faq.question}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <a
              href="#faq"
              className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
            >
              Browse All FAQ
            </a>
          </div>
        </section>

        {/* Right column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <section className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-blue-600" aria-hidden="true" />
              <h2 className="text-xl font-semibold text-gray-900">
                About Hardware Specifications
              </h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Learn how to read processor, memory, storage, graphics, and other
              specs so you can choose the right hardware for your role.
            </p>
            <Link
              href="/hardware-specs"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
            >
              View About Hardware Specifications
            </Link>
          </section>

          <section className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-blue-600" aria-hidden="true" />
              <h2 className="text-xl font-semibold text-gray-900">
                Our Support Team
              </h2>
            </div>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              Our dedicated IT support team is available to help you with
              hardware selection, technical issues, and any questions about our
              products and services.
            </p>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex gap-2">
                <span className="text-blue-600 mt-1.5" aria-hidden="true">
                  •
                </span>
                <span>
                  <span className="font-semibold text-gray-900">
                    Business Hours:
                  </span>{" "}
                  Monday - Friday, 9:00 AM - 6:00 PM PST
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600 mt-1.5" aria-hidden="true">
                  •
                </span>
                <span>
                  <span className="font-semibold text-gray-900">
                    Emergency Support:
                  </span>{" "}
                  Available 24/7 for critical issues
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600 mt-1.5" aria-hidden="true">
                  •
                </span>
                <span>
                  <span className="font-semibold text-gray-900">
                    Response Time:
                  </span>{" "}
                  We aim to respond to all inquiries within 2 business hours
                </span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </PageLayout>
  );
}
