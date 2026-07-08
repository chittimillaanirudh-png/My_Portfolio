import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LogIn, Lock, User, Save, Plus, Trash2, Edit3, LogOut, 
  Terminal, Cpu, Code2, Network, Globe, Sparkles, AlertCircle, CheckCircle, RefreshCw
} from "lucide-react";
import Toast from "../components/Toast";

// Map icon string to Lucide icon component
const iconMap = {
  Terminal,
  Cpu,
  Code2,
  Network,
  Globe,
  Sparkles
};

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  // Tabs: 'banner' | 'skills' | 'projects'
  const [activeTab, setActiveTab] = useState("banner");
  
  // Portfolio Data
  const [portfolio, setPortfolio] = useState({
    homeBanner: {
      title: "",
      subtitle: "",
      roles: "",
      description: "",
      imageUrl: ""
    },
    skills: [],
    projects: []
  });

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [toast, setToast] = useState(null);

  // Modals / Editors State
  const [editingSkill, setEditingSkill] = useState(null); // null or skill object being added/edited
  const [editingProject, setEditingProject] = useState(null); // null or project object being added/edited

  useEffect(() => {
    // Check session
    const token = sessionStorage.getItem("admin_token");
    if (token === "anirudh-portfolio-admin-session-token-2026") {
      setIsLoggedIn(true);
    }
    
    // Fetch data
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    setIsLoadingData(true);
    try {
      const res = await fetch("/api/portfolio");
      if (res.ok) {
        const data = await res.json();
        setPortfolio(data);
      }
    } catch (err) {
      console.error("Failed to fetch portfolio data:", err);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!adminId || !password) {
      setLoginError("Please enter both Admin ID and Password");
      return;
    }

    setIsSubmittingLogin(true);
    setLoginError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId, password })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        sessionStorage.setItem("admin_token", data.token);
        setIsLoggedIn(true);
        setToast({ message: "Successfully logged in as Admin!", type: "success" });
      } else {
        setLoginError(data.error || "Authentication failed");
      }
    } catch (err) {
      setLoginError("Server communication error. Please try again.");
    } finally {
      setIsSubmittingLogin(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_token");
    setIsLoggedIn(false);
    setAdminId("");
    setPassword("");
    setToast({ message: "Logged out successfully", type: "success" });
  };

  const savePortfolio = async (updatedData) => {
    const token = sessionStorage.getItem("admin_token");
    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });

      if (res.ok) {
        setPortfolio(updatedData);
        setToast({ message: "Portfolio saved and deployed successfully!", type: "success" });
        return true;
      } else {
        const errData = await res.json();
        setToast({ message: errData.error || "Failed to save portfolio.", type: "error" });
        return false;
      }
    } catch (err) {
      setToast({ message: "Failed to connect to the server.", type: "error" });
      return false;
    }
  };

  // Home Banner Editors
  const handleBannerChange = (field, value) => {
    setPortfolio({
      ...portfolio,
      homeBanner: {
        ...portfolio.homeBanner,
        [field]: value
      }
    });
  };

  const handleSaveBanner = async () => {
    await savePortfolio(portfolio);
  };

  // Skill Handlers
  const handleAddSkillInit = () => {
    setEditingSkill({
      id: String(portfolio.skills.length + 1).padStart(2, "0"),
      title: "",
      desc: "",
      iconName: "Terminal",
      color: "hover:border-primary/40 hover:shadow-[0_20px_40px_rgba(255,142,127,0.05)]",
      textColor: "text-primary"
    });
  };

  const handleEditSkillInit = (skill) => {
    setEditingSkill({ ...skill });
  };

  const handleSaveSkill = async () => {
    if (!editingSkill.title || !editingSkill.desc) {
      setToast({ message: "Please enter title and description for the skill.", type: "error" });
      return;
    }

    let updatedSkills = [...portfolio.skills];
    const index = updatedSkills.findIndex(s => s.id === editingSkill.id);
    
    if (index >= 0) {
      // Edit existing
      updatedSkills[index] = editingSkill;
    } else {
      // Add new
      updatedSkills.push(editingSkill);
    }

    const updatedPortfolio = { ...portfolio, skills: updatedSkills };
    const success = await savePortfolio(updatedPortfolio);
    if (success) {
      setEditingSkill(null);
    }
  };

  const handleDeleteSkill = async (id) => {
    if (window.confirm("Are you sure you want to delete this skill?")) {
      const updatedSkills = portfolio.skills.filter(s => s.id !== id);
      const updatedPortfolio = { ...portfolio, skills: updatedSkills };
      await savePortfolio(updatedPortfolio);
    }
  };

  // Project Handlers
  const handleAddProjectInit = () => {
    setEditingProject({
      title: "",
      subtitle: "",
      category: "Live Project",
      desc: "",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80",
      tags: [],
      link: ""
    });
  };

  const handleEditProjectInit = (project) => {
    setEditingProject({ ...project });
  };

  const handleSaveProject = async () => {
    if (!editingProject.title || !editingProject.desc) {
      setToast({ message: "Please fill out project title and description", type: "error" });
      return;
    }

    let updatedProjects = [...portfolio.projects];
    // Find by title as unique identifier for this client demo list
    const index = updatedProjects.findIndex(p => p.title === editingProject.title);

    if (index >= 0) {
      updatedProjects[index] = editingProject;
    } else {
      updatedProjects.push(editingProject);
    }

    const updatedPortfolio = { ...portfolio, projects: updatedProjects };
    const success = await savePortfolio(updatedPortfolio);
    if (success) {
      setEditingProject(null);
    }
  };

  const handleDeleteProject = async (title) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      const updatedProjects = portfolio.projects.filter(p => p.title !== title);
      const updatedPortfolio = { ...portfolio, projects: updatedProjects };
      await savePortfolio(updatedPortfolio);
    }
  };

  // Login view
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32 pb-24 px-8 bg-black relative">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
          <div className="absolute top-[30%] left-[25%] w-72 h-72 bg-[#ff8e7f]/20 rounded-full blur-[100px]" />
          <div className="absolute top-[50%] right-[25%] w-72 h-72 bg-[#c0ee91]/20 rounded-full blur-[100px]" />
        </div>

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-md bg-[#121212]/90 backdrop-blur-md p-8 rounded-3xl border border-outline-variant/20 shadow-2xl space-y-8"
        >
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-[#ff8e7f]/20 to-[#c0ee91]/20 flex items-center justify-center border border-[#ff8e7f]/30">
              <Lock className="text-[#ff8a7a]" size={24} />
            </div>
            <h1 className="text-2xl font-headline font-light uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#f3a77d] via-[#ff8a7a] to-[#c0ee91]">
              Admin Authentication
            </h1>
            <p className="text-xs text-[#acabaa] font-body tracking-wider uppercase">
              Provide credentials to access control panel
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6 font-body">
            {loginError && (
              <div className="p-4 bg-primary/10 border border-primary/30 rounded-xl flex items-center gap-3 text-xs text-primary">
                <AlertCircle size={16} />
                <span>{loginError}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-headline ml-1">
                Admin ID
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  placeholder="admin"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  className="w-full bg-surface-container-high/50 border border-outline-variant/20 rounded-xl pl-12 pr-4 py-4 text-on-surface placeholder:text-outline-variant/30 focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-headline ml-1">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface-container-high/50 border border-outline-variant/20 rounded-xl pl-12 pr-4 py-4 text-on-surface placeholder:text-outline-variant/30 focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmittingLogin}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-transparent border border-outline-variant/30 text-[#ff8a7a] hover:border-[#ff8a7a] hover:text-white hover:shadow-[0_0_15px_-2px_#ff8a7a] transition-all duration-300 scale-95 active:scale-90 font-headline uppercase text-xs tracking-widest"
            >
              {isSubmittingLogin ? (
                <>
                  <RefreshCw className="animate-spin" size={16} />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <LogIn size={16} />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Dashboard view
  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full relative z-10 font-body text-on-surface">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 pb-6 border-b border-outline-variant/10">
        <div className="space-y-2">
          <div className="inline-block px-3 py-1 border border-outline-variant/20 rounded-full">
            <span className="label-md uppercase tracking-[0.2em] text-[#c0ee91] text-[10px] font-headline">
              Control Center
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-headline font-light tracking-tight">
            Portfolio Admin Panel
          </h1>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-6 py-3 rounded-full border border-primary/20 text-primary hover:bg-primary/5 hover:border-primary transition-all duration-300 text-xs uppercase tracking-widest font-headline"
        >
          <LogOut size={14} />
          <span>Logout</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-outline-variant/10 pb-4 mb-8 font-headline text-xs tracking-widest uppercase">
        <button
          onClick={() => setActiveTab("banner")}
          className={`pb-2 px-4 transition-all duration-300 relative ${
            activeTab === "banner" ? "text-[#ff8a7a]" : "text-[#acabaa] hover:text-[#ff8a7a]"
          }`}
        >
          Hero Banner
          {activeTab === "banner" && (
            <motion.div layoutId="tab-line" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ff8a7a]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("skills")}
          className={`pb-2 px-4 transition-all duration-300 relative ${
            activeTab === "skills" ? "text-[#ff8a7a]" : "text-[#acabaa] hover:text-[#ff8a7a]"
          }`}
        >
          Skills
          {activeTab === "skills" && (
            <motion.div layoutId="tab-line" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ff8a7a]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("projects")}
          className={`pb-2 px-4 transition-all duration-300 relative ${
            activeTab === "projects" ? "text-[#ff8a7a]" : "text-[#acabaa] hover:text-[#ff8a7a]"
          }`}
        >
          Projects
          {activeTab === "projects" && (
            <motion.div layoutId="tab-line" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ff8a7a]" />
          )}
        </button>
      </div>

      {isLoadingData ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-[#acabaa]">
          <RefreshCw className="animate-spin text-[#ff8a7a]" size={36} />
          <span className="text-xs uppercase tracking-widest font-headline">Loading Configuration...</span>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {/* TAB 1: HERO BANNER */}
          {activeTab === "banner" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8 max-w-4xl"
            >
              <div className="bg-surface-variant/40 backdrop-blur-md border border-outline-variant/10 p-8 rounded-3xl space-y-6">
                <h3 className="text-lg font-headline font-light uppercase tracking-widest text-on-surface mb-2">
                  Edit Homepage Hero Banner Settings
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-[#acabaa] font-headline ml-1">
                      Main Title Header
                    </label>
                    <input
                      type="text"
                      value={portfolio.homeBanner?.title || ""}
                      onChange={(e) => handleBannerChange("title", e.target.value)}
                      className="w-full bg-surface-container-high/50 border border-outline-variant/20 rounded-xl px-4 py-3 text-on-surface placeholder:text-outline-variant/30 focus:outline-none focus:border-[#ff8a7a]/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-[#acabaa] font-headline ml-1">
                      Secondary Top Subtitle
                    </label>
                    <input
                      type="text"
                      value={portfolio.homeBanner?.subtitle || ""}
                      onChange={(e) => handleBannerChange("subtitle", e.target.value)}
                      className="w-full bg-surface-container-high/50 border border-outline-variant/20 rounded-xl px-4 py-3 text-on-surface placeholder:text-outline-variant/30 focus:outline-none focus:border-[#ff8a7a]/50"
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2 space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-[#acabaa] font-headline ml-1">
                      Creative Status / Roles (Separated by |)
                    </label>
                    <input
                      type="text"
                      value={portfolio.homeBanner?.roles || ""}
                      onChange={(e) => handleBannerChange("roles", e.target.value)}
                      className="w-full bg-surface-container-high/50 border border-outline-variant/20 rounded-xl px-4 py-3 text-on-surface placeholder:text-outline-variant/30 focus:outline-none focus:border-[#ff8a7a]/50"
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2 space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-[#acabaa] font-headline ml-1">
                      Cinematic Portrait Image URL
                    </label>
                    <input
                      type="text"
                      value={portfolio.homeBanner?.imageUrl || ""}
                      onChange={(e) => handleBannerChange("imageUrl", e.target.value)}
                      className="w-full bg-surface-container-high/50 border border-outline-variant/20 rounded-xl px-4 py-3 text-on-surface placeholder:text-outline-variant/30 focus:outline-none focus:border-[#ff8a7a]/50"
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2 space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-[#acabaa] font-headline ml-1">
                      Detailed Pitch Description
                    </label>
                    <textarea
                      rows={5}
                      value={portfolio.homeBanner?.description || ""}
                      onChange={(e) => handleBannerChange("description", e.target.value)}
                      className="w-full bg-surface-container-high/50 border border-outline-variant/20 rounded-xl px-4 py-3 text-on-surface placeholder:text-outline-variant/30 focus:outline-none focus:border-[#ff8a7a]/50 resize-none"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleSaveBanner}
                    className="flex items-center gap-2 px-8 py-4 bg-transparent rounded-full border border-outline-variant/30 text-on-surface font-headline uppercase text-xs tracking-widest hover:border-[#ff8a7a] hover:text-[#ff8a7a] hover:shadow-[0_0_15px_-2px_#ff8e7f] transition-all duration-300"
                  >
                    <Save size={16} />
                    <span>Save Banner Settings</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: SKILLS LIST */}
          {activeTab === "skills" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              {/* Controls */}
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-headline font-light uppercase tracking-widest text-[#acabaa]">
                  Manage Technical Skills
                </h3>
                <button
                  onClick={handleAddSkillInit}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-transparent border border-secondary/20 text-[#c0ee91] hover:border-[#c0ee91] hover:shadow-[0_0_15px_-2px_#c0ee91] transition-all duration-300 text-xs uppercase tracking-widest font-headline"
                >
                  <Plus size={16} />
                  <span>Add Skill</span>
                </button>
              </div>

              {/* Skills Editor Frame */}
              {editingSkill && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-surface-container-low border border-[#ff8a7a]/20 p-8 rounded-3xl space-y-6"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="text-md font-headline text-[#ff8a7a] uppercase tracking-widest">
                      {editingSkill.title ? `Edit Skill: ${editingSkill.title}` : "Add New Skill"}
                    </h4>
                    <span className="text-xs font-mono text-on-surface-variant/60">ID: {editingSkill.id}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-[#acabaa] font-headline ml-1">
                        Skill Title
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Docker"
                        value={editingSkill.title}
                        onChange={(e) => setEditingSkill({ ...editingSkill, title: e.target.value })}
                        className="w-full bg-surface-container-high/50 border border-outline-variant/20 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-[#ff8a7a]/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-[#acabaa] font-headline ml-1">
                        Lucide Icon Name
                      </label>
                      <select
                        value={editingSkill.iconName}
                        onChange={(e) => setEditingSkill({ ...editingSkill, iconName: e.target.value })}
                        className="w-full bg-surface-container-high/50 border border-outline-variant/20 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-[#ff8a7a]/50"
                      >
                        <option value="Terminal">Terminal (C/Console)</option>
                        <option value="Cpu">Cpu (C++/Logic)</option>
                        <option value="Code2">Code2 (Python/Programming)</option>
                        <option value="Network">Network (DSA/Graphs)</option>
                        <option value="Globe">Globe (Web/Internet)</option>
                        <option value="Sparkles">Sparkles (AI/Prompting)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-[#acabaa] font-headline ml-1">
                        Accent Color Theme
                      </label>
                      <select
                        value={editingSkill.textColor}
                        onChange={(e) => {
                          const val = e.target.value;
                          let borderClass = "";
                          if (val === "text-primary") {
                            borderClass = "hover:border-primary/40 hover:shadow-[0_20px_40px_rgba(255,142,127,0.05)]";
                          } else if (val === "text-secondary") {
                            borderClass = "hover:border-secondary/40 hover:shadow-[0_20px_40px_rgba(192,238,145,0.05)]";
                          } else if (val === "text-tertiary") {
                            borderClass = "hover:border-tertiary/40 hover:shadow-[0_20px_40px_rgba(243,167,125,0.05)]";
                          } else if (val === "text-[#c0ee91]") {
                            borderClass = "hover:border-[#c0ee91]/40 hover:shadow-[0_20px_40px_rgba(192,238,145,0.05)]";
                          } else {
                            borderClass = "hover:border-[#ff8e7f]/40 hover:shadow-[0_20px_40px_rgba(255,142,127,0.05)]";
                          }
                          setEditingSkill({
                            ...editingSkill,
                            textColor: val,
                            color: borderClass
                          });
                        }}
                        className="w-full bg-surface-container-high/50 border border-outline-variant/20 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-[#ff8a7a]/50"
                      >
                        <option value="text-primary">Peach Orange (Primary)</option>
                        <option value="text-secondary">Lime Green (Secondary)</option>
                        <option value="text-tertiary">Warm Clay (Tertiary)</option>
                        <option value="text-[#c0ee91]">Neo Green</option>
                        <option value="text-[#ff8e7f]">Neon Pink</option>
                      </select>
                    </div>

                    <div className="col-span-1 md:col-span-3 space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-[#acabaa] font-headline ml-1">
                        Detailed Skill Description
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Describe your experience with this tech..."
                        value={editingSkill.desc}
                        onChange={(e) => setEditingSkill({ ...editingSkill, desc: e.target.value })}
                        className="w-full bg-surface-container-high/50 border border-outline-variant/20 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-[#ff8a7a]/50 resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-2">
                    <button
                      onClick={handleSaveSkill}
                      className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#ff8a7a]/10 border border-[#ff8a7a]/30 text-[#ff8a7a] hover:bg-[#ff8a7a] hover:text-black transition-all duration-300 text-xs uppercase tracking-widest font-headline"
                    >
                      <Save size={14} />
                      <span>Apply Changes</span>
                    </button>
                    <button
                      onClick={() => setEditingSkill(null)}
                      className="flex items-center gap-2 px-6 py-3 rounded-full bg-transparent border border-outline-variant/20 text-on-surface-variant hover:text-white transition-all duration-300 text-xs uppercase tracking-widest font-headline"
                    >
                      <span>Cancel</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Skills Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {portfolio.skills.map((skill) => {
                  const Icon = iconMap[skill.iconName] || Code2;
                  return (
                    <div
                      key={skill.id}
                      className="p-6 rounded-2xl bg-surface-variant/20 border border-outline-variant/10 flex items-start justify-between gap-4 hover:border-outline-variant/40 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-surface-container-high text-on-surface">
                          <Icon size={24} className={skill.textColor} />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-headline text-lg font-light flex items-center gap-2">
                            <span>{skill.title}</span>
                            <span className="text-[10px] font-mono opacity-50 px-2 py-0.5 border border-outline-variant/15 rounded-full">{skill.id}</span>
                          </h4>
                          <p className="text-xs text-on-surface-variant font-light leading-relaxed font-body max-w-sm">
                            {skill.desc}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditSkillInit(skill)}
                          className="p-2 rounded-full text-secondary hover:bg-secondary/10 transition-colors"
                          title="Edit skill"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteSkill(skill.id)}
                          className="p-2 rounded-full text-primary hover:bg-primary/10 transition-colors"
                          title="Delete skill"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* TAB 3: PROJECTS LIST */}
          {activeTab === "projects" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-headline font-light uppercase tracking-widest text-[#acabaa]">
                  Manage Projects Portfolio
                </h3>
                <button
                  onClick={handleAddProjectInit}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-transparent border border-secondary/20 text-[#c0ee91] hover:border-[#c0ee91] hover:shadow-[0_0_15px_-2px_#c0ee91] transition-all duration-300 text-xs uppercase tracking-widest font-headline"
                >
                  <Plus size={16} />
                  <span>Add Project</span>
                </button>
              </div>

              {/* Editing Project Frame */}
              {editingProject && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-surface-container-low border border-[#ff8a7a]/20 p-8 rounded-3xl space-y-6"
                >
                  <h4 className="text-md font-headline text-[#ff8a7a] uppercase tracking-widest">
                    {editingProject.title ? `Edit Project: ${editingProject.title}` : "Add New Project"}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-[#acabaa] font-headline ml-1">
                        Project Title
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Medicine Manager"
                        value={editingProject.title}
                        onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                        className="w-full bg-surface-container-high/50 border border-outline-variant/20 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-[#ff8a7a]/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-[#acabaa] font-headline ml-1">
                        Category Tag / Status
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Live Project"
                        value={editingProject.category}
                        onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                        className="w-full bg-surface-container-high/50 border border-outline-variant/20 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-[#ff8a7a]/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-[#acabaa] font-headline ml-1">
                        Slogan / Subtitle
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Let Me Tell You"
                        value={editingProject.subtitle}
                        onChange={(e) => setEditingProject({ ...editingProject, subtitle: e.target.value })}
                        className="w-full bg-surface-container-high/50 border border-outline-variant/20 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-[#ff8a7a]/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-[#acabaa] font-headline ml-1">
                        Live Application Link (URL)
                      </label>
                      <input
                        type="text"
                        placeholder="https://example.com"
                        value={editingProject.link}
                        onChange={(e) => setEditingProject({ ...editingProject, link: e.target.value })}
                        className="w-full bg-surface-container-high/50 border border-outline-variant/20 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-[#ff8a7a]/50"
                      />
                    </div>

                    <div className="col-span-1 md:col-span-2 space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-[#acabaa] font-headline ml-1">
                        Cover Image Link (URL)
                      </label>
                      <input
                        type="text"
                        value={editingProject.image}
                        onChange={(e) => setEditingProject({ ...editingProject, image: e.target.value })}
                        className="w-full bg-surface-container-high/50 border border-outline-variant/20 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-[#ff8a7a]/50"
                      />
                    </div>

                    <div className="col-span-1 md:col-span-2 space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-[#acabaa] font-headline ml-1">
                        Technical Tags (Comma Separated)
                      </label>
                      <input
                        type="text"
                        placeholder="React, Tailwind, Node.js"
                        value={editingProject.tags.join(", ")}
                        onChange={(e) => {
                          const tagList = e.target.value.split(",").map(t => t.trim()).filter(Boolean);
                          setEditingProject({ ...editingProject, tags: tagList });
                        }}
                        className="w-full bg-surface-container-high/50 border border-outline-variant/20 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-[#ff8a7a]/50"
                      />
                    </div>

                    <div className="col-span-1 md:col-span-2 space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-[#acabaa] font-headline ml-1">
                        Project Pitch Description
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Write dynamic pitch text describing technical hurdles and execution..."
                        value={editingProject.desc}
                        onChange={(e) => setEditingProject({ ...editingProject, desc: e.target.value })}
                        className="w-full bg-surface-container-high/50 border border-outline-variant/20 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-[#ff8a7a]/50 resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-2">
                    <button
                      onClick={handleSaveProject}
                      className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#ff8a7a]/10 border border-[#ff8a7a]/30 text-[#ff8a7a] hover:bg-[#ff8a7a] hover:text-black transition-all duration-300 text-xs uppercase tracking-widest font-headline"
                    >
                      <Save size={14} />
                      <span>Save Project</span>
                    </button>
                    <button
                      onClick={() => setEditingProject(null)}
                      className="flex items-center gap-2 px-6 py-3 rounded-full bg-transparent border border-outline-variant/20 text-on-surface-variant hover:text-white transition-all duration-300 text-xs uppercase tracking-widest font-headline"
                    >
                      <span>Cancel</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Projects List View */}
              <div className="space-y-6">
                {portfolio.projects.map((project, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-surface-variant/20 border border-outline-variant/10 flex flex-col md:flex-row justify-between gap-6 hover:border-outline-variant/30 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-32 h-20 rounded-lg object-cover bg-surface-container"
                      />
                      <div className="space-y-1">
                        <span className="text-[10px] font-headline uppercase tracking-widest text-[#ff8a7a]">
                          {project.category}
                        </span>
                        <h4 className="font-headline text-xl font-light">
                          {project.title}
                        </h4>
                        <p className="text-xs text-[#acabaa] font-body tracking-wider uppercase">
                          {project.subtitle}
                        </p>
                        <p className="text-xs text-on-surface-variant font-light line-clamp-2 max-w-xl font-body">
                          {project.desc}
                        </p>
                      </div>
                    </div>

                    <div className="flex md:flex-col justify-end gap-3 self-center">
                      <button
                        onClick={() => handleEditProjectInit(project)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container-high border border-outline-variant/20 text-secondary hover:text-white hover:border-[#c0ee91] text-xs font-headline tracking-widest uppercase transition-colors"
                      >
                        <Edit3 size={14} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.title)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container-high border border-outline-variant/20 text-primary hover:text-white hover:border-[#ff8e7f] text-xs font-headline tracking-widest uppercase transition-colors"
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
