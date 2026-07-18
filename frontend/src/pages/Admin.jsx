import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LogIn, Lock, User, Save, Plus, Trash2, Edit3, LogOut, 
  Terminal, Cpu, Code2, Network, Globe, Sparkles, AlertCircle, CheckCircle, RefreshCw
} from "lucide-react";
import Toast from "../components/Toast";
import API_BASE from "../utils/api";
import Logo from "../components/Logo";

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
    projects: [],
    about: { title: "", description: "", mission: "", locationCurrent: "", locationNative: "" },
    experience: [],
    contactMessages: []
  });

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [toast, setToast] = useState(null);

  // Modals / Editors State
  const [editingSkill, setEditingSkill] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [editingExperience, setEditingExperience] = useState(null);
  
  // Custom Confirmation Modal State
  const [confirmDelete, setConfirmDelete] = useState(null); // { type, id, name }

  useEffect(() => {
    // Check session
    const token = sessionStorage.getItem("admin_token");
    if (token) {
      setIsLoggedIn(true);
    }
    
    // Fetch data
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    setIsLoadingData(true);
    try {
      const res = await fetch(`${API_BASE}/api/portfolio`);
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
      const res = await fetch(`${API_BASE}/api/admin/login`, {
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
      const res = await fetch(`${API_BASE}/api/portfolio`, {
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
      color: "hover:border-ink/20 hover:shadow-[0_20px_40px_rgba(255,142,127,0.05)]",
      textColor: "text-ink"
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
    setConfirmDelete({ type: "skill", id, name: "this skill" });
  };

  // Project Handlers
  const handleAddProjectInit = () => {
    setEditingProject({
      id: "",
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
    let index = -1;
    if (editingProject.id) {
      index = updatedProjects.findIndex(p => p.id === editingProject.id);
    } else {
      index = updatedProjects.findIndex(p => p.title === editingProject.title);
    }

    const projectToSave = { ...editingProject, id: editingProject.id || Date.now().toString() };

    if (index >= 0) {
      updatedProjects[index] = projectToSave;
    } else {
      updatedProjects.push(projectToSave);
    }

    const updatedPortfolio = { ...portfolio, projects: updatedProjects };
    const success = await savePortfolio(updatedPortfolio);
    if (success) {
      setEditingProject(null);
    }
  };

  const handleDeleteProject = async (id) => {
    setConfirmDelete({ type: "project", id, name: "this project" });
  };

  // Experience Handlers
  const handleAddExperienceInit = () => {
    setEditingExperience({
      id: "",
      role: "",
      company: "",
      duration: "",
      description: ""
    });
  };

  const handleEditExperienceInit = (exp) => {
    setEditingExperience({ ...exp });
  };

  const handleSaveExperience = async () => {
    if (!editingExperience.role || !editingExperience.company) {
      setToast({ message: "Please fill out role and company", type: "error" });
      return;
    }

    let updatedExp = [...(portfolio.experience || [])];
    let index = -1;
    if (editingExperience.id) {
      index = updatedExp.findIndex(e => e.id === editingExperience.id);
    }

    const expToSave = { ...editingExperience, id: editingExperience.id || Date.now().toString() };

    if (index >= 0) {
      updatedExp[index] = expToSave;
    } else {
      updatedExp.push(expToSave);
    }

    const updatedPortfolio = { ...portfolio, experience: updatedExp };
    const success = await savePortfolio(updatedPortfolio);
    if (success) {
      setEditingExperience(null);
    }
  };

  const handleDeleteExperience = async (id) => {
    setConfirmDelete({ type: "experience", id, name: "this experience entry" });
  };

  // About Handlers
  const handleAboutChange = (field, value) => {
    setPortfolio({
      ...portfolio,
      about: {
        ...portfolio.about,
        [field]: value
      }
    });
  };

  const handleSaveAbout = async () => {
    await savePortfolio(portfolio);
  };

  // General Delete Confirmation
  const confirmDeleteAction = async () => {
    if (!confirmDelete) return;
    
    let updatedPortfolio = { ...portfolio };
    
    if (confirmDelete.type === "skill") {
      updatedPortfolio.skills = portfolio.skills.filter(s => s.id !== confirmDelete.id);
    } else if (confirmDelete.type === "project") {
      updatedPortfolio.projects = portfolio.projects.filter(p => p.id !== confirmDelete.id);
    } else if (confirmDelete.type === "experience") {
      updatedPortfolio.experience = portfolio.experience.filter(e => e.id !== confirmDelete.id);
    }

    const success = await savePortfolio(updatedPortfolio);
    if (success) {
      setConfirmDelete(null);
    }
  };

  // Login view
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32 pb-24 px-8 bg-paper text-ink relative">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
          <div className="absolute top-[30%] left-[25%] w-72 h-72 bg-transparent rounded-full blur-[100px]" />
          <div className="absolute top-[50%] right-[25%] w-72 h-72 bg-transparent rounded-full blur-[100px]" />
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
          className="relative z-10 w-full max-w-md bg-paper backdrop-blur-md p-8 rounded-3xl border border-ink/20 shadow-2xl space-y-8"
        >
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto flex items-center justify-center">
              <Logo className="w-16 h-16 text-ink" />
            </div>
            <h1 className="text-2xl font-bebas font-light uppercase tracking-widest text-ink bg-gradient-to-r from-ink via-ink to-ink">
              Admin Authentication
            </h1>
            <p className="text-xs text-ink/60 font-inter tracking-wider uppercase">
              Provide credentials to access control panel
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6 font-inter">
            {loginError && (
              <div className="p-4 bg-ink/5 border border-ink/20 rounded-xl flex items-center gap-3 text-xs text-ink">
                <AlertCircle size={16} />
                <span>{loginError}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-ink/60 font-bebas ml-1">
                Admin ID
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/60/50">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  placeholder="admin"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  className="w-full bg-paper border border-ink/20 rounded-xl pl-12 pr-4 py-4 text-ink placeholder:text-outline-variant/30 focus:outline-none focus:border-ink/20 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-ink/60 font-bebas ml-1">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/60/50">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-paper border border-ink/20 rounded-xl pl-12 pr-4 py-4 text-ink placeholder:text-outline-variant/30 focus:outline-none focus:border-ink/20 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmittingLogin}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-transparent border border-ink/30 text-ink font-bold hover:border-ink hover:text-paper hover:shadow-[0_0_15px_-2px_#ff8a7a] transition-all duration-300 scale-95 active:scale-90 font-bebas uppercase text-xs tracking-widest"
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
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full relative z-10 font-inter text-ink">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 pb-6 border-b border-ink/10">
        <div className="space-y-2">
          <div className="inline-block px-3 py-1 border border-ink/20 rounded-full">
            <span className="label-md uppercase tracking-[0.2em] text-ink text-[10px] font-bebas">
              Control Center
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bebas font-light tracking-tight">
            Portfolio Admin Panel
          </h1>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-6 py-3 rounded-full border border-ink/20 text-ink hover:bg-ink/5 hover:border-ink transition-all duration-300 text-xs uppercase tracking-widest font-bebas"
        >
          <LogOut size={14} />
          <span>Logout</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-ink/10 pb-4 mb-8 font-bebas text-xs tracking-widest uppercase overflow-x-auto whitespace-nowrap">
        <button
          onClick={() => setActiveTab("banner")}
          className={`pb-2 px-4 transition-all duration-300 relative ${
            activeTab === "banner" ? "text-ink font-bold" : "text-ink/60 hover:text-ink font-bold"
          }`}
        >
          Hero Banner
          {activeTab === "banner" && (
            <motion.div layoutId="tab-line" className="absolute bottom-0 left-0 right-0 h-[2px] bg-ink" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("about")}
          className={`pb-2 px-4 transition-all duration-300 relative ${
            activeTab === "about" ? "text-ink font-bold" : "text-ink/60 hover:text-ink font-bold"
          }`}
        >
          About
          {activeTab === "about" && (
            <motion.div layoutId="tab-line" className="absolute bottom-0 left-0 right-0 h-[2px] bg-ink" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("skills")}
          className={`pb-2 px-4 transition-all duration-300 relative ${
            activeTab === "skills" ? "text-ink font-bold" : "text-ink/60 hover:text-ink font-bold"
          }`}
        >
          Skills
          {activeTab === "skills" && (
            <motion.div layoutId="tab-line" className="absolute bottom-0 left-0 right-0 h-[2px] bg-ink" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("experience")}
          className={`pb-2 px-4 transition-all duration-300 relative ${
            activeTab === "experience" ? "text-ink font-bold" : "text-ink/60 hover:text-ink font-bold"
          }`}
        >
          Experience
          {activeTab === "experience" && (
            <motion.div layoutId="tab-line" className="absolute bottom-0 left-0 right-0 h-[2px] bg-ink" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("projects")}
          className={`pb-2 px-4 transition-all duration-300 relative ${
            activeTab === "projects" ? "text-ink font-bold" : "text-ink/60 hover:text-ink font-bold"
          }`}
        >
          Projects
          {activeTab === "projects" && (
            <motion.div layoutId="tab-line" className="absolute bottom-0 left-0 right-0 h-[2px] bg-ink" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("messages")}
          className={`pb-2 px-4 transition-all duration-300 relative ${
            activeTab === "messages" ? "text-ink font-bold" : "text-ink/60 hover:text-ink font-bold"
          }`}
        >
          Messages
          {activeTab === "messages" && (
            <motion.div layoutId="tab-line" className="absolute bottom-0 left-0 right-0 h-[2px] bg-ink" />
          )}
        </button>
      </div>

      {isLoadingData ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-ink/60">
          <RefreshCw className="animate-spin text-ink font-bold" size={36} />
          <span className="text-xs uppercase tracking-widest font-bebas">Loading Configuration...</span>
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
              <div className="bg-paper backdrop-blur-md border border-ink/10 p-8 rounded-3xl space-y-6">
                <h3 className="text-lg font-bebas font-light uppercase tracking-widest text-ink mb-2">
                  Edit Homepage Hero Banner Settings
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-ink/60 font-bebas ml-1">
                      Main Title Header
                    </label>
                    <input
                      type="text"
                      value={portfolio.homeBanner?.title || ""}
                      onChange={(e) => handleBannerChange("title", e.target.value)}
                      className="w-full bg-paper border border-ink/20 rounded-xl px-4 py-3 text-ink placeholder:text-outline-variant/30 focus:outline-none focus:border-ink/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-ink/60 font-bebas ml-1">
                      Secondary Top Subtitle
                    </label>
                    <input
                      type="text"
                      value={portfolio.homeBanner?.subtitle || ""}
                      onChange={(e) => handleBannerChange("subtitle", e.target.value)}
                      className="w-full bg-paper border border-ink/20 rounded-xl px-4 py-3 text-ink placeholder:text-outline-variant/30 focus:outline-none focus:border-ink/50"
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2 space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-ink/60 font-bebas ml-1">
                      Creative Status / Roles (Separated by |)
                    </label>
                    <input
                      type="text"
                      value={portfolio.homeBanner?.roles || ""}
                      onChange={(e) => handleBannerChange("roles", e.target.value)}
                      className="w-full bg-paper border border-ink/20 rounded-xl px-4 py-3 text-ink placeholder:text-outline-variant/30 focus:outline-none focus:border-ink/50"
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2 space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-ink/60 font-bebas ml-1">
                      Cinematic Portrait Image URL
                    </label>
                    <input
                      type="text"
                      value={portfolio.homeBanner?.imageUrl || ""}
                      onChange={(e) => handleBannerChange("imageUrl", e.target.value)}
                      className="w-full bg-paper border border-ink/20 rounded-xl px-4 py-3 text-ink placeholder:text-outline-variant/30 focus:outline-none focus:border-ink/50"
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2 space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-ink/60 font-bebas ml-1">
                      Detailed Pitch Description
                    </label>
                    <textarea
                      rows={5}
                      value={portfolio.homeBanner?.description || ""}
                      onChange={(e) => handleBannerChange("description", e.target.value)}
                      className="w-full bg-paper border border-ink/20 rounded-xl px-4 py-3 text-ink placeholder:text-outline-variant/30 focus:outline-none focus:border-ink/50 resize-none"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleSaveBanner}
                    className="flex items-center gap-2 px-8 py-4 bg-transparent rounded-full border border-ink/30 text-ink font-bebas uppercase text-xs tracking-widest hover:border-ink hover:text-ink font-bold hover:shadow-[0_0_15px_-2px_#ff8e7f] transition-all duration-300"
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
                <h3 className="text-lg font-bebas font-light uppercase tracking-widest text-ink/60">
                  Manage Technical Skills
                </h3>
                <button
                  onClick={handleAddSkillInit}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-transparent border border-ink/20 text-ink hover:border-[#c0ee91] hover:shadow-[0_0_15px_-2px_#c0ee91] transition-all duration-300 text-xs uppercase tracking-widest font-bebas"
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
                  className="bg-paper border border-ink/20 p-8 rounded-3xl space-y-6"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="text-md font-bebas text-ink font-bold uppercase tracking-widest">
                      {editingSkill.title ? `Edit Skill: ${editingSkill.title}` : "Add New Skill"}
                    </h4>
                    <span className="text-xs font-mono text-ink/60/60">ID: {editingSkill.id}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-ink/60 font-bebas ml-1">
                        Skill Title
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Docker"
                        value={editingSkill.title}
                        onChange={(e) => setEditingSkill({ ...editingSkill, title: e.target.value })}
                        className="w-full bg-paper border border-ink/20 rounded-xl px-4 py-3 text-ink focus:outline-none focus:border-ink/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-ink/60 font-bebas ml-1">
                        Lucide Icon Name
                      </label>
                      <select
                        value={editingSkill.iconName}
                        onChange={(e) => setEditingSkill({ ...editingSkill, iconName: e.target.value })}
                        className="w-full bg-paper border border-ink/20 rounded-xl px-4 py-3 text-ink focus:outline-none focus:border-ink/50"
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
                      <label className="text-[10px] uppercase tracking-widest text-ink/60 font-bebas ml-1">
                        Accent Color Theme
                      </label>
                      <select
                        value={editingSkill.textColor}
                        onChange={(e) => {
                          const val = e.target.value;
                          let borderClass = "";
                          if (val === "text-ink") {
                            borderClass = "hover:border-ink/20 hover:shadow-[0_20px_40px_rgba(255,142,127,0.05)]";
                          } else if (val === "text-ink") {
                            borderClass = "hover:border-ink/20 hover:shadow-[0_20px_40px_rgba(192,238,145,0.05)]";
                          } else if (val === "text-ink") {
                            borderClass = "hover:border-tertiary/40 hover:shadow-[0_20px_40px_rgba(243,167,125,0.05)]";
                          } else if (val === "text-ink") {
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
                        className="w-full bg-paper border border-ink/20 rounded-xl px-4 py-3 text-ink focus:outline-none focus:border-ink/50"
                      >
                        <option value="text-ink">Peach Orange (Primary)</option>
                        <option value="text-ink">Lime Green (Secondary)</option>
                        <option value="text-ink">Warm Clay (Tertiary)</option>
                        <option value="text-ink">Neo Green</option>
                        <option value="text-[#ff8e7f]">Neon Pink</option>
                      </select>
                    </div>

                    <div className="col-span-1 md:col-span-3 space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-ink/60 font-bebas ml-1">
                        Detailed Skill Description
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Describe your experience with this tech..."
                        value={editingSkill.desc}
                        onChange={(e) => setEditingSkill({ ...editingSkill, desc: e.target.value })}
                        className="w-full bg-paper border border-ink/20 rounded-xl px-4 py-3 text-ink focus:outline-none focus:border-ink/50 resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-2">
                    <button
                      onClick={handleSaveSkill}
                      className="flex items-center gap-2 px-6 py-3 rounded-full bg-ink/10 border border-ink/30 text-ink font-bold hover:bg-ink hover:text-paper transition-all duration-300 text-xs uppercase tracking-widest font-bebas"
                    >
                      <Save size={14} />
                      <span>Apply Changes</span>
                    </button>
                    <button
                      onClick={() => setEditingSkill(null)}
                      className="flex items-center gap-2 px-6 py-3 rounded-full bg-transparent border border-ink/20 text-ink/60 hover:text-paper transition-all duration-300 text-xs uppercase tracking-widest font-bebas"
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
                      className="p-6 rounded-2xl bg-paper border border-ink/10 flex items-start justify-between gap-4 hover:border-outline-variant/40 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-paper text-ink">
                          <Icon size={24} className={skill.textColor} />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-bebas text-lg font-light flex items-center gap-2">
                            <span>{skill.title}</span>
                            <span className="text-[10px] font-mono opacity-50 px-2 py-0.5 border border-outline-variant/15 rounded-full">{skill.id}</span>
                          </h4>
                          <p className="text-xs text-ink/60 font-light leading-relaxed font-inter max-w-sm">
                            {skill.desc}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditSkillInit(skill)}
                          className="p-2 rounded-full text-ink hover:bg-ink/5 transition-colors"
                          title="Edit skill"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteSkill(skill.id)}
                          className="p-2 rounded-full text-ink hover:bg-ink/5 transition-colors"
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
                <h3 className="text-lg font-bebas font-light uppercase tracking-widest text-ink/60">
                  Manage Projects Portfolio
                </h3>
                <button
                  onClick={handleAddProjectInit}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-transparent border border-ink/20 text-ink hover:border-[#c0ee91] hover:shadow-[0_0_15px_-2px_#c0ee91] transition-all duration-300 text-xs uppercase tracking-widest font-bebas"
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
                  className="bg-paper border border-ink/20 p-8 rounded-3xl space-y-6"
                >
                  <h4 className="text-md font-bebas text-ink font-bold uppercase tracking-widest">
                    {editingProject.title ? `Edit Project: ${editingProject.title}` : "Add New Project"}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-ink/60 font-bebas ml-1">
                        Project Title
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Medicine Manager"
                        value={editingProject.title}
                        onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                        className="w-full bg-paper border border-ink/20 rounded-xl px-4 py-3 text-ink focus:outline-none focus:border-ink/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-ink/60 font-bebas ml-1">
                        Category Tag / Status
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Live Project"
                        value={editingProject.category}
                        onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                        className="w-full bg-paper border border-ink/20 rounded-xl px-4 py-3 text-ink focus:outline-none focus:border-ink/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-ink/60 font-bebas ml-1">
                        Slogan / Subtitle
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Let Me Tell You"
                        value={editingProject.subtitle}
                        onChange={(e) => setEditingProject({ ...editingProject, subtitle: e.target.value })}
                        className="w-full bg-paper border border-ink/20 rounded-xl px-4 py-3 text-ink focus:outline-none focus:border-ink/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-ink/60 font-bebas ml-1">
                        Live Application Link (URL)
                      </label>
                      <input
                        type="text"
                        placeholder="https://example.com"
                        value={editingProject.link}
                        onChange={(e) => setEditingProject({ ...editingProject, link: e.target.value })}
                        className="w-full bg-paper border border-ink/20 rounded-xl px-4 py-3 text-ink focus:outline-none focus:border-ink/50"
                      />
                    </div>

                    <div className="col-span-1 md:col-span-2 space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-ink/60 font-bebas ml-1">
                        Cover Image Link (URL)
                      </label>
                      <input
                        type="text"
                        value={editingProject.image}
                        onChange={(e) => setEditingProject({ ...editingProject, image: e.target.value })}
                        className="w-full bg-paper border border-ink/20 rounded-xl px-4 py-3 text-ink focus:outline-none focus:border-ink/50"
                      />
                    </div>

                    <div className="col-span-1 md:col-span-2 space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-ink/60 font-bebas ml-1">
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
                        className="w-full bg-paper border border-ink/20 rounded-xl px-4 py-3 text-ink focus:outline-none focus:border-ink/50"
                      />
                    </div>

                    <div className="col-span-1 md:col-span-2 space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-ink/60 font-bebas ml-1">
                        Project Pitch Description
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Write dynamic pitch text describing technical hurdles and execution..."
                        value={editingProject.desc}
                        onChange={(e) => setEditingProject({ ...editingProject, desc: e.target.value })}
                        className="w-full bg-paper border border-ink/20 rounded-xl px-4 py-3 text-ink focus:outline-none focus:border-ink/50 resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-2">
                    <button
                      onClick={handleSaveProject}
                      className="flex items-center gap-2 px-6 py-3 rounded-full bg-ink/10 border border-ink/30 text-ink font-bold hover:bg-ink hover:text-paper transition-all duration-300 text-xs uppercase tracking-widest font-bebas"
                    >
                      <Save size={14} />
                      <span>Save Project</span>
                    </button>
                    <button
                      onClick={() => setEditingProject(null)}
                      className="flex items-center gap-2 px-6 py-3 rounded-full bg-transparent border border-ink/20 text-ink/60 hover:text-paper transition-all duration-300 text-xs uppercase tracking-widest font-bebas"
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
                    className="p-6 rounded-2xl bg-paper border border-ink/10 flex flex-col md:flex-row justify-between gap-6 hover:border-ink/30 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-32 h-20 rounded-lg object-cover bg-paper"
                      />
                      <div className="space-y-1">
                        <span className="text-[10px] font-bebas uppercase tracking-widest text-ink font-bold">
                          {project.category}
                        </span>
                        <h4 className="font-bebas text-xl font-light">
                          {project.title}
                        </h4>
                        <p className="text-xs text-ink/60 font-inter tracking-wider uppercase">
                          {project.subtitle}
                        </p>
                        <p className="text-xs text-ink/60 font-light line-clamp-2 max-w-xl font-inter">
                          {project.desc}
                        </p>
                      </div>
                    </div>

                    <div className="flex md:flex-col justify-end gap-3 self-center">
                      <button
                        onClick={() => handleEditProjectInit(project)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-paper border border-ink/20 text-ink hover:text-paper hover:border-[#c0ee91] text-xs font-bebas tracking-widest uppercase transition-colors"
                      >
                        <Edit3 size={14} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id || project.title)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-paper border border-ink/20 text-ink hover:text-paper hover:border-[#ff8e7f] text-xs font-bebas tracking-widest uppercase transition-colors"
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

          {/* TAB 4: ABOUT PAGE */}
          {activeTab === "about" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8 max-w-4xl"
            >
              <div className="bg-paper backdrop-blur-md border border-ink/10 p-8 rounded-3xl space-y-6">
                <h3 className="text-lg font-bebas font-light uppercase tracking-widest text-ink mb-2">
                  Edit About Page Content
                </h3>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-ink/60 font-bebas ml-1">
                    Main Title
                  </label>
                  <input
                    type="text"
                    value={portfolio.about?.title || ""}
                    onChange={(e) => handleAboutChange("title", e.target.value)}
                    className="w-full bg-paper border border-ink/20 rounded-xl px-4 py-3 text-ink focus:outline-none focus:border-ink/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-ink/60 font-bebas ml-1">
                    About Description (Paragraphs)
                  </label>
                  <textarea
                    rows={6}
                    value={portfolio.about?.description || ""}
                    onChange={(e) => handleAboutChange("description", e.target.value)}
                    className="w-full bg-paper border border-ink/20 rounded-xl px-4 py-3 text-ink focus:outline-none focus:border-ink/50 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-ink/60 font-bebas ml-1">
                    Mission Statement
                  </label>
                  <textarea
                    rows={3}
                    value={portfolio.about?.mission || ""}
                    onChange={(e) => handleAboutChange("mission", e.target.value)}
                    className="w-full bg-paper border border-ink/20 rounded-xl px-4 py-3 text-ink focus:outline-none focus:border-ink/50 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-ink/60 font-bebas ml-1">
                    About Page Image URL
                  </label>
                  <input
                    type="text"
                    value={portfolio.about?.imageUrl || ""}
                    onChange={(e) => handleAboutChange("imageUrl", e.target.value)}
                    className="w-full bg-paper border border-ink/20 rounded-xl px-4 py-3 text-ink focus:outline-none focus:border-ink/50"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-ink/60 font-bebas ml-1">
                      Current Location
                    </label>
                    <input
                      type="text"
                      value={portfolio.about?.locationCurrent || ""}
                      onChange={(e) => handleAboutChange("locationCurrent", e.target.value)}
                      className="w-full bg-paper border border-ink/20 rounded-xl px-4 py-3 text-ink focus:outline-none focus:border-ink/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-ink/60 font-bebas ml-1">
                      Native Place
                    </label>
                    <input
                      type="text"
                      value={portfolio.about?.locationNative || ""}
                      onChange={(e) => handleAboutChange("locationNative", e.target.value)}
                      className="w-full bg-paper border border-ink/20 rounded-xl px-4 py-3 text-ink focus:outline-none focus:border-ink/50"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleSaveAbout}
                    className="flex items-center gap-2 px-8 py-4 bg-transparent rounded-full border border-ink/30 text-ink font-bebas uppercase text-xs tracking-widest hover:border-ink hover:text-ink font-bold hover:shadow-[0_0_15px_-2px_#ff8e7f] transition-all duration-300"
                  >
                    <Save size={16} />
                    <span>Save About Content</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 5: EXPERIENCE PAGE */}
          {activeTab === "experience" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bebas font-light uppercase tracking-widest text-ink/60">
                  Manage Experience
                </h3>
                <button
                  onClick={handleAddExperienceInit}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-transparent border border-ink/20 text-ink hover:border-[#c0ee91] hover:shadow-[0_0_15px_-2px_#c0ee91] transition-all duration-300 text-xs uppercase tracking-widest font-bebas"
                >
                  <Plus size={16} />
                  <span>Add Experience</span>
                </button>
              </div>

              {/* Editing Experience Frame */}
              {editingExperience && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-paper border border-ink/20 p-8 rounded-3xl space-y-6"
                >
                  <h4 className="text-md font-bebas text-ink font-bold uppercase tracking-widest">
                    {editingExperience.role ? `Edit Experience: ${editingExperience.role}` : "Add New Experience"}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-ink/60 font-bebas ml-1">
                        Role / Title
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Frontend Developer"
                        value={editingExperience.role}
                        onChange={(e) => setEditingExperience({ ...editingExperience, role: e.target.value })}
                        className="w-full bg-paper border border-ink/20 rounded-xl px-4 py-3 text-ink focus:outline-none focus:border-ink/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-ink/60 font-bebas ml-1">
                        Company / Organization
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Google"
                        value={editingExperience.company}
                        onChange={(e) => setEditingExperience({ ...editingExperience, company: e.target.value })}
                        className="w-full bg-paper border border-ink/20 rounded-xl px-4 py-3 text-ink focus:outline-none focus:border-ink/50"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] uppercase tracking-widest text-ink/60 font-bebas ml-1">
                        Duration
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Jan 2024 - Present"
                        value={editingExperience.duration}
                        onChange={(e) => setEditingExperience({ ...editingExperience, duration: e.target.value })}
                        className="w-full bg-paper border border-ink/20 rounded-xl px-4 py-3 text-ink focus:outline-none focus:border-ink/50"
                      />
                    </div>
                    <div className="col-span-1 md:col-span-2 space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-ink/60 font-bebas ml-1">
                        Description
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Describe your responsibilities and achievements..."
                        value={editingExperience.description}
                        onChange={(e) => setEditingExperience({ ...editingExperience, description: e.target.value })}
                        className="w-full bg-paper border border-ink/20 rounded-xl px-4 py-3 text-ink focus:outline-none focus:border-ink/50 resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-2">
                    <button
                      onClick={handleSaveExperience}
                      className="flex items-center gap-2 px-6 py-3 rounded-full bg-ink/10 border border-ink/30 text-ink font-bold hover:bg-ink hover:text-paper transition-all duration-300 text-xs uppercase tracking-widest font-bebas"
                    >
                      <Save size={14} />
                      <span>Save Experience</span>
                    </button>
                    <button
                      onClick={() => setEditingExperience(null)}
                      className="flex items-center gap-2 px-6 py-3 rounded-full bg-transparent border border-ink/20 text-ink/60 hover:text-paper transition-all duration-300 text-xs uppercase tracking-widest font-bebas"
                    >
                      <span>Cancel</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Experience List View */}
              <div className="space-y-6">
                {(portfolio.experience || []).map((exp, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-paper border border-ink/10 flex flex-col md:flex-row justify-between gap-6 hover:border-ink/30 transition-colors"
                  >
                    <div className="space-y-2">
                      <h4 className="font-bebas text-xl font-light">{exp.role}</h4>
                      <p className="text-xs text-ink/60 font-inter tracking-wider uppercase">
                        {exp.company} • {exp.duration}
                      </p>
                      <p className="text-xs text-ink/60 font-light line-clamp-2 max-w-xl font-inter">
                        {exp.description}
                      </p>
                    </div>
                    <div className="flex md:flex-col justify-end gap-3 self-center shrink-0">
                      <button
                        onClick={() => handleEditExperienceInit(exp)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-paper border border-ink/20 text-ink hover:text-paper hover:border-[#c0ee91] text-xs font-bebas tracking-widest uppercase transition-colors"
                      >
                        <Edit3 size={14} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteExperience(exp.id)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-paper border border-ink/20 text-ink hover:text-paper hover:border-[#ff8e7f] text-xs font-bebas tracking-widest uppercase transition-colors"
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

          {/* TAB 6: CONTACT MESSAGES */}
          {activeTab === "messages" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              <h3 className="text-lg font-bebas font-light uppercase tracking-widest text-ink/60">
                Contact Messages
              </h3>
              <div className="space-y-6">
                {(portfolio.contactMessages || []).slice().reverse().map((msg, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-paper border border-ink/10 hover:border-ink/30 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bebas text-lg font-medium text-ink">{msg.name}</h4>
                        <a href={`mailto:${msg.email}`} className="text-sm text-ink hover:underline font-inter">{msg.email}</a>
                      </div>
                      <span className="text-[10px] text-ink/60 font-mono">
                        {new Date(msg.date).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-ink/60 font-light whitespace-pre-wrap font-inter text-sm bg-paper p-4 rounded-xl">
                      {msg.message}
                    </p>
                  </div>
                ))}
                {(!portfolio.contactMessages || portfolio.contactMessages.length === 0) && (
                  <p className="text-ink/60 text-sm italic">No messages received yet.</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
      
      {/* Custom Delete Confirmation Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-paper text-ink/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-paper border border-ink/20 p-8 rounded-3xl max-w-sm w-full shadow-2xl shadow-primary/10"
            >
              <div className="flex items-center gap-4 mb-6 text-ink">
                <AlertCircle size={32} />
                <h3 className="text-xl font-bebas uppercase tracking-widest">Confirm Deletion</h3>
              </div>
              <p className="text-ink/60 font-inter mb-8">
                Are you sure you want to delete {confirmDelete.name}? This action cannot be undone.
              </p>
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="px-6 py-2 rounded-full border border-ink/20 text-ink/60 hover:text-paper transition-colors text-xs font-bebas uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteAction}
                  className="px-6 py-2 rounded-full bg-ink/5 text-ink border border-ink/20 hover:bg-primary hover:text-paper transition-colors text-xs font-bebas uppercase tracking-widest"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
