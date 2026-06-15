import { Layout } from "@/components/layout/Layout";

const SmsTerms = () => {
  return (
    <Layout>
      <div className="container max-w-3xl mx-auto px-4 py-16">
        <h1 className="font-display text-4xl md:text-5xl text-foreground mb-2">
          SMS Terms & Conditions
        </h1>
        <p className="text-sm text-muted-foreground mb-10">Last Updated: June 2026</p>

        <div className="prose prose-invert max-w-none space-y-6 font-body text-foreground/90 leading-relaxed">
          <p>
            These SMS Terms & Conditions ("Terms") govern participation in the Resurrected Labs text
            messaging program. By opting into our SMS program, you agree to these Terms.
          </p>

          <section>
            <h2 className="text-xl font-semibold text-foreground">1. Program Description</h2>
            <p>
              Resurrected Labs may send text messages related to promotions, discounts, product
              updates, order notifications, appointment reminders, customer service communications,
              and other business-related information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">2. Consent</h2>
            <p>
              By providing your mobile phone number and opting into our SMS program, you expressly
              consent to receive recurring automated marketing and non-marketing text messages from
              Resurrected Labs.
            </p>
            <p>Consent is not a condition of purchasing any goods or services.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">3. Message Frequency</h2>
            <p>
              Message frequency may vary depending on your interactions with Resurrected Labs,
              account activity, promotions, and other business communications.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">4. Message and Data Rates</h2>
            <p>
              Message and data rates may apply according to your mobile carrier's pricing plan.
              Charges are billed and payable to your mobile service provider.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">5. Opt-Out</h2>
            <p>You may opt out of receiving SMS messages at any time by replying:</p>
            <p className="font-mono">STOP</p>
            <p>
              After you send STOP, you may receive one final confirmation message confirming your
              opt-out request.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">6. Help</h2>
            <p>For assistance, reply:</p>
            <p className="font-mono">HELP</p>
            <p>
              or contact us through our website at{" "}
              <a href="https://resurrectedlabs.com" className="underline">
                https://resurrectedlabs.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">7. Supported Carriers</h2>
            <p>
              Supported carriers are not liable for delayed or undelivered messages. Delivery is
              subject to effective transmission by your mobile carrier and third-party service
              providers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">8. Eligibility</h2>
            <p>
              You must be at least 18 years old or have the permission of a parent or legal guardian
              to participate in the SMS program.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">9. Privacy</h2>
            <p>
              Information collected through the SMS program is subject to our{" "}
              <a href="/privacy" className="underline">
                Privacy Policy
              </a>{" "}
              available on our website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">10. Changes to These Terms</h2>
            <p>
              Resurrected Labs may modify these Terms at any time. Changes become effective upon
              posting to our website. Continued participation in the SMS program constitutes
              acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">11. Disclaimer of Warranties</h2>
            <p>
              The SMS program is provided on an "as is" and "as available" basis. Resurrected Labs
              makes no warranties regarding availability, accuracy, or reliability.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">12. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by applicable law, Resurrected Labs shall not be
              liable for any indirect, incidental, special, consequential, or punitive damages
              arising from participation in the SMS program.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">13. Contact Information</h2>
            <p>Resurrected Labs</p>
            <p>
              Website:{" "}
              <a href="https://resurrectedlabs.com" className="underline">
                https://resurrectedlabs.com
              </a>
            </p>
            <p>
              For questions regarding these Terms, please contact us through our website contact
              form.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default SmsTerms;
