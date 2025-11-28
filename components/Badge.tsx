import React from 'react';
import { Shield, Zap, Target, Users, TrendingUp, Award, Lock, Flame, Heart, Brain, Eye, Crosshair, Wind, Sword, Mountain, Rocket, Radio, Headphones } from 'lucide-react';
import './Badge.css';

export type BadgeTier = 'S' | 'A' | 'B' | 'C' | 'D' | 'E';
export type PlaystyleType = 'wall' | 'speed' | 'playmaker' | 'finisher' | 'anchor' | 'engine' | 'clutch' | 'lockdown' | 'poacher' | 'dribbler' | 'tactician' | 'aerial' | 'sniper' | 'press' | 'striker' | 'rock' | 'speedster' | 'vision';

interface BadgeProps {
    tier: BadgeTier;
    playstyle: PlaystyleType;
    size?: number;
}

const playstyleIcons: Record<PlaystyleType, React.ReactNode> = {
    wall: <Shield className="w-full h-full" />, // Defenders/GK - brick wall defense
    speed: <Zap className="w-full h-full" />, // Wingers - lightning speed
    playmaker: <Users className="w-full h-full" />, // Midfielders - team play
    finisher: <Target className="w-full h-full" />, // Strikers - goal scoring
    anchor: <Lock className="w-full h-full" />, // Defensive mid - anchor
    engine: <TrendingUp className="w-full h-full" />, // Box-to-box - engine
    clutch: <Award className="w-full h-full" />, // Clutch performer
    lockdown: <Radio className="w-full h-full" />, // Lockdown defender - CHANGED to Radio to avoid Shield duplicate
    poacher: <Flame className="w-full h-full" />, // Goal poacher - always in the box
    dribbler: <Wind className="w-full h-full" />, // Dribbling specialist
    tactician: <Brain className="w-full h-full" />, // Tactical mastermind
    aerial: <Mountain className="w-full h-full" />, // Aerial threat
    sniper: <Crosshair className="w-full h-full" />, // Long-range shooter
    press: <Eye className="w-full h-full" />, // High press specialist
    striker: <Sword className="w-full h-full" />, // Aggressive striker
    rock: <Heart className="w-full h-full" />, // Reliable/consistent performer
    speedster: <Rocket className="w-full h-full" />, // Pure pace merchant
    vision: <Headphones className="w-full h-full" />, // Vision/awareness specialist
};

const tierColors: Record<BadgeTier, string> = {
    S: '#ff4444', // Red
    A: '#ff8844', // Orange
    B: '#ffdd44', // Yellow
    C: '#ddff44', // Lime
    D: '#44ff88', // Green
    E: '#44ffaa', // Bright green
};

export const Badge: React.FC<BadgeProps> = ({ tier, playstyle, size = 50 }) => {
    // Use gold color for all badges
    const color = '#FFD700'; // Gold

    return (
        <div
            className="hexagon-badge"
            style={{
                '--badge-size': `${size}px`,
                '--badge-color': color,
            } as React.CSSProperties}
        >
            <div className="hexagon-shape">
                <div className="hexagon-content">
                    <div className="badge-icon">
                        {playstyleIcons[playstyle]}
                    </div>
                </div>
            </div>
        </div>
    );
};
