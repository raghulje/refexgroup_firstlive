import { useEffect } from 'react';
import MainLayout from '../../components/feature/MainLayout';
import Footer from '../../components/feature/Footer';

export default function TermsOfUsePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <MainLayout>
      <div className="min-h-screen bg-white">
        {/* Hero Section with Grey Background */}
        <section className="bg-gray-200 pt-28 md:pt-32 pb-16 md:pb-20">
          <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 text-center">
              Terms of Use
            </h1>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-700 leading-relaxed space-y-6">
                <p>
                  This terms and conditions ("Terms"/"Agreement") is an agreement between Refex Holdings Private Limited which shall mean and include its subsidiaries, affiliates, associate companies and Refex Group of Companies ("Refex", "us", "we" or "our") and you ("User", "you" or "your"). This Agreement sets forth the general terms and conditions of your use of our main website "https://www.refex.co.in" including any sub-domains of this website, unless excluded by their own terms (collectively referred to as "Website").
                </p>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Accuracy of information</h2>
                  <p>
                    Occasionally there may be information on the Website that contains typographical errors, inaccuracies or omissions that may relate to promotions and offers. We reserve the right to correct any errors, inaccuracies or omissions, and to change or update information or cancel orders if any information on the Website is inaccurate at any time without prior notice (including after you have submitted your order) to you. We undertake no obligation to update, amend or clarify information on the Website including, without limitation, pricing information, except as required by law. No specified update or fresh date applied on the Website should be taken to indicate that all information on the Website has been modified or updated.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Links to other websites</h2>
                  <p>
                    Although this Website may be linked to other websites, we are not, directly or indirectly, implying any approval, association, sponsorship, endorsement, or affiliation with any linked website, unless specifically stated herein. We are not responsible for examining or evaluating, and we do not warrant the offerings of, any businesses or individuals or the content of their websites. We do not assume any responsibility or liability for the actions, products, services and content of any other third parties. You should carefully review the legal statements and other conditions of use of any website which you access through a link from our Website. Your linking to any other off-site websites is at your own risk.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Prohibited uses</h2>
                  <p className="mb-4">
                    In addition to other terms as set forth in the Agreement, you are prohibited from using our Website or its content:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>(a)</strong> for any unlawful purpose;</li>
                    <li><strong>(b)</strong> to solicit others to perform or participate in any unlawful acts;</li>
                    <li><strong>(c)</strong> to violate any international, federal, provincial or state regulations, rules, laws, or local ordinances;</li>
                    <li><strong>(d)</strong> to infringe upon or violate our intellectual property rights or the intellectual property rights of others;</li>
                    <li><strong>(e)</strong> to harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate based on gender, sexual orientation, religion, ethnicity, race, age, national origin, or disability;</li>
                    <li><strong>(f)</strong> to submit false or misleading information;</li>
                    <li><strong>(g)</strong> to upload or transmit viruses or any other type of malicious code that will or may be used in any way that will affect the functionality or operation of the Website or of any related website, other websites, or the Internet;</li>
                    <li><strong>(h)</strong> to collect or track the personal information of others;</li>
                    <li><strong>(i)</strong> to spam, phish, pharm, pretext, spider, crawl, or scrape;</li>
                    <li><strong>(j)</strong> for any obscene or immoral purpose; or</li>
                    <li><strong>(k)</strong> to interfere with or circumvent the security features of the Website or any related website, other websites, or the Internet.</li>
                  </ul>
                  <p className="mt-4">
                    We reserve the right to terminate your use of the Website or any related website for violating any of the prohibited uses.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual property rights</h2>
                  <p>
                    This Agreement does not transfer from Refex to you, any of Refex's or third-party intellectual property, and all right, title, and interest in and to such property will remain (as between the parties) solely with Refex. All trademarks, service marks, graphics and logos used in connection with our Website, are trademarks or registered trademarks of Refex. Other trademarks, service marks, graphics and logos used in connection with our Website may be the trademarks of other third parties. Your use of our Website grants you no right or license to reproduce or otherwise use any of Refex's or third-party trademarks.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Disclaimer of warranty</h2>
                  <p>
                    You agree that your use of our Website is solely at your own risk. You agree that such Website is provided on an "as is" and "as available" basis. We expressly disclaim all warranties of any kind, whether express or implied, including but not limited to the implied warranties of merchantability, fitness for a particular purpose and non-infringement. We make no warranty that our Website will meet your requirements, or that our Website will be uninterrupted, timely, secure, or error free; nor do we make any warranty as to the results that may be obtained from the use of our Website or as to the accuracy or reliability of any information obtained through our Website or that defects in the our Website will be corrected. You understand and agree that any material and/or data downloaded or otherwise obtained through the use of our Website is done at your own discretion and risk and that you will be solely responsible for any damage to your computer system or loss of data that results from the download of such material and/or data. We make no warranty regarding any goods or services purchased or obtained through the our Website or any transactions entered into through the Service. No advice or information, whether oral or written, obtained by you from us or through our Website shall create any warranty not expressly made herein.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of liability</h2>
                  <p>
                    To the fullest extent permitted by applicable law, in no event will Refex, its affiliates, officers, directors, employees, agents, suppliers or licensors be liable to any person for (a): any indirect, incidental, special, punitive, cover or consequential damages (including, without limitation, damages for lost profits, revenue, sales, goodwill, use or content, impact on business, business interruption, loss of anticipated savings, loss of business opportunity) however caused, under any theory of liability, including, without limitation, contract, tort, warranty, breach of statutory duty, negligence or otherwise, even if Refex has been advised as to the possibility of such damages or could have foreseen such damages.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Indemnification</h2>
                  <p>
                    You agree to indemnify and hold Refex and its affiliates, directors, officers, employees, and agents harmless from and against any liabilities, losses, damages or costs, including reasonable attorneys' fees, incurred in connection with or arising from any third-party allegations, claims, actions, disputes, or demands asserted against any of them as a result of or relating to your content, your use of our Website or any willful misconduct on your part.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Severability</h2>
                  <p>
                    All rights and restrictions contained in this Agreement may be exercised and shall be applicable and binding only to the extent that they do not violate any applicable laws and are intended to be limited to the extent necessary so that they will not render this Agreement illegal, invalid or unenforceable. If any provision or portion of any provision of this Agreement shall be held to be illegal, invalid or unenforceable by a court of competent jurisdiction, it is the intention of the parties that the remaining provisions or portions thereof shall constitute their agreement with respect to the subject matter hereof, and all such remaining provisions or portions thereof shall remain in full force and effect.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Dispute resolution</h2>
                  <p>
                    The Policy shall be governed by the laws of India and the Courts in Chennai shall have the exclusive jurisdiction to try any dispute arising thereof.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes and amendments</h2>
                  <p>
                    We reserve the right to modify this Agreement or its policies relating to our Website at any time, effective upon posting of an updated version of this Agreement on the Website. When we do we will post a notification on the main page of our Website. Continued use of the Website after any such changes shall constitute your consent to such changes.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceptance of these terms</h2>
                  <p>
                    You acknowledge that you have read this Agreement and agree to all its terms and conditions. By using our Website you agree to be bound by this Agreement. If you do not agree to abide by the terms of this Agreement, you are not authorized to use or access our Website.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Contacting us</h2>
                  <p className="mb-4">
                    If you have any questions about this Agreement, please contact us at <a href="mailto:info@refex.co.in" className="text-[#7cb342] hover:underline">info@refex.co.in</a>.
                  </p>
                  <p className="text-sm text-gray-600">
                    This document was last updated on {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </MainLayout>
  );
}

