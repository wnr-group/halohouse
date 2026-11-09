HALO HOUSE - MODELLING WORKSHOP LANDING PAGE
============================================

1. HOW TO ADD IT TO THE SITE (React)
   Copy this whole "workshop" folder into the React app's  public/  folder:
       public/workshop/index.html
       public/workshop/img/...
   It will then be live at:  https://halohouse.digital/workshop/
   It's a standalone page, so no React code changes are needed.
   If the React router catches /workshop, add a server/hosting rewrite so
   /workshop/ serves public/workshop/index.html.

2. ACTIVATE THE FORM EMAILS (one-time, required)
   Form entries go to halohousechennai@gmail.com via FormSubmit.co.
   After the page goes live, submit ONE test booking. FormSubmit then sends an
   "Activate form" email to halohousechennai@gmail.com, and someone must click it.
   Until that link is clicked, NO bookings are delivered. Check spam too.

3. META PIXEL (already installed - ID 2243273103276547)
   PageView        - page load
   Lead            - details form submitted (eventID = Booking ID, e.g. HH-4821)
   InitiateCheckout- tapped "Pay with UPI" or "Copy UPI ID"
   Contact         - tapped "Send screenshot on WhatsApp"
   Optimise ads for: Lead.
   Upload verified payments as offline "Purchase" events to train on real buyers.

4. HOW TO MATCH PAYMENTS
   Every booking gets an ID (HH-xxxx). It appears in the email, in the UPI
   payment note, and in the WhatsApp message, so match screenshots by that ID.

5. EDIT CONFIG (bottom of index.html, inside <script>, "CONFIG")
   formEndpoint, upiId, payeeName, amount, whatsapp, closeAt (booking deadline).
   After closeAt (13 Nov 11:59 PM IST) the form hides automatically and shows
   a "WhatsApp us to check availability" message.

6. VIDEOS (media/ folder)
   hero.mp4 (~0.8 MB) autoplays muted in the hero; poster image shows instantly.
   clip1-6.mp4 (~0.1-0.75 MB each) load ONLY when the visitor scrolls to the
   "past workshops" section, and pause when scrolled away. Keep the
   media/ folder next to index.html.

7. PAY BUTTONS
   "Pay on Google Pay" / "Pay on PhonePe" open that app with Rs.999 pre-filled
   (Android + iPhone). The QR, UPI ID copy and "Other UPI app" are fallbacks.
   Test on a real phone before ads go live: some UPI apps flag/decline
   pre-filled payments to personal (non-merchant) UPI IDs.
