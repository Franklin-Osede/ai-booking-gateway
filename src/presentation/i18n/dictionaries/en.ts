import { Stethoscope, HeartPulse, Activity, User, Scissors, Sparkles, Droplet, UserCheck, Car, Wrench, ShieldCheck, Briefcase, Scale, FileText, Monitor, Server, Zap, Smile } from "lucide-react";
import { NicheConfig } from "./es";

export const EN_DICTIONARY: Record<string, NicheConfig> = {
  medical: {
    title: "Select your specialist",
    subtitle: "Find the right expert for your treatment and book your appointment in seconds.",
    buttonLabel: "Doctors",
    chatGreeting: "Hello, I'm your medical concierge. Which specialty do you need help with today?",
    chatThinking: "Checking doctor availability...",
    chatOffer: "Perfect. I have slots available with our best specialists. Shall we book an appointment?",
    chatCta: "Book Medical Appointment",
    categories: [
      { icon: Stethoscope, name: "Urology", docs: ["Urology Specialist", "Lead Surgeon", "On-Call Doctor"] },
      { icon: HeartPulse, name: "Cardiology", docs: ["Lead Specialist", "Head Cardiologist", "Medical Team"] },
      { icon: Activity, name: "Physiotherapy", docs: ["Head Physiotherapist", "Rehab Specialist", "Specialist"] },
      { icon: User, name: "Gynecology", docs: ["Lead Gynecologist", "On-Call Specialist"] },
      { icon: User, name: "Psychology", docs: ["Clinical Psychologist", "Therapist", "Specialist"] }
    ]
  },
  dental: {
    title: "Choose your ideal treatment",
    subtitle: "Select your specialist dentist and book your appointment in under a minute.",
    buttonLabel: "Dentists",
    chatGreeting: "Hello, I'm your dental assistant. What treatment or specialty can I help you with today?",
    chatThinking: "Checking availability at the dental clinic...",
    chatOffer: "Perfect. I have slots available with our top specialists. Shall we lock in an appointment?",
    chatCta: "Book Dental Appointment",
    categories: [
      { icon: Smile, name: "Orthodontics", docs: ["Lead Orthodontist", "Clinical Specialist", "Dental Team"] },
      { icon: Sparkles, name: "Teeth Whitening", docs: ["Aesthetic Dentist", "Dental Hygienist"] },
      { icon: Activity, name: "Implantology", docs: ["Maxillofacial Surgeon", "Lead Implantologist"] },
      { icon: ShieldCheck, name: "Pediatric Dentistry", docs: ["Pediatric Dentist", "Child Specialist"] }
    ],
    voice_scripts: {
      ask_service_intro: "During your free first visit, we will perform a complete clinical design and diagnosis.",
      ask_service_options: {
         "Orthodontics": "We'll align your smile using 3D technology... To focus your first visit, what do you value more: invisibility or speed?",
         "Teeth Whitening": "We'll deeply clean and whiten your enamel... Are you looking to remove stubborn stains, or do you notice a general loss of color?",
         "Implantology": "We'll restore your bite with titanium implants... Do you need to replace a single tooth, or rehabilitate a full arch?",
         "Pediatric Dentistry": "We make kids look forward to going to the dentist... Are you bringing them in for a general check-up, or do they have specific pain?"
      },
      deep_dive_chips: {
         "Orthodontics": ["Invisible Aesthetics", "Maximum Speed", "See Specialists"],
         "Teeth Whitening": ["I have stains", "Loss of color", "See Specialists"],
         "Implantology": ["A single tooth", "Full Arch", "See Specialists"],
         "Pediatric Dentistry": ["General Check-up", "Specific Pain", "See Specialists"]
      },
      deep_dive_scripts: {
         "Invisible Aesthetics": "Excellent. We offer top-tier clear aligners... No one will even notice you're wearing them.",
         "Maximum Speed": "Understood. With our Damon braces system, we cut treatment time in half... achieving much faster results.",
         "I have stains": "I understand. Our advanced clinical whitening eliminates even the deepest stains from the very first session.",
         "Loss of color": "Perfect. We'll revitalize your enamel, giving back its natural white shine... completely pain-free.",
         "A single tooth": "Great. We'll perform a free 3D CT scan to measure your bone... so we can insert the implant on the same day.",
         "Full Arch": "I understand. With the All-on-four technique, you'll recover your full smile in just 24 hours... and with conscious sedation.",
         "General Check-up": "Awesome. We'll do a deep cleaning, and teach them prevention techniques to avoid any hidden cavities.",
         "Specific Pain": "Don't worry. We'll take a focused X-ray to detect exactly where the pain is coming from... and relieve it right away."
      },
      ask_service_fallback: "TEXT_INTRO Would you like to schedule an assessment appointment... or do you prefer more details about the treatments?",
      confirm_booking: "Great! Your appointment with DR_NAME for SELECTED_DATE at SPOKEN_TIME has been fully confirmed."
    }
  },
  hair_transplant: {
    title: "Hair Transplants",
    subtitle: "Resolve your doubts about hair transplantation and book your free assessment with no commitment.",
    buttonLabel: "Assessment",
    chatGreeting: "Hello, I'm your hair recovery advisor. I know taking the step generates many doubts. What would you like to know today?",
    chatThinking: "Analyzing available hair specialists...",
    chatOffer: "I completely understand your doubts. I have slots available for an expert doctor to analyze your specific case. Shall we book a free assessment?",
    chatCta: "Book Hair Assessment",
    categories: [
      { icon: User, name: "FUE / DHI Technique", docs: ["Hair Transplant Surgeon", "FUE Specialist"] },
      { icon: Sparkles, name: "Preventive Treatments", docs: ["Trichologist Dermatologist", "PRP Specialist"] },
      { icon: HeartPulse, name: "Postoperative Care", docs: ["Post-Op Medical Team", "Care Advisor"] }
    ],
    voice_scripts: {
      ask_service_intro: "During your medical assessment, we'll analyze your specific case with no commitment.",
      ask_service_options: {
         "FUE / DHI Technique": "The F-U-E technique transplants hair by hair painlessly... Tell me briefly, do you notice more hair loss at the hairline, or at the crown?",
         "Preventive Treatments": "Our treatments stimulate growth... Are you simply noticing thinner, weaker hair, or a heavy hair fall of more than 100 hairs a day?",
         "Postoperative Care": "Proper follow-up is key... Did you recently have surgery and want a check-up, or are you experiencing discomfort after the procedure?"
      },
      deep_dive_chips: {
         "FUE / DHI Technique": ["At the Hairline", "At the Crown", "Both areas"],
         "Preventive Treatments": ["Thin and weak hair", "Heavy hair fall", "Speak to Advisor"],
         "Postoperative Care": ["Monthly Check-up", "I have discomfort", "Speak to Advisor"]
      },
      deep_dive_scripts: {
         "At the Hairline": "I understand. Reconstructing the hairline requires a very detailed design and great precision so the result is completely undetectable.",
         "At the Crown": "Understood. The crown requires a larger number of follicular units and patience because the blood supply there is different.",
         "Both areas": "Perfect. We'll need to create an integral design that redensifies both areas while preserving a healthy donor area.",
         "Thin and weak hair": "For that miniaturized thinning, mesotherapy with vitamins provides a direct energy boost to the follicle, thickening it quickly.",
         "Heavy hair fall": "We abruptly stop telogen phase hair fall by combining oral medication and PRP directly into the scalp.",
         "Monthly Check-up": "Keeping a monthly photographic record is fundamental to verify that the follicles have rooted well and are growing.",
         "I have discomfort": "Don't worry at all, it's completely normal during the healing phase; our medical team will prescribe the appropriate treatment."
      },
      ask_service_fallback: "TEXT_INTRO Would you like to check our calendar to book your private consultation?",
      confirm_booking: "Fantastic! Your hair assessment booking with DR_NAME is confirmed. We look forward to seeing you."
    }
  },
  aesthetic: {
    title: "Advanced Aesthetic Medicine",
    subtitle: "Enhance your natural beauty with minimally invasive medical treatments and cutting-edge technology.",
    buttonLabel: "Assessment",
    chatGreeting: "Hello, I'm your clinical advisor. What aspect of your face or body would you like to improve today?",
    chatThinking: "Checking the aesthetic clinic's agenda...",
    chatOffer: "Great. I have free slots with our specialist medical team to analyze your skin. Would you like to schedule a facial assessment?",
    chatCta: "Book Medical Assessment",
    categories: [
      { icon: Sparkles, name: "Facial Harmonization", docs: ["Plastic Surgeon", "Aesthetic Doctor"] },
      { icon: HeartPulse, name: "Injectables & Quality", docs: ["Surgical Dermatologist", "Injectables Specialist"] },
      { icon: Activity, name: "Medical Laser", docs: ["Laser Medicine", "Advanced Laser Technician"] }
    ],
    voice_scripts: {
      ask_service_intro: "In our clinic, we prioritize elegant and very natural results.",
      ask_service_options: {
         "Facial Harmonization": "A comprehensive facial rejuvenation restores your lost volume... Do you feel you need more support in your cheeks and under-eyes, or do you prefer to define your jawline?",
         "Injectables & Quality": "Our botulinum toxin and biostimulators achieve porcelain skin... At first glance, are you more concerned about expression lines, or do you prefer to hydrate your lips?",
         "Medical Laser": "We have cutting-edge technology like Morpheus 8 and IPL... Are you looking to eliminate dark spots and redness, or treat deep acne scars?"
      },
      deep_dive_chips: {
         "Facial Harmonization": ["Under-eyes and Cheeks", "Jawline", "See Specialists"],
         "Injectables & Quality": ["Expression Lines", "Lip Volume", "See Specialists"],
         "Medical Laser": ["Dark Spots and Redness", "Acne Scars", "See Specialists"]
      },
      deep_dive_scripts: {
         "Under-eyes and Cheeks": "Excellent. We will subtly fill the 'tear trough' with hyaluronic acid... completely eliminating that tired look.",
         "Jawline": "Perfect. With Radiesse or collagen stimulators, we'll contour your facial oval and subtly tighten your neck... bringing back a lot of youth.",
         "Expression Lines": "Totally agree. With a few units of toxin in your forehead or crow's feet... we'll clear your gaze while keeping it super expressive.",
         "Lip Volume": "Great. We'll use ultra-elastic hyaluronic acid to give you a juicy volume or simply hydrate, always with a Russian Lips design if you wish.",
         "Dark Spots and Redness": "I understand. We'll use CO2 Laser combined with intense pulsed light to unify your entire tone and sweep away melasma or sun damage.",
         "Acne Scars": "Awesome. Fractional radiofrequency like Morpheus 8 will break up the scar tissue... generating completely smooth, poreless skin."
      },
      ask_service_fallback: "TEXT_INTRO Would you like to book a first medical evaluation visit... or do you prefer details about our pricing?",
      confirm_booking: "Sensational! Your assessment appointment with DR_NAME for SELECTED_DATE at SPOKEN_TIME is one hundred percent confirmed."
    }
  }
};
