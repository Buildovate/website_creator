// Fictional local FAQ data; not a default or an automatic publication.
export const faqFixture={id:'roofing-faq',kind:'faq',enabled:true,title:'Roofing questions. Clearer next steps.',intro:'From the first sign of a leak to planning a replacement, find the details that help you decide what to ask next.',questions:[
 ['Services','Can my roof be repaired instead of replaced?','The right scope depends on the roof’s condition and the extent of the damage. Describe what you’ve noticed and ask which options fit your roof.'],
 ['Services','What should I share about a leak?','Note where the water appears, when you first noticed it and whether it follows rain. Photos taken safely from inside or from the ground can help explain the concern.'],
 ['Services','Which roofing services can I ask about?','Use the service links below to explore the work selected by this business, then share your concern in the project request.'],
 ['Planning & price','How much will my roofing project cost?','The scope, materials, roof access and underlying condition affect the price. Ask for a written scope and price for your home before agreeing to work.'],
 ['Planning & price','Does sending a request book an appointment?','A request starts the conversation. The business confirms availability and any appointment separately.'],
 ['Process & timing','How long will the work take?','Timing depends on the agreed scope, weather, material availability and any findings once work begins. Discuss the schedule before work starts.'],
 ['Process & timing','What should I prepare before work starts?','Ask about driveway access, vehicles, pets and protecting nearby belongings. Confirm cleanup and access arrangements with the business.'],
 ['Materials & care','How do I compare roofing materials?','Discuss which materials suit your roof, the installation requirements and the manufacturer’s written terms. Ask how each option changes the proposed scope.'],
 ['Materials & care','How should I check my roof between visits?','Look from the ground for visible damage or debris and check indoors for new stains after rain. Avoid climbing onto the roof to investigate.'],
 ['Materials & care','What warranty applies?','Ask for the written product and workmanship terms that apply to the proposed work, including exclusions and who handles a claim.'],
 ['Urgent concerns & local work','What if water is entering my home now?','Keep clear of wet electrical fixtures and unsafe areas. Call the business to discuss the concern and its current availability. A website request does not confirm emergency service.'],
 ['Urgent concerns & local work','Do you work in my area?','Share your project city when you contact the business so it can confirm service availability for your address.'],
 ['Urgent concerns & local work','How can I check licensing and project requirements?','Ask the business for its current license details and which permits or approvals apply to the agreed scope.'],
 ['Payment options','Where can I explore financing?','Visit the Financing page to explore payment planning and any configured application links. An estimate is not an approval or a live offer.','financing'],
 ['Payment options','Does a payment estimate guarantee terms?','No. Confirm eligibility, APR, term and total cost with the provider before making a decision.','financing'],
 ['Payment options','Where can I find current promotions?','See the Promotions page for available offers, eligibility and any expiry or unlock requirements.','promotions']
].map(([category,question,answer,requires='none'],i)=>({id:'roofing-q-'+i,category,question,answer,requires}))};
