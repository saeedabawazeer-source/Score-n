import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { PlayerBio } from '../types';
import { Loader2, User, Camera, ChevronDown, Move, Globe, Flame, Search } from 'lucide-react';

interface PlayerCardCreatorProps {
    isActive: boolean;
}

const INITIAL_BIO: PlayerBio = {
    height: "180",
    age: 21,
    strongFoot: 'Right',
    weakFoot: 3
};

const SQUAD_MEMBERS = [
    { name: 'Mahmoud', pos: 'ST' },
    { name: 'Tarek', pos: 'CDM' },
    { name: 'Zayn', pos: 'LW' },
    { name: 'Faris', pos: 'CB' },
    { name: 'Nasser', pos: 'GK' },
    { name: 'Omar', pos: 'CAM' },
    { name: 'Youssef', pos: 'RW' },
    { name: 'Hamza', pos: 'RB' }
];

// Uses ISO 3166-1 alpha-2 codes for flagcdn
import { ALL_COUNTRIES } from './countries';

// Uses ISO 3166-1 alpha-2 codes for flagcdn
const FLAGS = ALL_COUNTRIES;

const DEFAULT_FLAG = { code: 'REG', iso2: '', label: 'Region' };

const SCHOOLS = [
    { id: 'ASU', name: 'Arizona State University', short: 'ASU' }
];

export const PlayerCardCreator: React.FC<PlayerCardCreatorProps> = ({ isActive }) => {
    const [name, setName] = useState('');
    const [contactInfo, setContactInfo] = useState('');
    const [selectedFlag, setSelectedFlag] = useState(DEFAULT_FLAG);
    const [selectedSchool, setSelectedSchool] = useState('');
    const [bio, setBio] = useState<PlayerBio>(INITIAL_BIO);

    const [uploadedImage, setUploadedImage] = useState<string | null>(null);

    // Flag Dropdown State
    const [isFlagDropdownOpen, setIsFlagDropdownOpen] = useState(false);
    const [flagSearch, setFlagSearch] = useState('');

    // Image Drag Logic
    const [imagePos, setImagePos] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    // REPLACE THIS WITH YOUR GOOGLE APPS SCRIPT WEB APP URL
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbye7OakwvDifMsQ-1lSF4UOvPGaf-Wu2PDFzWEfbWWwH9xVN1YKbizPlxvqSJgiQ4Bf/exec";

    // Heatmap: 0=Off, 1=Green, 2=Yellow, 3=Red
    const [zoneLevels, setZoneLevels] = useState<Record<number, number>>({});

    // Fixed Starting Level
    const overallRating = 1;

    const toggleZone = (index: number) => {
        setZoneLevels(prev => {
            const currentLevel = prev[index] || 0;
            const nextLevel = (currentLevel + 1) % 4;
            const newLevels = { ...prev };
            if (nextLevel === 0) {
                delete newLevels[index];
            } else {
                newLevels[index] = nextLevel;
            }
            return newLevels;
        });
    };

    const getZoneColor = (level: number, isMini = false) => {
        const opacity = isMini ? 'opacity-100' : 'opacity-90';
        switch (level) {
            case 1: return `bg-lime ${opacity}`; // Level 1: Green (Brand Lime)
            case 2: return `bg-yellow-400 ${opacity}`; // Level 2: Yellow
            case 3: return `bg-red-600 ${opacity}`; // Level 3: Red
            default: return 'bg-transparent';
        }
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setUploadedImage(imageUrl);
            setImagePos({ x: 0, y: 0 }); // Reset position
        }
    };

    // Drag Handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        if (!uploadedImage) return;
        e.preventDefault();
        setIsDragging(true);
        dragStart.current = { x: e.clientX - imagePos.x, y: e.clientY - imagePos.y };
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        setImagePos({
            x: e.clientX - dragStart.current.x,
            y: e.clientY - dragStart.current.y
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleSaveToWaitlist = async () => {
        if (!contactInfo) {
            alert("Please enter your contact info.");
            return;
        }
        if (!cardRef.current) return;

        setIsSubmitting(true);

        try {
            // 1. Capture the card as an image
            const canvas = await html2canvas(cardRef.current, {
                backgroundColor: null, // Transparent background if possible, or matches CSS
                scale: 2, // Higher quality
                useCORS: true // For cross-origin images (flags, user uploads)
            });
            const imageBase64 = canvas.toDataURL('image/png');

            // 2. Send to Google Script
            // Note: fetch to Google Script often requires 'no-cors' mode if calling from client directly,
            // but 'no-cors' means we can't read the response. 
            // However, for a simple fire-and-forget or basic submission, standard POST works if the script handles CORS (which it can't fully on free tier easily).
            // Actually, standard POST with 'Content-Type': 'text/plain' (to avoid preflight) usually works for Google Apps Script.

            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify({
                    name: name || "Player",
                    email: contactInfo,
                    image: imageBase64,
                    region: selectedFlag.code,
                    school: selectedSchool,
                    position: getDisplayPosition(),
                    age: bio.age,
                    height: bio.height,
                    foot: bio.strongFoot,
                    heatmap: JSON.stringify(zoneLevels)
                })
            });

            setIsSubmitted(true);
        } catch (error) {
            console.error("Error submitting card:", error);
            alert("There was an error saving your card. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getDisplayPosition = () => {
        // Convert zones object to array of active zones
        const zones = Object.entries(zoneLevels).map(([k, v]) => ({ index: Number(k), level: v }));
        if (zones.length === 0) return "N/A";

        // Logic to determine position based on center of mass of highest level zones
        // Grid is 3 columns x 5 rows (0-14)
        // Row 0: 0,1,2 (Attack)
        // Row 1: 3,4,5 (AM)
        // Row 2: 6,7,8 (Mid)
        // Row 3: 9,10,11 (DM)
        // Row 4: 12,13,14 (Def)

        // Find max level (focus on Red zones first)
        const maxLevel = Math.max(...zones.map(z => z.level));
        const primaryZones = zones.filter(z => z.level === maxLevel);

        // Calculate average Row and Column
        let sumR = 0, sumC = 0;
        primaryZones.forEach(z => {
            const r = Math.floor(z.index / 3); // 0 to 4
            const c = z.index % 3; // 0 to 2
            sumR += r;
            sumC += c;
        });
        const avgR = sumR / primaryZones.length;
        const avgC = sumC / primaryZones.length;

        // Map coordinates to position
        if (avgR < 1.0) { // Top Row (Attack)
            if (avgC < 0.8) return "LW";
            if (avgC > 1.2) return "RW";
            return "ST";
        } else if (avgR < 2.0) { // Row 1 (Attacking Mid)
            if (avgC < 0.8) return "LW"; // Wide high often wing
            if (avgC > 1.2) return "RW";
            return "CAM";
        } else if (avgR < 3.0) { // Row 2 (Midfield)
            if (avgC < 0.8) return "LM";
            if (avgC > 1.2) return "RM";
            return "CM";
        } else if (avgR < 3.8) { // Row 3 (Defensive Mid)
            return "CDM";
        } else { // Bottom Row (Defense)
            if (avgC < 0.8) return "LB";
            if (avgC > 1.2) return "RB";
            return "CB";
        }
    };

    if (!isActive) return null;

    return (
        <section className="py-24 px-4 relative border-t border-white/10 bg-[#050f0d]">

            <div className="max-w-7xl mx-auto relative z-10">

                {/* Section Header - Technical */}
                <div className="flex items-end justify-between mb-12 border-b border-white/10 pb-4">
                    <div>
                        <h2 className="font-display text-5xl font-bold uppercase text-white leading-none">
                            Player <span className="text-lime">ID</span>
                        </h2>
                        <p className="font-mono text-xs text-gray-500 mt-2 uppercase tracking-widest">
                            Establish your metrics
                        </p>
                    </div>
                    <div className="hidden md:block font-mono text-xs text-lime">
                        SYS_READY // V.2.0
                    </div>
                </div>

                {/* MOBILE: Full Screen Natural Layout | DESKTOP: Side-by-side */}
                <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-12 w-full">

                    {/* CONTROL PANEL - Full width on mobile, left on desktop */}
                    <div className="w-full lg:col-span-5 bg-white/[0.02] border border-white/5 p-6 flex flex-col justify-between">

                        {/* Identity Block */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-surface border border-white/10 p-3 text-white focus:border-lime outline-none font-display uppercase text-lg transition-all rounded-none placeholder-gray-700"
                                    placeholder="ENTER NAME"
                                    maxLength={12}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">Region</label>
                                    <div className="relative">
                                        <button
                                            onClick={() => setIsFlagDropdownOpen(!isFlagDropdownOpen)}
                                            className="w-full bg-surface border border-white/10 p-3 text-white font-display font-bold flex items-center justify-between focus:border-lime outline-none transition-all rounded-none uppercase"
                                        >
                                            <span className="truncate text-sm">{selectedFlag.code}</span>
                                            <ChevronDown className="w-4 h-4 text-lime" />
                                        </button>

                                        {/* Dropdown List */}
                                        {isFlagDropdownOpen && (
                                            <div className="absolute top-full left-0 w-full max-h-60 overflow-y-auto bg-[#0a0a0a] border border-white/10 z-50 shadow-xl">
                                                <input
                                                    type="text"
                                                    placeholder="SEARCH..."
                                                    className="w-full bg-[#0a0a0a] p-2 text-xs text-white border-b border-white/10 outline-none font-mono sticky top-0 z-10 placeholder-gray-600"
                                                    value={flagSearch}
                                                    onChange={e => setFlagSearch(e.target.value)}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                                {FLAGS.filter(f => f.label.toLowerCase().includes(flagSearch.toLowerCase()) || f.code.includes(flagSearch.toUpperCase())).map(flag => (
                                                    <button
                                                        key={flag.code}
                                                        onClick={() => { setSelectedFlag(flag); setIsFlagDropdownOpen(false); }}
                                                        className="w-full text-left p-2 hover:bg-white/5 flex items-center gap-2 transition-colors border-b border-white/5 last:border-0"
                                                    >
                                                        <img src={`https://flagcdn.com/w40/${flag.iso2.toLowerCase()}.png`} className="w-5 h-auto" alt={flag.label} />
                                                        <span className="text-white font-display text-sm">{flag.code}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">School</label>
                                    <select
                                        value={selectedSchool}
                                        onChange={(e) => setSelectedSchool(e.target.value)}
                                        className="w-full bg-surface border border-white/10 p-3 text-white font-display font-bold appearance-none focus:border-lime outline-none rounded-none uppercase text-sm"
                                    >
                                        <option value="">SELECT</option>
                                        {SCHOOLS.map(s => (
                                            <option key={s.id} value={s.id}>{s.short}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Bio Sliders */}
                        <div className="space-y-4 border-t border-white/5 pt-6">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-xs font-mono text-gray-500 uppercase">Height</span>
                                    <span className="text-lime font-display font-bold">{bio.height} CM</span>
                                </div>
                                <input
                                    type="range" min="150" max="210"
                                    value={bio.height}
                                    onChange={(e) => setBio({ ...bio, height: e.target.value })}
                                    className="w-full h-2 bg-surface rounded-none appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-lime"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-xs font-mono text-gray-500 uppercase">Age</span>
                                    <span className="text-lime font-display font-bold">{bio.age} YRS</span>
                                </div>
                                <input
                                    type="range" min="16" max="45"
                                    value={bio.age}
                                    onChange={(e) => setBio({ ...bio, age: parseInt(e.target.value) })}
                                    className="w-full h-2 bg-surface rounded-none appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-lime"
                                />
                            </div>

                            <div>
                                <span className="text-xs font-mono text-gray-500 uppercase block mb-2">Strong Foot</span>
                                <button
                                    onClick={() => setBio({ ...bio, strongFoot: bio.strongFoot === 'Right' ? 'Left' : 'Right' })}
                                    className="w-full text-sm font-bold text-black bg-lime py-3 uppercase hover:bg-white transition-colors"
                                >
                                    {bio.strongFoot}
                                </button>
                            </div>
                        </div>

                        {/* Heatmap Selector */}
                        <div className="border-t border-white/5 pt-6">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-mono text-gray-500 uppercase">Heatmap</span>
                                <div className="flex gap-2 text-[9px] font-mono uppercase text-gray-500">
                                    <span className="flex items-center gap-1"><div className="w-2 h-2 bg-lime rounded-full"></div> 1</span>
                                    <span className="flex items-center gap-1"><div className="w-2 h-2 bg-yellow-400 rounded-full"></div> 2</span>
                                    <span className="flex items-center gap-1"><div className="w-2 h-2 bg-red-600 rounded-full"></div> 3</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-1 w-full aspect-[3/4] max-w-[180px] mx-auto bg-black/20 p-2 border border-white/10">
                                {Array.from({ length: 15 }).map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => toggleZone(i)}
                                        className={`w-full h-full border border-white/5 transition-all duration-200 ${getZoneColor(zoneLevels[i] || 0)}`}
                                    />
                                ))}
                            </div>
                            <p className="text-center text-[9px] font-mono text-gray-600 mt-2 uppercase">Tap to toggle intensity</p>
                        </div>


                    </div>

                    {/* PREVIEW PANEL - Full width on mobile, right on desktop */}
                    <div className="w-full lg:col-span-7 flex flex-col items-center justify-center py-8 lg:py-0">

                        {/* The Card - Natural mobile size */}
                        <div
                            ref={cardRef}
                            className="relative w-full max-w-[340px] aspect-[340/540] lg:w-[340px] lg:h-[540px] transition-transform hover:scale-[1.01] duration-500 rounded-[32px] p-[2px] bg-gradient-to-b from-[#333] via-[#222] to-lime/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
                        >
                            {/* Inner Card Content */}
                            <div
                                className="w-full h-full bg-[#0a0a0a] flex flex-col overflow-hidden relative rounded-[30px]"
                            >
                                {/* Background Pattern */}
                                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_25%,rgba(255,255,255,0.02)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.02)_75%,rgba(255,255,255,0.02)_100%)] bg-[length:20px_20px] pointer-events-none"></div>
                                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

                                {/* Top Section: Rating & Flag */}
                                <div className="absolute top-6 left-6 z-20 pointer-events-none">
                                    <div className="font-display text-6xl font-bold text-lime leading-[0.8] drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                                        {overallRating}
                                    </div>
                                    <div className="font-mono text-[9px] text-lime/70 uppercase tracking-widest mt-1 text-center">
                                        LEVEL
                                    </div>
                                    <div className="font-display text-xl font-bold text-white text-center uppercase tracking-wide mt-1 drop-shadow-md">
                                        {getDisplayPosition()}
                                    </div>
                                </div>

                                <div className="absolute top-6 right-6 z-20 pointer-events-none">
                                    <div className="relative">
                                        {/* Sun Devils Badge - Absolute positioned to LEFT of flag */}
                                        {selectedSchool === 'ASU' && (
                                            <div className="absolute right-full top-1/2 -translate-y-1/2 mr-0 w-[55px] h-[55px] flex items-center justify-center animate-in fade-in zoom-in duration-300">
                                                <img
                                                    src="/sd2.png"
                                                    alt="Sun Devils"
                                                    className="w-full h-full object-contain drop-shadow-lg"
                                                />
                                            </div>
                                        )}

                                        {/* Flag Container (Anchor) */}
                                        <div className="border-2 border-white/10 p-0.5 bg-black/40 backdrop-blur-sm shadow-lg min-w-[44px] min-h-[28px] flex items-center justify-center rounded">
                                            {selectedFlag.iso2 ? (
                                                <img
                                                    src={`https://flagcdn.com/w80/${selectedFlag.iso2.toLowerCase()}.png`}
                                                    alt={selectedFlag.label}
                                                    className="w-10 h-auto block"
                                                />
                                            ) : (
                                                <Globe className="text-white/50 w-6 h-6" strokeWidth={1.5} />
                                            )}
                                        </div>
                                    </div>
                                </div>


                                {/* Image Area (Draggable) */}
                                <div
                                    className="absolute inset-0 flex items-center justify-center cursor-move group"
                                    onMouseDown={handleMouseDown}
                                    onMouseMove={handleMouseMove}
                                    onMouseUp={handleMouseUp}
                                    onMouseLeave={handleMouseUp}
                                    onTouchStart={(e) => {
                                        const touch = e.touches[0];
                                        handleMouseDown({ ...e, clientX: touch.clientX, clientY: touch.clientY, preventDefault: () => { } } as any);
                                    }}
                                    onTouchMove={(e) => {
                                        const touch = e.touches[0];
                                        handleMouseMove({ ...e, clientX: touch.clientX, clientY: touch.clientY, preventDefault: () => { } } as any);
                                    }}
                                    onTouchEnd={handleMouseUp}
                                >
                                    {uploadedImage ? (
                                        <div className="relative w-full h-full overflow-hidden">
                                            <img
                                                src={uploadedImage}
                                                alt="Player"
                                                className="absolute w-full h-full object-cover contrast-125 transition-[filter] duration-500 pointer-events-none select-none"
                                                style={{
                                                    transform: `translate(${imagePos.x}px, ${imagePos.y}px) scale(1.1)`,
                                                    cursor: isDragging ? 'grabbing' : 'grab'
                                                }}
                                            />
                                            {!isDragging && (
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <div className="bg-black/50 backdrop-blur px-3 py-1 rounded-full border border-white/20 flex items-center gap-2">
                                                        <Move size={12} className="text-white" />
                                                        <span className="text-[9px] text-white font-mono uppercase tracking-widest">Drag to Adjust</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div
                                            className="flex flex-col items-center justify-center pt-12 opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <span className="text-[9px] font-mono text-lime uppercase tracking-widest flex items-center gap-1 mb-4 bg-black/50 px-2 py-1 rounded">
                                                <Camera size={10} /> Upload Photo
                                            </span>
                                            <User size={120} strokeWidth={0.5} className="text-white" />
                                        </div>
                                    )}
                                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                                </div>

                                {/* Info Section (Bottom Third) */}
                                <div className="absolute bottom-0 left-0 w-full h-[40%] bg-gradient-to-t from-[#050f0d] via-[#0a1a17] to-transparent flex flex-col justify-end p-5 z-10 pointer-events-none">

                                    {/* Name */}
                                    <div className="mb-4 text-center relative">
                                        <h2 className="font-display text-4xl font-bold text-white uppercase tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{name || 'NAME'}</h2>
                                        <div className="w-full h-px bg-gradient-to-r from-transparent via-lime/50 to-transparent mt-2"></div>
                                    </div>

                                    {/* Primary Stats (GMS/GLS/AST) */}
                                    <div className="flex justify-between px-4 mb-4">
                                        <div className="text-center">
                                            <span className="font-display font-bold text-white text-xl block leading-none">0</span>
                                            <span className="text-[9px] font-mono text-lime uppercase">GMS</span>
                                        </div>
                                        <div className="text-center">
                                            <span className="font-display font-bold text-white text-xl block leading-none">0</span>
                                            <span className="text-[9px] font-mono text-lime uppercase">GLS</span>
                                        </div>
                                        <div className="text-center">
                                            <span className="font-display font-bold text-white text-xl block leading-none">0</span>
                                            <span className="text-[9px] font-mono text-lime uppercase">AST</span>
                                        </div>
                                    </div>

                                    {/* Bio Grid (Age/Ht/Foot + Mini Map) */}
                                    <div className="grid grid-cols-4 gap-2 items-center border-t border-white/5 pt-3">
                                        <div className="text-center border-r border-white/5">
                                            <span className="font-display font-bold text-gray-300 text-sm block">{bio.age}</span>
                                            <span className="text-[8px] font-mono text-gray-500 uppercase">AGE</span>
                                        </div>
                                        <div className="text-center border-r border-white/5">
                                            <span className="font-display font-bold text-gray-300 text-sm block">{bio.height}</span>
                                            <span className="text-[8px] font-mono text-gray-500 uppercase">CM</span>
                                        </div>
                                        <div className="text-center border-r border-white/5">
                                            <span className="font-display font-bold text-gray-300 text-sm block">{bio.strongFoot[0]}</span>
                                            <span className="text-[8px] font-mono text-gray-500 uppercase">FT</span>
                                        </div>
                                        <div className="flex justify-center">
                                            <div className="w-4 h-5 bg-lime/20 rounded-sm"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Section - Now Under Card */}
                        <div className="w-full max-w-[340px] mt-8">
                            {isSubmitted ? (
                                <div className="bg-lime p-4 text-center">
                                    <h3 className="text-black font-display font-bold text-xl uppercase">ID CONFIRMED</h3>
                                    <p className="text-black text-xs font-mono uppercase mt-1">See you on the field</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <input
                                        type="email"
                                        placeholder="ENTER EMAIL"
                                        value={contactInfo}
                                        onChange={(e) => setContactInfo(e.target.value)}
                                        className="w-full bg-surface border border-white/10 p-3 text-white focus:border-lime outline-none text-sm font-mono rounded-none placeholder-gray-600 text-center"
                                    />
                                    <button
                                        onClick={handleSaveToWaitlist}
                                        disabled={isSubmitting}
                                        className="w-full bg-lime hover:bg-white disabled:opacity-50 text-black font-display font-bold uppercase py-4 text-lg tracking-widest transition-all flex items-center justify-center gap-2 rounded-none shadow-[0_0_20px_rgba(180,241,86,0.2)]"
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : 'MINT CARD'}
                                    </button>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>

            {/* Ticker below card */}
            <div className="w-full mt-12 border-t border-b border-white/10 py-3 overflow-hidden bg-black/20">
                <div className="flex animate-marquee whitespace-nowrap space-x-12">
                    {[...SQUAD_MEMBERS, ...SQUAD_MEMBERS, ...SQUAD_MEMBERS].map((m, i) => (
                        <div key={i} className="text-xs font-mono text-gray-500 uppercase flex items-center gap-2">
                            <User size={12} className="text-lime" />
                            {m.name} <span className="text-white">[{m.pos}]</span>
                        </div>
                    ))}
                </div>
            </div>

        </section>
    );
};