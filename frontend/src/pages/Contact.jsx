import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Share2, Send, ArrowRight } from "lucide-react";
import Toast from "../components/Toast";
import API_BASE from "../utils/api";

export default function Contact() {
  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null); // { message, type }
  const [emailConfig, setEmailConfig] = useState({
    serviceId: "service_bdu1n5v",
    templateId: "template_7u102re",
    publicKey: "KqrFRK0YlakuNxj9K"
  });

  useEffect(() => {
    fetch(`${API_BASE}/api/config/emailjs`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load email config from server");
        return res.json();
      })
      .then((data) => {
        if (data && data.serviceId && data.templateId && data.publicKey) {
          setEmailConfig(data);
          if (window.emailjs) {
            window.emailjs.init(data.publicKey);
          }
        }
      })
      .catch((err) => {
        console.warn("Using default fallback EmailJS credentials:", err);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.user_name || !formData.user_email || !formData.message) {
      setToast({
        message: "Please fill out all the fields before sending.",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);

    // Save to backend database for admin panel
    fetch(`${API_BASE}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.user_name,
        email: formData.user_email,
        message: formData.message
      })
    }).catch(err => console.error("Failed to save to backend:", err));

    // Call window.emailjs directly (loaded via CDN in index.html)
    if (window.emailjs) {
      window.emailjs.init(emailConfig.publicKey);
      window.emailjs
        .sendForm(
          emailConfig.serviceId,
          emailConfig.templateId,
          formRef.current
        )
        .then(
          () => {
            setToast({
              message: "Message sent successfully! Thank you for reaching out.",
              type: "success",
            });
            setFormData({ user_name: "", user_email: "", message: "" });
            setIsSubmitting(false);
          },
          (error) => {
            console.error("EmailJS Error:", error);
            setToast({
              message: "Failed to send the message. Please try again or email directly.",
              type: "error",
            });
            setIsSubmitting(false);
          }
        );
    } else {
      // Fallback if script didn't load
      setTimeout(() => {
        console.warn("EmailJS is not loaded. Form fallback simulated.");
        setToast({
          message: "Message logged! Thanks for reaching out.",
          type: "success",
        });
        setFormData({ user_name: "", user_email: "", message: "" });
        setIsSubmitting(false);
      }, 1000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8 }}
      className="relative flex-grow pt-40 pb-20 px-8 max-w-[1440px] mx-auto w-full z-10"
    >
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        {/* Left Side: Direct contact information */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-12">
          <header className="space-y-6">
            <span className="label-md uppercase tracking-[0.2em] text-secondary font-headline text-[10px] block">
              Contact
            </span>
            <h1 className="text-5xl md:text-7xl font-headline font-light leading-tight text-transparent bg-clip-text bg-gradient-to-r from-[#f3a77d] via-[#ff8a7a] to-[#c0ee91] tracking-tight">
              Get In Touch
            </h1>
            <p className="text-lg md:text-xl text-on-surface-variant font-light leading-relaxed max-w-md font-body">
              Have a project idea, collaboration opportunity, or just want to connect? Feel free to reach out — I’d love to hear from you.
            </p>
          </header>

          <div className="space-y-8">
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center border border-outline-variant/10 group-hover:border-primary/40 transition-colors duration-500">
                <Mail className="text-primary" size={20} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-headline">
                  Email
                </p>
                <a
                  className="text-on-surface hover:text-primary transition-colors font-body"
                  href="mailto:chittimillaanirudh@gmail.com"
                >
                  chittimillaanirudh@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center border border-outline-variant/10 group-hover:border-secondary/40 transition-colors duration-500">
                <Share2 className="text-secondary" size={20} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-headline">
                  Social Profiles
                </p>
                <div className="flex gap-4 mt-1 font-body text-sm">
                  <a
                    className="text-on-surface hover:text-secondary transition-colors"
                    href="https://www.linkedin.com/in/anirudh-chittimilla-a74360341"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                  </a>
                  <span className="text-outline-variant">/</span>
                  <a
                    className="text-on-surface hover:text-secondary transition-colors"
                    href="https://www.instagram.com/ch_anirudh37_official"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Instagram
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-outline-variant/10">
            <p className="text-lg font-headline font-light italic text-on-surface-variant/60">
              "Let’s build something amazing together."
            </p>
          </div>
        </div>

        {/* Right Side: Contact Form Card */}
        <div className="lg:col-span-7">
          <div className="bg-surface-variant/40 backdrop-blur-2xl rounded-3xl p-8 md:p-12 border border-outline-variant/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8">
              <Send className="text-outline-variant/20 rotate-45" size={48} />
            </div>

            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="space-y-8 relative z-10"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label
                    className="label-md uppercase tracking-widest text-[10px] text-on-surface-variant ml-1 block font-headline"
                    for="name"
                  >
                    Name
                  </label>
                  <input
                    className="w-full bg-surface-container-high/50 border border-outline-variant/20 rounded-xl px-6 py-4 text-on-surface placeholder:text-outline-variant/40 focus:outline-none focus:ring-0 focus:border-primary/50 transition-all duration-300 font-body"
                    id="name"
                    name="user_name"
                    value={formData.user_name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    type="text"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    className="label-md uppercase tracking-widest text-[10px] text-on-surface-variant ml-1 block font-headline"
                    for="email"
                  >
                    Email
                  </label>
                  <input
                    className="w-full bg-surface-container-high/50 border border-outline-variant/20 rounded-xl px-6 py-4 text-on-surface placeholder:text-outline-variant/40 focus:outline-none focus:ring-0 focus:border-primary/50 transition-all duration-300 font-body"
                    id="email"
                    name="user_email"
                    value={formData.user_email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    type="email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  className="label-md uppercase tracking-widest text-[10px] text-on-surface-variant ml-1 block font-headline"
                  for="message"
                >
                  Message
                </label>
                <textarea
                  className="w-full bg-surface-container-high/50 border border-outline-variant/20 rounded-xl px-6 py-4 text-on-surface placeholder:text-outline-variant/40 focus:outline-none focus:ring-0 focus:border-primary/50 transition-all duration-300 resize-none font-body"
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell me about your vision..."
                  rows="5"
                />
              </div>

              <div className="pt-4">
                <button
                  className="group relative w-full md:w-auto overflow-hidden rounded-xl px-12 py-5 font-headline font-medium tracking-widest text-on-surface transition-all duration-500 bg-transparent"
                  type="submit"
                  disabled={isSubmitting}
                >
                  <div className="absolute inset-0 bg-transparent border border-outline-variant/20 group-hover:border-primary group-hover:shadow-[0_0_25px_-5px_#ff8a7a] transition-all duration-500"></div>
                  <span className="relative flex items-center justify-center gap-3 text-xs uppercase">
                    {isSubmitting ? "Sending..." : "Send Message"}
                    <ArrowRight
                      className="group-hover:translate-x-1 transition-transform"
                      size={14}
                    />
                  </span>
                </button>
              </div>
            </form>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="h-24 rounded-2xl bg-surface-container-low border border-outline-variant/10 overflow-hidden">
              <img
                className="w-full h-full object-cover grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
                alt="Cosmic satellite view of city lights"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC--R7O-2vLV7GMpr8vmkWeq9aHYEKwKLssMzvgjSmLfQETbuAQpiTwZSklAt83IXRYpSsLw1g_KG6bQmgUonevAa32JpReTg3e_RsmN0Q8h54W7LEfEGWwlCE9pDa2veoZkl8NAJCGfBn-jWT2AgBVcGSVd1Ar7YiFRahvudx9_q6cq6n1tJgtp9j-VaMVwj28n8hWhFrn34vD8S4ftoAKZOg0an2gk4MK3jvdlX7aH60ufXw40Imi4NSKKJ3uBcCGajjrMO9jVY3c"
              />
            </div>
            <div className="col-span-2 h-24 rounded-2xl bg-surface-container-low border border-outline-variant/10 flex items-center px-8">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-body">
                  Available for remote collaborations worldwide
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
