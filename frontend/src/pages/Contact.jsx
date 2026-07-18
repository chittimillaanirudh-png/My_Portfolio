import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, User, PenLine } from "lucide-react";
import API_BASE from "../utils/api";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage("Sending message...");

    try {
      const response = await fetch(`${API_BASE}/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setStatusMessage("Message sent successfully!");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatusMessage("Failed to send message. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setStatusMessage("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setStatusMessage(""), 5000);
    }
  };

  const contactDetails = [
    {
      icon: <Mail size={18} className="text-ink" />,
      label: "EMAIL",
      value: "chittimillaanirudh@gmail.com"
    },
    {
      icon: <MapPin size={18} className="text-ink" />,
      label: "LOCATION",
      value: "Yadadri Bhuvanagiri, Telangana, India"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-ink">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
        </svg>
      ),
      label: "GITHUB",
      value: "github.com/chittimillaanirudh-png"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-ink">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
        </svg>
      ),
      label: "LINKEDIN",
      value: "linkedin.com/in/anirudh-chittimilla"
    }
  ];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="w-full bg-transparent py-24 relative z-20"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row gap-16 lg:gap-24">

        {/* Left Side: Contact Info */}
        <div className="flex-1 lg:max-w-md">
          <div className="mb-8">
            <span className="font-inter font-medium text-sm tracking-widest uppercase text-ink border-b border-ink/20 inline-block pb-1">
              GET IN TOUCH
            </span>
          </div>
          <h2 className="text-5xl md:text-7xl font-bebas leading-[0.85] tracking-tight text-ink mb-6">
            LET'S BUILD<br />SOMETHING GREAT.
          </h2>
          <p className="text-ink/80 font-inter text-base md:text-lg leading-relaxed mb-12">
            I'm always open to discussing new opportunities, collaborations, or just having a chat about tech and ideas. Feel free to reach out!
          </p>

          <div className="space-y-0 border-t border-ink/20">
            {contactDetails.map((detail, index) => (
              <div key={index} className="flex items-start gap-6 border-b border-ink/20 py-4">
                <div className="w-10 h-10 border border-ink/20 rounded bg-paper flex items-center justify-center shrink-0">
                  {detail.icon}
                </div>
                <div className="flex flex-col pt-1">
                  <span className="font-inter text-[10px] font-bold tracking-widest uppercase text-ink/70 mb-0.5">
                    {detail.label}
                  </span>
                  <span className="font-inter text-sm text-ink font-medium">
                    {detail.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Contact Form */}
        <div className="flex-1 w-full">
          <div className="border border-ink/20 rounded-xl p-8 lg:p-12 bg-paper/50">

            <div className="flex items-center gap-4 mb-4">
              <Mail size={24} className="text-ink" strokeWidth={1.5} />
              <h3 className="font-inter font-bold text-lg tracking-wide uppercase text-ink">
                SEND ME A MESSAGE
              </h3>
            </div>
            <p className="font-inter text-sm text-ink/70 mb-8">
              I'll get back to you as soon as possible.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    required
                    className="w-full bg-transparent border border-ink/30 rounded px-4 py-3 text-sm font-inter text-ink placeholder:text-ink/40 focus:outline-none focus:border-ink transition-colors"
                  />
                  <User size={18} className="absolute right-4 top-3.5 text-ink/40" />
                </div>

                {/* Email */}
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                    required
                    className="w-full bg-transparent border border-ink/30 rounded px-4 py-3 text-sm font-inter text-ink placeholder:text-ink/40 focus:outline-none focus:border-ink transition-colors"
                  />
                  <Mail size={18} className="absolute right-4 top-3.5 text-ink/40" />
                </div>
              </div>

              {/* Subject */}
              <div className="relative">
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Subject"
                  required
                  className="w-full bg-transparent border border-ink/30 rounded px-4 py-3 text-sm font-inter text-ink placeholder:text-ink/40 focus:outline-none focus:border-ink transition-colors"
                />
                <PenLine size={18} className="absolute right-4 top-3.5 text-ink/40" />
              </div>

              {/* Message */}
              <div className="relative">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  required
                  rows={6}
                  className="w-full bg-transparent border border-ink/30 rounded px-4 py-3 text-sm font-inter text-ink placeholder:text-ink/40 focus:outline-none focus:border-ink transition-colors resize-y"
                ></textarea>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group flex items-center justify-center gap-3 bg-ink text-paper px-8 py-4 font-inter text-xs font-bold tracking-widest uppercase hover:bg-ink/90 transition-colors disabled:opacity-70"
                >
                  {isSubmitting ? "SENDING..." : "SEND MESSAGE"}
                  {!isSubmitting && <Send size={16} className="transform transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />}
                </button>
              </div>

              {statusMessage && (
                <div className="mt-4 font-inter text-sm text-ink/80 font-medium">
                  {statusMessage}
                </div>
              )}

            </form>
          </div>
        </div>

      </div>
    </motion.section>
  );
}
