import { ReactNode } from 'react';

const PageLayout = ({ title, children }: { title: string, children: ReactNode }) => (
  <div className="min-h-[70vh] bg-background py-16">
    <div className="container mx-auto px-3 max-w-3xl">
      <h1 className="text-4xl font-display font-bold mb-8">{title}</h1>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        {children}
      </div>
    </div>
  </div>
);

export const HelpPage = () => (
  <PageLayout title="Help Center">
    <p>Welcome to the Market Mirror Help Center. We're here to assist you with any questions or issues you may have.</p>
    <h3>Frequently Asked Questions</h3>
    <p><strong>How do I place an order?</strong><br/>Browse our shops, add items to your cart, and proceed to checkout.</p>
    <p><strong>How are sellers verified?</strong><br/>We personally visit and verify every physical shop in Alaba market before listing them.</p>
  </PageLayout>
);

export const ReturnsPage = () => (
  <PageLayout title="Return Policy">
    <p>We want you to be completely satisfied with your purchase.</p>
    <ul>
      <li>Returns are accepted within 7 days of delivery for defective items.</li>
      <li>Items must be in their original packaging.</li>
      <li>To initiate a return, please file a dispute through your account.</li>
    </ul>
  </PageLayout>
);

export const AboutPage = () => (
  <PageLayout title="About Market Mirror">
    <p>Market Mirror is the digital twin of the Alaba International Market, the largest electronics market in West Africa.</p>
    <p>Our mission is to bring the authentic market experience online, providing verified vendors, real-time pricing, and reliable delivery.</p>
  </PageLayout>
);

export const TermsPage = () => (
  <PageLayout title="Terms of Service">
    <p>These terms govern your use of the Market Mirror platform.</p>
    <p>By using our service, you agree to these terms. This is a prototype application for demonstration purposes only.</p>
  </PageLayout>
);

export const PrivacyPage = () => (
  <PageLayout title="Privacy Policy">
    <p>Your privacy is important to us.</p>
    <p>This prototype does not collect real user data. Any information entered is stored locally on your device.</p>
  </PageLayout>
);
