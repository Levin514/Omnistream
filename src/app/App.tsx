import { useState, useEffect, useRef } from "react";
import {
  Search, Bell, Star, Play, Heart, Clock, Home, Grid3X3,
  Bookmark, User, Settings, Film, Tv, Trophy, Monitor,
  ArrowLeft, X, Filter, LogOut, Plus, Share2, ExternalLink,
  Trash2, Menu, TrendingUp, ChevronRight, Eye, Check,
  Zap, Globe, Calendar, Info, Mail, Apple, Chrome,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
type Page =
  | "landing" | "login" | "register" | "dashboard"
  | "search" | "detail" | "sports" | "platforms"
  | "favorites" | "history" | "profile" | "settings";

interface ContentItem {
  id: number;
  title: string;
  year: number;
  genre: string;
  rating: number;
  duration: string;
  type: "movie" | "series";
  platforms: string[];
  synopsis: string;
  director?: string;
  cast?: string[];
  trending?: boolean;
  newRelease?: boolean;
}

interface SportEvent {
  id: number;
  title: string;
  sport: string;
  time: string;
  date: string;
  status: "live" | "upcoming" | "finished";
  platforms: string[];
  teams: string[];
}

interface PlatformInfo {
  id: string;
  name: string;
  color: string;
  price: string;
  quality: string;
  description: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const ALL_CONTENT: ContentItem[] = [
  { id: 1, title: "Inception", year: 2010, genre: "Sci-Fi · Thriller", rating: 8.8, duration: "2h 28m", type: "movie", platforms: ["Netflix", "Prime Video"], synopsis: "Un ladrón que roba secretos corporativos mediante la tecnología de intercambio de sueños es encargado de implantar una idea en la mente de un CEO.", director: "Christopher Nolan", cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page", "Tom Hardy"], trending: true },
  { id: 2, title: "Interstellar", year: 2014, genre: "Sci-Fi · Drama", rating: 8.6, duration: "2h 49m", type: "movie", platforms: ["Paramount+", "Apple TV+"], synopsis: "Un equipo de exploradores viaja a través de un agujero de gusano en busca de un nuevo hogar para la humanidad.", director: "Christopher Nolan", cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"], trending: true },
  { id: 3, title: "The Dark Knight", year: 2008, genre: "Acción · Crimen", rating: 9.0, duration: "2h 32m", type: "movie", platforms: ["Max", "Disney+"], synopsis: "Batman acepta uno de sus mayores desafíos al enfrentarse al Joker, un criminal que busca sumir Gotham en el caos.", director: "Christopher Nolan", cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"], trending: true },
  { id: 4, title: "Gladiator", year: 2000, genre: "Acción · Drama", rating: 8.5, duration: "2h 35m", type: "movie", platforms: ["Netflix", "Paramount+"], synopsis: "Un general romano traicionado busca redención como gladiador en el Coliseo de Roma.", director: "Ridley Scott", cast: ["Russell Crowe", "Joaquin Phoenix", "Connie Nielsen"] },
  { id: 5, title: "Dune: Part Two", year: 2024, genre: "Sci-Fi · Aventura", rating: 8.5, duration: "2h 47m", type: "movie", platforms: ["Max"], synopsis: "Paul Atreides se une a los Fremen en un viaje espiritual y marcial mientras busca venganza contra aquellos que destruyeron su familia.", director: "Denis Villeneuve", cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson"], newRelease: true },
  { id: 6, title: "Oppenheimer", year: 2023, genre: "Drama · Historia", rating: 8.3, duration: "3h 0m", type: "movie", platforms: ["Prime Video", "Apple TV+"], synopsis: "La historia del físico J. Robert Oppenheimer y su papel crucial en el Proyecto Manhattan durante la Segunda Guerra Mundial.", director: "Christopher Nolan", cast: ["Cillian Murphy", "Emily Blunt", "Matt Damon"], newRelease: true },
  { id: 7, title: "The Batman", year: 2022, genre: "Acción · Crimen", rating: 7.8, duration: "2h 56m", type: "movie", platforms: ["Max", "Netflix"], synopsis: "Batman desentraña la corrupción en Gotham mientras persigue a un asesino en serie conocido como el Acertijo.", director: "Matt Reeves", cast: ["Robert Pattinson", "Zoë Kravitz", "Jeffrey Wright"] },
  { id: 8, title: "The Godfather", year: 1972, genre: "Crimen · Drama", rating: 9.2, duration: "2h 55m", type: "movie", platforms: ["Paramount+"], synopsis: "El patriarca de una familia de la mafia transfiere el control de su imperio al más reticente de sus hijos.", director: "Francis Ford Coppola", cast: ["Marlon Brando", "Al Pacino", "James Caan"] },
  { id: 101, title: "Breaking Bad", year: 2008, genre: "Drama · Crimen", rating: 9.5, duration: "S3 · E7", type: "series", platforms: ["Netflix"], synopsis: "Un profesor de química diagnosticado con cáncer terminal se convierte en fabricante de metanfetamina para asegurar el futuro de su familia.", director: "Vince Gilligan", cast: ["Bryan Cranston", "Aaron Paul", "Anna Gunn"], trending: true },
  { id: 102, title: "Stranger Things", year: 2016, genre: "Drama · Sci-Fi", rating: 8.7, duration: "S4 · E7", type: "series", platforms: ["Netflix"], synopsis: "En Hawkins, la desaparición de un niño desata una serie de eventos sobrenaturales que sus amigos investigan.", director: "Hermanos Duffer", cast: ["Millie Bobby Brown", "Finn Wolfhard", "David Harbour"], trending: true },
  { id: 103, title: "The Mandalorian", year: 2019, genre: "Sci-Fi · Acción", rating: 8.7, duration: "S5 · E5", type: "series", platforms: ["Disney+"], synopsis: "Un cazarrecompensas mandaloriano navega por los confines de la galaxia lejos de la autoridad de la Nueva República.", director: "Jon Favreau", cast: ["Pedro Pascal", "Gina Carano", "Carl Weathers"], trending: true },
  { id: 104, title: "Money Heist", year: 2017, genre: "Crimen · Drama", rating: 8.2, duration: "P7 · E3", type: "series", platforms: ["Netflix"], synopsis: "Un criminal misterioso planea el robo perfecto a la Fábrica Nacional de Moneda y Timbre.", director: "Álex Pina", cast: ["Álvaro Morte", "Úrsula Corberó", "Itziar Ituño"] },
  { id: 105, title: "The Last of Us", year: 2023, genre: "Drama · Sci-Fi", rating: 8.8, duration: "S2 · E4", type: "series", platforms: ["Max"], synopsis: "Joel y Ellie deben sobrevivir en un mundo post-apocalíptico infestado de hongos mutantes que transforman a las personas.", director: "Craig Mazin", cast: ["Pedro Pascal", "Bella Ramsey", "Gabriel Luna"], newRelease: true },
  { id: 106, title: "House of the Dragon", year: 2022, genre: "Fantasía · Drama", rating: 8.4, duration: "S2 · E8", type: "series", platforms: ["Max"], synopsis: "Precuela de Game of Thrones que sigue la guerra civil dentro de la Casa Targaryen doscientos años antes de los eventos originales.", director: "George R.R. Martin", cast: ["Paddy Considine", "Emma D'Arcy", "Matt Smith"], trending: true },
  { id: 107, title: "The Bear", year: 2022, genre: "Drama · Comedia", rating: 8.6, duration: "S3 · E6", type: "series", platforms: ["Disney+"], synopsis: "Un chef de alta cocina regresa a Chicago para administrar el restaurante familiar de su hermano fallecido y transforma un sándwich ordinario en algo extraordinario.", director: "Christopher Storer", cast: ["Jeremy Allen White", "Ebon Moss-Bachrach", "Ayo Edebiri"], newRelease: true },
  { id: 108, title: "Severance", year: 2022, genre: "Sci-Fi · Thriller", rating: 8.7, duration: "S2 · E3", type: "series", platforms: ["Apple TV+"], synopsis: "Empleados de Lumon Industries aceptan un procedimiento médico para separar sus memorias laborales de las personales.", director: "Dan Erickson", cast: ["Adam Scott", "Britt Lower", "Patricia Arquette"], newRelease: true },
];

const SPORTS_EVENTS: SportEvent[] = [
  { id: 201, title: "El Clásico", sport: "Fútbol", time: "20:00", date: "Hoy", status: "live", platforms: ["ESPN", "DAZN"], teams: ["Real Madrid", "FC Barcelona"] },
  { id: 202, title: "Lakers vs Warriors", sport: "NBA", time: "21:30", date: "Hoy", status: "upcoming", platforms: ["ESPN", "Prime Video"], teams: ["LA Lakers", "Golden State Warriors"] },
  { id: 203, title: "Chiefs vs Eagles", sport: "NFL", time: "19:00", date: "Mañana", status: "upcoming", platforms: ["Prime Video", "ESPN"], teams: ["Kansas City Chiefs", "Philadelphia Eagles"] },
  { id: 204, title: "GP de España", sport: "F1", time: "15:00", date: "Dom", status: "upcoming", platforms: ["ESPN", "DAZN"], teams: ["Red Bull Racing", "Mercedes AMG"] },
  { id: 205, title: "Djokovic vs Alcaraz", sport: "Tenis", time: "14:30", date: "Mañana", status: "upcoming", platforms: ["ESPN", "Prime Video"], teams: ["N. Djokovic", "C. Alcaraz"] },
  { id: 206, title: "UFC 305", sport: "UFC", time: "22:00", date: "Sáb", status: "upcoming", platforms: ["ESPN"], teams: ["Du Plessis", "Adesanya"] },
  { id: 207, title: "Yankees vs Red Sox", sport: "MLB", time: "18:00", date: "Hoy", status: "finished", platforms: ["ESPN", "Prime Video"], teams: ["NY Yankees", "Boston Red Sox"] },
  { id: 208, title: "MotoGP – Mugello", sport: "MotoGP", time: "13:00", date: "Dom", status: "upcoming", platforms: ["DAZN"], teams: ["M. Márquez", "F. Bagnaia"] },
  { id: 209, title: "Madrid vs Man City", sport: "Fútbol", time: "21:00", date: "Mar", status: "upcoming", platforms: ["DAZN", "Prime Video"], teams: ["Real Madrid", "Manchester City"] },
  { id: 210, title: "Nets vs Celtics", sport: "NBA", time: "20:00", date: "Mié", status: "upcoming", platforms: ["ESPN"], teams: ["Brooklyn Nets", "Boston Celtics"] },
];

const PLATFORMS_DATA: PlatformInfo[] = [
  { id: "netflix", name: "Netflix", color: "#E50914", price: "$15.99/mes", quality: "4K HDR", description: "La mayor biblioteca de entretenimiento con series y películas originales." },
  { id: "disney", name: "Disney+", color: "#113CCF", price: "$10.99/mes", quality: "4K HDR", description: "El hogar de Disney, Marvel, Star Wars, Pixar y National Geographic." },
  { id: "prime", name: "Prime Video", color: "#00A8E1", price: "$8.99/mes", quality: "4K HDR", description: "Miles de películas y series, incluidas producciones originales de Amazon." },
  { id: "max", name: "Max", color: "#B44FE8", price: "$15.99/mes", quality: "4K HDR", description: "HBO, Warner Bros, DC y series de culto en una sola plataforma." },
  { id: "appletv", name: "Apple TV+", color: "#A2AAAD", price: "$9.99/mes", quality: "4K HDR", description: "Originales premiados de Apple con producción de alta calidad." },
  { id: "paramount", name: "Paramount+", color: "#0064FF", price: "$5.99/mes", quality: "Full HD", description: "Contenido de CBS, MTV, Nickelodeon, BET y Paramount Pictures." },
  { id: "crunchyroll", name: "Crunchyroll", color: "#F47521", price: "$7.99/mes", quality: "Full HD", description: "La plataforma líder para anime con el catálogo más extenso." },
  { id: "espn", name: "ESPN", color: "#CC0000", price: "$10.99/mes", quality: "Full HD", description: "Deportes en vivo las 24 horas: NFL, NBA, MLB, fútbol y más." },
  { id: "dazn", name: "DAZN", color: "#F5F5F5", price: "$19.99/mes", quality: "Full HD", description: "La plataforma de deportes en vivo con fútbol, boxeo y MotoGP." },
  { id: "youtube", name: "YouTube", color: "#FF0000", price: "Gratis / $13.99", quality: "4K", description: "El mayor repositorio de video del mundo, con YouTube Premium sin anuncios." },
  { id: "mubi", name: "MUBI", color: "#FFFFFF", price: "$14.99/mes", quality: "Full HD", description: "Cine de autor curado: 30 películas seleccionadas rotando mensualmente." },
];

const POSTER_GRADIENTS: [string, string][] = [
  ["#1a1a5e", "#2563eb"], ["#2d1b69", "#9333ea"], ["#7f1d1d", "#dc2626"],
  ["#064e3b", "#10b981"], ["#431407", "#f97316"], ["#500724", "#ec4899"],
  ["#0c4a6e", "#0ea5e9"], ["#365314", "#84cc16"], ["#27272a", "#52525b"],
  ["#1c1917", "#a8a29e"], ["#1e1b4b", "#6366f1"], ["#4a1942", "#d946ef"],
];

const SPORT_ICONS: Record<string, string> = {
  Fútbol: "⚽", NBA: "🏀", NFL: "🏈", MLB: "⚾",
  F1: "🏎️", MotoGP: "🏍️", Tenis: "🎾", UFC: "🥊",
};

const SPORT_CATS = ["Todos", "Fútbol", "NBA", "NFL", "MLB", "F1", "MotoGP", "Tenis", "UFC"];

const getGradient = (id: number) => POSTER_GRADIENTS[id % POSTER_GRADIENTS.length];

const getPlatformColor = (name: string) =>
  PLATFORMS_DATA.find((p) => p.name === name)?.color ?? "#3B82F6";

const CONTINUE_WATCHING = [
  { id: 101, progress: 65 },
  { id: 3, progress: 42 },
  { id: 105, progress: 28 },
  { id: 107, progress: 80 },
];

const HISTORY_SEARCHES = ["Inception", "Breaking Bad", "Deportes en vivo", "Marvel", "Anime"];
const HISTORY_OPENED = [1, 102, 5, 103, 6, 108];

// ─── Poster (gradient placeholder) ───────────────────────────────────────────
function Poster({ id, title, className = "" }: { id: number; title: string; className?: string }) {
  const [from, to] = getGradient(id);
  return (
    <div
      className={`relative overflow-hidden flex flex-col items-center justify-end ${className}`}
      style={{ background: `linear-gradient(160deg, ${from} 0%, ${to} 100%)` }}
    >
      <div className="absolute inset-0 opacity-20"
        style={{ backgroundImage: "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.15) 0%, transparent 60%)" }}
      />
      <div className="relative z-10 p-3 w-full text-center">
        <span className="text-white/90 text-xs font-semibold leading-tight line-clamp-2 drop-shadow-lg">
          {title}
        </span>
      </div>
    </div>
  );
}

// ─── Platform Pill ────────────────────────────────────────────────────────────
function PlatformPill({ name }: { name: string }) {
  const color = getPlatformColor(name);
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wide"
      style={{ color, background: `${color}22`, border: `1px solid ${color}44` }}
    >
      {name}
    </span>
  );
}

// ─── Star Rating ──────────────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-1">
      <Star size={12} className="fill-yellow-400 text-yellow-400" />
      <span className="text-yellow-400 text-xs font-semibold">{rating.toFixed(1)}</span>
    </span>
  );
}

// ─── Content Card ─────────────────────────────────────────────────────────────
function ContentCard({
  item, onNavigate, favorites, onToggleFavorite,
}: {
  item: ContentItem;
  onNavigate: (page: Page, id?: number) => void;
  favorites: number[];
  onToggleFavorite: (id: number) => void;
}) {
  const isFav = favorites.includes(item.id);
  return (
    <div
      className="group relative flex-shrink-0 w-36 sm:w-40 cursor-pointer rounded-xl overflow-hidden bg-card border border-border transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-black/60 hover:border-primary/40"
      onClick={() => onNavigate("detail", item.id)}
    >
      <Poster id={item.id} title={item.title} className="h-52" />
      <button
        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity z-20"
        onClick={(e) => { e.stopPropagation(); onToggleFavorite(item.id); }}
      >
        <Heart size={14} className={isFav ? "fill-red-500 text-red-500" : "text-white"} />
      </button>
      {item.trending && (
        <div className="absolute top-2 left-2 bg-blue-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full z-20 flex items-center gap-0.5">
          <TrendingUp size={8} /> TOP
        </div>
      )}
      {item.newRelease && !item.trending && (
        <div className="absolute top-2 left-2 bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full z-20">
          NUEVO
        </div>
      )}
      <div className="p-2.5">
        <p className="text-foreground text-xs font-semibold truncate">{item.title}</p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-muted-foreground text-[10px]">{item.year}</span>
          <StarRating rating={item.rating} />
        </div>
        <p className="text-muted-foreground text-[10px] truncate mt-0.5">{item.genre}</p>
        <button
          className="mt-2 w-full bg-primary/10 hover:bg-primary/20 text-primary text-[10px] font-semibold py-1 rounded-lg transition-colors"
          onClick={(e) => { e.stopPropagation(); onNavigate("detail", item.id); }}
        >
          Ver disponibilidad
        </button>
      </div>
    </div>
  );
}

// ─── Horizontal Section ───────────────────────────────────────────────────────
function HSection({
  title, items, onNavigate, favorites, onToggleFavorite, icon,
}: {
  title: string;
  items: ContentItem[];
  onNavigate: (page: Page, id?: number) => void;
  favorites: number[];
  onToggleFavorite: (id: number) => void;
  icon?: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-foreground font-semibold text-base flex items-center gap-2">
          {icon && <span className="text-primary">{icon}</span>}
          {title}
        </h2>
        <button className="text-primary text-xs font-medium hover:underline flex items-center gap-1">
          Ver todo <ChevronRight size={12} />
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {items.map((item) => (
          <ContentCard key={item.id} item={item} onNavigate={onNavigate} favorites={favorites} onToggleFavorite={onToggleFavorite} />
        ))}
      </div>
    </section>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({
  currentPage, onNavigate, collapsed, onToggleCollapse,
}: {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}) {
  const navItems = [
    { id: "dashboard" as Page, label: "Inicio", icon: <Home size={18} /> },
    { id: "search" as Page, label: "Películas", icon: <Film size={18} /> },
    { id: "search" as Page, label: "Series", icon: <Tv size={18} /> },
    { id: "sports" as Page, label: "Deportes", icon: <Trophy size={18} /> },
    { id: "platforms" as Page, label: "Plataformas", icon: <Monitor size={18} /> },
    { id: "favorites" as Page, label: "Favoritos", icon: <Heart size={18} /> },
    { id: "history" as Page, label: "Historial", icon: <Clock size={18} /> },
    { id: "profile" as Page, label: "Mi Perfil", icon: <User size={18} /> },
  ];

  return (
    <aside
      className="hidden md:flex flex-col fixed left-0 top-0 h-full z-30 transition-all duration-300"
      style={{ width: collapsed ? "64px" : "220px", background: "var(--sidebar)", borderRight: "1px solid var(--sidebar-border)" }}
    >
      <div className="flex items-center justify-between p-4 h-16">
        {!collapsed && (
          <button onClick={() => onNavigate("dashboard")} className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
              <Play size={14} className="text-white fill-white" />
            </div>
            <span className="text-foreground font-bold text-lg tracking-tight">Omni<span className="text-primary">Stream</span></span>
          </button>
        )}
        {collapsed && (
          <button onClick={() => onNavigate("dashboard")} className="mx-auto">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Play size={14} className="text-white fill-white" />
            </div>
          </button>
        )}
        <button onClick={onToggleCollapse} className={`p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors text-muted-foreground ${collapsed ? "hidden" : ""}`}>
          <Menu size={16} />
        </button>
      </div>

      <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
        {navItems.map(({ id, label, icon }, idx) => {
          const isActive = currentPage === id && (label === "Inicio" ? true : currentPage === id);
          return (
            <button
              key={`${id}-${idx}`}
              onClick={() => onNavigate(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                ${isActive ? "bg-primary/15 text-primary" : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"}`}
              title={collapsed ? label : undefined}
            >
              <span className={`flex-shrink-0 ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`}>
                {icon}
              </span>
              {!collapsed && <span className="truncate">{label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="p-2 border-t border-sidebar-border">
        <button
          onClick={() => onNavigate("settings")}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-muted-foreground hover:bg-sidebar-accent hover:text-foreground`}
        >
          <Settings size={18} className="flex-shrink-0" />
          {!collapsed && <span>Configuración</span>}
        </button>
      </div>
    </aside>
  );
}

// ─── Top Header ───────────────────────────────────────────────────────────────
function Header({
  onNavigate, searchQuery, onSearchChange, onSearchSubmit, sidebarCollapsed, breadcrumb,
}: {
  onNavigate: (page: Page) => void;
  searchQuery: string;
  onSearchChange: (v: string) => void;
  onSearchSubmit: () => void;
  sidebarCollapsed: boolean;
  breadcrumb?: string;
}) {
  const leftPad = sidebarCollapsed ? "md:pl-[80px]" : "md:pl-[236px]";
  return (
    <header className={`fixed top-0 right-0 left-0 z-20 h-16 flex items-center px-4 gap-4 ${leftPad} transition-all duration-300`}
      style={{ background: "rgba(15,17,21,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <button className="md:hidden p-2 rounded-lg hover:bg-secondary" onClick={() => onNavigate("dashboard")}>
        <Play size={16} className="text-primary fill-primary" />
      </button>

      <div className="flex-1 max-w-lg relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearchSubmit()}
          placeholder="Buscar películas, series, actores..."
          className="w-full bg-secondary/60 border border-border rounded-xl pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:bg-secondary transition-all"
        />
      </div>

      {breadcrumb && (
        <span className="hidden sm:block text-muted-foreground text-sm truncate max-w-[200px]">
          {breadcrumb}
        </span>
      )}

      <div className="flex items-center gap-2 ml-auto">
        <button className="relative p-2 rounded-xl hover:bg-secondary transition-colors">
          <Bell size={18} className="text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full" />
        </button>
        <button
          onClick={() => onNavigate("profile")}
          className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
        >
          US
        </button>
      </div>
    </header>
  );
}

// ─── Bottom Navigation (mobile) ───────────────────────────────────────────────
function BottomNav({ currentPage, onNavigate }: { currentPage: Page; onNavigate: (p: Page) => void }) {
  const items = [
    { id: "dashboard" as Page, icon: <Home size={20} />, label: "Inicio" },
    { id: "search" as Page, icon: <Grid3X3 size={20} />, label: "Explorar" },
    { id: "favorites" as Page, icon: <Bookmark size={20} />, label: "Mi Lista" },
    { id: "sports" as Page, icon: <Trophy size={20} />, label: "Deportes" },
    { id: "profile" as Page, icon: <User size={20} />, label: "Perfil" },
  ];
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 flex items-center"
      style={{ background: "rgba(17,19,24,0.95)", backdropFilter: "blur(16px)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      {items.map(({ id, icon, label }) => (
        <button
          key={id}
          onClick={() => onNavigate(id)}
          className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors
            ${currentPage === id ? "text-primary" : "text-muted-foreground"}`}
        >
          {icon}
          {label}
        </button>
      ))}
    </nav>
  );
}

// ─── Hero Carousel ────────────────────────────────────────────────────────────
function HeroCarousel({ items, onNavigate }: { items: ContentItem[]; onNavigate: (p: Page, id?: number) => void }) {
  const [idx, setIdx] = useState(0);
  const featured = items.slice(0, 4);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % featured.length), 5000);
    return () => clearInterval(t);
  }, [featured.length]);

  const item = featured[idx];
  const [from, to] = getGradient(item.id);

  return (
    <div className="relative rounded-2xl overflow-hidden mb-8 h-64 sm:h-80" style={{ background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)` }}>
      <div className="absolute inset-0 opacity-30"
        style={{ backgroundImage: "radial-gradient(circle at 70% 30%, rgba(255,255,255,0.2), transparent 60%)" }} />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
      <div className="relative z-10 h-full flex flex-col justify-end p-6 sm:p-8">
        <div className="flex gap-1.5 mb-3">
          {item.trending && <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">TENDENCIA</span>}
          {item.newRelease && <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">NUEVO</span>}
          <span className="bg-white/20 text-white text-[10px] font-medium px-2 py-0.5 rounded-full backdrop-blur-sm">{item.genre}</span>
        </div>
        <h1 className="text-white text-2xl sm:text-3xl font-bold mb-2 drop-shadow-lg">{item.title}</h1>
        <p className="text-white/70 text-sm mb-4 max-w-md line-clamp-2">{item.synopsis}</p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate("detail", item.id)}
            className="bg-primary hover:bg-primary/80 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105 flex items-center gap-2"
          >
            <Eye size={15} /> Ver disponibilidad
          </button>
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <StarRating rating={item.rating} />
            <span>·</span>
            <span>{item.year}</span>
            <span>·</span>
            <span>{item.duration}</span>
          </div>
        </div>
      </div>
      <div className="absolute bottom-3 right-4 flex gap-1.5 z-10">
        {featured.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)}
            className={`h-1 rounded-full transition-all duration-300 ${i === idx ? "w-6 bg-primary" : "w-2 bg-white/30"}`} />
        ))}
      </div>
    </div>
  );
}

// ─── Page wrapper (for inner pages with sidebar/header) ───────────────────────
function AppShell({
  children, onNavigate, currentPage, searchQuery, onSearchChange, onSearchSubmit,
}: {
  children: React.ReactNode;
  onNavigate: (p: Page, id?: number) => void;
  currentPage: Page;
  searchQuery: string;
  onSearchChange: (v: string) => void;
  onSearchSubmit: () => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const nav = (p: Page) => onNavigate(p);

  return (
    <div className="min-h-screen bg-background font-[Inter,sans-serif]">
      <Sidebar currentPage={currentPage} onNavigate={nav} collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)} />
      <Header onNavigate={nav} searchQuery={searchQuery} onSearchChange={onSearchChange} onSearchSubmit={onSearchSubmit} sidebarCollapsed={collapsed} />
      <main
        className="pt-16 pb-20 md:pb-6 min-h-screen transition-all duration-300"
        style={{ paddingLeft: collapsed ? "80px" : "220px" }}
      >
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6 hidden md:block" />
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          {children}
        </div>
      </main>
      <BottomNav currentPage={currentPage} onNavigate={nav} />
    </div>
  );
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
function LandingPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [q, setQ] = useState("");
  return (
    <div className="min-h-screen bg-background font-[Inter,sans-serif]">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-30 h-16 flex items-center px-6 sm:px-10 justify-between"
        style={{ background: "rgba(15,17,21,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Play size={14} className="text-white fill-white" />
          </div>
          <span className="text-foreground font-bold text-xl tracking-tight">Omni<span className="text-primary">Stream</span></span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate("login")} className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors px-4 py-2 rounded-xl hover:bg-secondary">
            Iniciar sesión
          </button>
          <button onClick={() => onNavigate("register")} className="bg-primary hover:bg-primary/80 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all hover:scale-105">
            Crear cuenta
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-16 min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #3B82F6, transparent 50%), radial-gradient(circle at 80% 20%, #8B5CF6, transparent 50%)" }} />
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <Zap size={12} /> 11 plataformas · 1 búsqueda
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-foreground leading-tight mb-6">
            Encuentra dónde ver cualquier{" "}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}>
              película, serie
            </span>{" "}
            o evento deportivo
          </h1>
          <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
            Busca un título y descubre en qué plataforma está disponible. Accede directo al servicio oficial.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch gap-3 max-w-lg mx-auto mb-10">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onNavigate("search")}
                placeholder="Buscar título..."
                className="w-full bg-secondary border border-border rounded-xl pl-10 pr-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>
            <button
              onClick={() => onNavigate("dashboard")}
              className="bg-primary hover:bg-primary/80 text-white font-semibold px-6 py-3.5 rounded-xl transition-all hover:scale-105 text-sm whitespace-nowrap"
            >
              Buscar ahora
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={() => onNavigate("dashboard")} className="flex items-center gap-2 border border-border hover:border-primary/40 text-muted-foreground hover:text-foreground px-4 py-2 rounded-xl text-sm transition-all hover:bg-secondary">
              <Grid3X3 size={14} /> Explorar catálogo
            </button>
            <button onClick={() => onNavigate("sports")} className="flex items-center gap-2 border border-border hover:border-primary/40 text-muted-foreground hover:text-foreground px-4 py-2 rounded-xl text-sm transition-all hover:bg-secondary">
              <Trophy size={14} /> Deportes en vivo
            </button>
          </div>
        </div>
      </section>

      {/* Trending section */}
      <section className="px-4 sm:px-10 pb-16">
        <h2 className="text-foreground text-xl font-bold mb-6 flex items-center gap-2">
          <TrendingUp size={20} className="text-primary" /> Tendencias ahora
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {ALL_CONTENT.filter((c) => c.trending).map((item) => {
            const [from, to] = getGradient(item.id);
            return (
              <div key={item.id} onClick={() => onNavigate("login")}
                className="cursor-pointer rounded-xl overflow-hidden bg-card border border-border hover:border-primary/40 hover:scale-105 transition-all duration-300 group">
                <div className="h-40 relative" style={{ background: `linear-gradient(160deg, ${from}, ${to})` }}>
                  <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-2.5">
                  <p className="text-foreground text-xs font-semibold truncate">{item.title}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-muted-foreground text-[10px]">{item.year}</span>
                    <StarRating rating={item.rating} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Platforms strip */}
      <section className="px-4 sm:px-10 pb-16">
        <h2 className="text-foreground text-xl font-bold mb-6 text-center">Plataformas disponibles</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {PLATFORMS_DATA.map((p) => (
            <div key={p.id} onClick={() => onNavigate("login")}
              className="cursor-pointer bg-card border border-border hover:border-primary/40 rounded-xl px-4 py-3 flex items-center gap-2 transition-all hover:scale-105 group">
              <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
              <span className="text-foreground text-sm font-medium">{p.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-4 sm:px-10 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Play size={12} className="text-white fill-white" />
            </div>
            <span className="text-foreground font-bold">Omni<span className="text-primary">Stream</span></span>
          </div>
          <p className="text-muted-foreground text-xs text-center">
            © 2026 Omnistream · Solo mostramos disponibilidad, no reproducimos contenido
          </p>
          <div className="flex gap-4 text-muted-foreground text-xs">
            <a href="#" className="hover:text-foreground">Privacidad</a>
            <a href="#" className="hover:text-foreground">Términos</a>
            <a href="#" className="hover:text-foreground">Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
function LoginPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16 font-[Inter,sans-serif]">
      <div className="w-full max-w-md">
        <button onClick={() => onNavigate("landing")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft size={16} /> Volver
        </button>
        <div className="bg-card border border-border rounded-2xl p-8">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Play size={16} className="text-white fill-white" />
            </div>
            <span className="text-foreground font-bold text-xl">Omni<span className="text-primary">Stream</span></span>
          </div>
          <h1 className="text-foreground text-2xl font-bold mb-1">Bienvenido de vuelta</h1>
          <p className="text-muted-foreground text-sm mb-8">Inicia sesión para continuar</p>

          <div className="space-y-3 mb-6">
            <button className="w-full flex items-center justify-center gap-3 bg-secondary hover:bg-secondary/70 border border-border text-foreground py-3 rounded-xl text-sm font-medium transition-all hover:border-primary/30">
              <Chrome size={16} /> Continuar con Google
            </button>
            <button className="w-full flex items-center justify-center gap-3 bg-secondary hover:bg-secondary/70 border border-border text-foreground py-3 rounded-xl text-sm font-medium transition-all hover:border-primary/30">
              <Apple size={16} /> Continuar con Apple
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-muted-foreground text-xs">o con correo</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-foreground text-sm font-medium mb-1.5">Correo electrónico</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="tu@correo.com"
                  className="w-full bg-input-background border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-foreground text-sm font-medium mb-1.5">Contraseña</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-all"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <div
                  onClick={() => setRemember(!remember)}
                  className={`w-4 h-4 rounded border transition-all flex items-center justify-center
                    ${remember ? "bg-primary border-primary" : "border-border"}`}
                >
                  {remember && <Check size={10} className="text-white" />}
                </div>
                <span className="text-muted-foreground text-sm">Recordarme</span>
              </label>
              <button className="text-primary text-sm hover:underline">Olvidé mi contraseña</button>
            </div>
            <button
              onClick={() => onNavigate("dashboard")}
              className="w-full bg-primary hover:bg-primary/80 text-white font-semibold py-3 rounded-xl transition-all hover:scale-[1.02] text-sm"
            >
              Iniciar sesión
            </button>
          </div>

          <p className="text-center text-muted-foreground text-sm mt-6">
            ¿No tienes cuenta?{" "}
            <button onClick={() => onNavigate("register")} className="text-primary hover:underline font-medium">
              Crear cuenta
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── REGISTER PAGE ────────────────────────────────────────────────────────────
function RegisterPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [prefs, setPrefs] = useState<string[]>(["Películas"]);
  const togglePref = (p: string) =>
    setPrefs((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16 font-[Inter,sans-serif]">
      <div className="w-full max-w-md">
        <button onClick={() => onNavigate("login")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft size={16} /> Volver al inicio de sesión
        </button>
        <div className="bg-card border border-border rounded-2xl p-8">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Play size={16} className="text-white fill-white" />
            </div>
            <span className="text-foreground font-bold text-xl">Omni<span className="text-primary">Stream</span></span>
          </div>
          <h1 className="text-foreground text-2xl font-bold mb-1">Crear cuenta</h1>
          <p className="text-muted-foreground text-sm mb-8">Únete a Omnistream gratis</p>
          <div className="space-y-4">
            {[
              { label: "Nombre completo", type: "text", placeholder: "Usuario" },
              { label: "Correo electrónico", type: "email", placeholder: "tu@correo.com" },
              { label: "Contraseña", type: "password", placeholder: "Mínimo 8 caracteres" },
              { label: "Confirmar contraseña", type: "password", placeholder: "Repite tu contraseña" },
            ].map(({ label, type, placeholder }) => (
              <div key={label}>
                <label className="block text-foreground text-sm font-medium mb-1.5">{label}</label>
                <input
                  type={type}
                  placeholder={placeholder}
                  className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-all"
                />
              </div>
            ))}

            <div>
              <label className="block text-foreground text-sm font-medium mb-2">¿Qué te interesa?</label>
              <div className="flex gap-2 flex-wrap">
                {["Películas", "Series", "Deportes"].map((p) => (
                  <button
                    key={p}
                    onClick={() => togglePref(p)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium border transition-all
                      ${prefs.includes(p) ? "bg-primary/15 border-primary text-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}
                  >
                    {prefs.includes(p) && <Check size={12} />}
                    {p === "Películas" && <Film size={12} />}
                    {p === "Series" && <Tv size={12} />}
                    {p === "Deportes" && <Trophy size={12} />}
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => onNavigate("dashboard")}
              className="w-full bg-primary hover:bg-primary/80 text-white font-semibold py-3 rounded-xl transition-all hover:scale-[1.02] text-sm mt-2"
            >
              Crear cuenta
            </button>
          </div>
          <p className="text-center text-muted-foreground text-xs mt-4">
            Al registrarte aceptas los{" "}
            <a href="#" className="text-primary hover:underline">Términos de servicio</a>
          </p>
          <p className="text-center text-muted-foreground text-sm mt-3">
            ¿Ya tienes cuenta?{" "}
            <button onClick={() => onNavigate("login")} className="text-primary hover:underline font-medium">
              Iniciar sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────
function DashboardPage({
  onNavigate, favorites, onToggleFavorite,
}: {
  onNavigate: (p: Page, id?: number) => void;
  favorites: number[];
  onToggleFavorite: (id: number) => void;
}) {
  const [tab, setTab] = useState<"todos" | "movies" | "series">("todos");
  const trending = ALL_CONTENT.filter((c) => c.trending);
  const newReleases = ALL_CONTENT.filter((c) => c.newRelease);
  const movies = ALL_CONTENT.filter((c) => c.type === "movie");
  const series = ALL_CONTENT.filter((c) => c.type === "series");
  const continueItems = CONTINUE_WATCHING.map(({ id, progress }) => ({
    item: ALL_CONTENT.find((c) => c.id === id)!,
    progress,
  })).filter((x) => x.item);

  return (
    <div>
      <HeroCarousel items={trending} onNavigate={onNavigate} />

      {/* Category tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: "todos", label: "Todo" },
          { key: "movies", label: "Películas", icon: <Film size={13} /> },
          { key: "series", label: "Series", icon: <Tv size={13} /> },
        ].map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setTab(key as typeof tab)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all
              ${tab === key ? "bg-primary text-white" : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/70"}`}
          >
            {icon}{label}
          </button>
        ))}
      </div>

      {/* Continue watching */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-foreground font-semibold text-base flex items-center gap-2">
            <span className="text-green-400"><Clock size={16} /></span> Continuar viendo
          </h2>
          <button className="text-primary text-xs font-medium hover:underline flex items-center gap-1">Ver todo <ChevronRight size={12} /></button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {continueItems.map(({ item, progress }) => (
            <div key={item.id} onClick={() => onNavigate("detail", item.id)}
              className="flex-shrink-0 w-48 cursor-pointer rounded-xl overflow-hidden bg-card border border-border hover:border-primary/40 hover:scale-105 transition-all group">
              <Poster id={item.id} title={item.title} className="h-28" />
              <div className="px-3 pb-3 pt-2">
                <p className="text-foreground text-xs font-semibold truncate">{item.title}</p>
                <p className="text-muted-foreground text-[10px] mb-2">{item.duration}</p>
                <div className="h-1 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-muted-foreground text-[10px] mt-1">{progress}% completado</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {(tab === "todos" || tab === "movies") && (
        <HSection title="Tendencias" items={trending} onNavigate={onNavigate} favorites={favorites} onToggleFavorite={onToggleFavorite} icon={<TrendingUp size={16} />} />
      )}
      {(tab === "todos" || tab === "movies") && (
        <HSection title="Nuevos estrenos" items={newReleases} onNavigate={onNavigate} favorites={favorites} onToggleFavorite={onToggleFavorite} icon={<Zap size={16} />} />
      )}
      {(tab === "todos" || tab === "movies") && (
        <HSection title="Películas destacadas" items={movies} onNavigate={onNavigate} favorites={favorites} onToggleFavorite={onToggleFavorite} icon={<Film size={16} />} />
      )}
      {(tab === "todos" || tab === "series") && (
        <HSection title="Series populares" items={series} onNavigate={onNavigate} favorites={favorites} onToggleFavorite={onToggleFavorite} icon={<Tv size={16} />} />
      )}

      {/* Sports live strip */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-foreground font-semibold text-base flex items-center gap-2">
            <span className="text-red-400"><Trophy size={16} /></span> Deportes en vivo
          </h2>
          <button onClick={() => onNavigate("sports")} className="text-primary text-xs font-medium hover:underline flex items-center gap-1">Ver todo <ChevronRight size={12} /></button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SPORTS_EVENTS.filter((e) => e.status === "live").concat(SPORTS_EVENTS.filter((e) => e.status === "upcoming")).slice(0, 3).map((event) => (
            <SportEventCard key={event.id} event={event} onNavigate={onNavigate} />
          ))}
        </div>
      </section>
    </div>
  );
}

// ─── Sport Event Card ─────────────────────────────────────────────────────────
function SportEventCard({ event, onNavigate }: { event: SportEvent; onNavigate: (p: Page) => void }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/40 hover:scale-[1.02] transition-all cursor-pointer" onClick={() => onNavigate("sports")}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{SPORT_ICONS[event.sport] || "🏆"}</span>
          <div>
            <span className="text-muted-foreground text-xs">{event.sport}</span>
            <p className="text-foreground text-sm font-semibold leading-tight">{event.title}</p>
          </div>
        </div>
        {event.status === "live" && (
          <span className="flex items-center gap-1 bg-red-500/15 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-500/30">
            <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />EN VIVO
          </span>
        )}
        {event.status === "upcoming" && (
          <span className="bg-blue-500/10 text-blue-400 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-blue-500/20">
            {event.date} · {event.time}
          </span>
        )}
        {event.status === "finished" && (
          <span className="bg-secondary text-muted-foreground text-[10px] font-semibold px-2 py-0.5 rounded-full">Finalizado</span>
        )}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 flex-wrap">
          {event.platforms.map((p) => <PlatformPill key={p} name={p} />)}
        </div>
        <button className="text-primary text-xs font-medium flex items-center gap-1 hover:underline">
          <ExternalLink size={11} /> Ver
        </button>
      </div>
    </div>
  );
}

// ─── SEARCH PAGE ──────────────────────────────────────────────────────────────
function SearchPage({
  onNavigate, searchQuery, favorites, onToggleFavorite,
}: {
  onNavigate: (p: Page, id?: number) => void;
  searchQuery: string;
  favorites: number[];
  onToggleFavorite: (id: number) => void;
}) {
  const [filter, setFilter] = useState("Todos");
  const [sort, setSort] = useState("Popularidad");
  const filters = ["Todos", "Películas", "Series", "Gratis", "Suscripción"];
  const sorts = ["Popularidad", "Calificación", "Año"];

  const results = ALL_CONTENT.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchQ = !q || c.title.toLowerCase().includes(q) || c.genre.toLowerCase().includes(q);
    const matchF = filter === "Todos" || (filter === "Películas" && c.type === "movie") || (filter === "Series" && c.type === "series");
    return matchQ && matchF;
  }).sort((a, b) => {
    if (sort === "Calificación") return b.rating - a.rating;
    if (sort === "Año") return b.year - a.year;
    return 0;
  });

  return (
    <div>
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <Filter size={15} className="text-muted-foreground" />
        {filters.map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all
              ${filter === f ? "bg-primary/15 border-primary text-primary" : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"}`}>
            {f}
          </button>
        ))}
        <div className="flex items-center gap-1.5 ml-auto">
          <span className="text-muted-foreground text-xs">Ordenar:</span>
          {sorts.map((s) => (
            <button key={s} onClick={() => setSort(s)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all
                ${sort === s ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {searchQuery && (
        <p className="text-muted-foreground text-sm mb-4">
          {results.length} resultado{results.length !== 1 ? "s" : ""} para{" "}
          <span className="text-foreground font-medium">"{searchQuery}"</span>
        </p>
      )}

      {results.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Search size={40} className="text-muted-foreground/40 mb-4" />
          <h3 className="text-foreground font-semibold text-lg mb-2">Sin resultados</h3>
          <p className="text-muted-foreground text-sm">Prueba con otro término de búsqueda</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((item) => (
            <SearchResultCard key={item.id} item={item} onNavigate={onNavigate} favorites={favorites} onToggleFavorite={onToggleFavorite} />
          ))}
        </div>
      )}
    </div>
  );
}

function SearchResultCard({
  item, onNavigate, favorites, onToggleFavorite,
}: {
  item: ContentItem;
  onNavigate: (p: Page, id?: number) => void;
  favorites: number[];
  onToggleFavorite: (id: number) => void;
}) {
  const isFav = favorites.includes(item.id);
  const [from, to] = getGradient(item.id);
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-all hover:shadow-xl hover:shadow-black/40 group">
      <div className="flex">
        <div className="w-24 flex-shrink-0 h-32 cursor-pointer relative" style={{ background: `linear-gradient(160deg, ${from}, ${to})` }}
          onClick={() => onNavigate("detail", item.id)}>
          <div className="absolute inset-0 opacity-20 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
        <div className="flex-1 p-3 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-foreground font-semibold text-sm leading-tight truncate cursor-pointer hover:text-primary transition-colors"
              onClick={() => onNavigate("detail", item.id)}>{item.title}</h3>
            <button onClick={() => onToggleFavorite(item.id)}>
              <Heart size={14} className={isFav ? "fill-red-500 text-red-500" : "text-muted-foreground hover:text-red-400"} />
            </button>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap mb-2">
            <span className="text-muted-foreground text-[10px]">{item.year}</span>
            <span className="text-muted-foreground text-[10px]">·</span>
            <span className="text-muted-foreground text-[10px]">{item.duration}</span>
            <span className="text-muted-foreground text-[10px]">·</span>
            <StarRating rating={item.rating} />
          </div>
          <p className="text-muted-foreground text-[10px] mb-2 line-clamp-2">{item.synopsis}</p>
          <div className="flex gap-1 flex-wrap mb-2">
            {item.platforms.slice(0, 2).map((p) => <PlatformPill key={p} name={p} />)}
            {item.platforms.length > 2 && <span className="text-muted-foreground text-[10px]">+{item.platforms.length - 2}</span>}
          </div>
          <button onClick={() => onNavigate("detail", item.id)}
            className="text-[10px] font-semibold text-primary hover:underline flex items-center gap-1">
            <ExternalLink size={10} /> Ver disponibilidad
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── DETAIL PAGE ──────────────────────────────────────────────────────────────
function DetailPage({
  itemId, onNavigate, favorites, onToggleFavorite,
}: {
  itemId: number;
  onNavigate: (p: Page, id?: number) => void;
  favorites: number[];
  onToggleFavorite: (id: number) => void;
}) {
  const item = ALL_CONTENT.find((c) => c.id === itemId);
  if (!item) return <div className="text-muted-foreground p-8">Contenido no encontrado.</div>;

  const isFav = favorites.includes(item.id);
  const [from, to] = getGradient(item.id);
  const similar = ALL_CONTENT.filter((c) => c.id !== item.id && (c.genre.split("·")[0].trim() === item.genre.split("·")[0].trim() || c.type === item.type)).slice(0, 6);

  return (
    <div>
      <button onClick={() => onNavigate("dashboard")}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors text-sm">
        <ArrowLeft size={16} /> Volver al dashboard
      </button>

      {/* Banner */}
      <div className="relative rounded-2xl overflow-hidden mb-8 h-56 sm:h-72"
        style={{ background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)` }}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 60% 30%, rgba(255,255,255,0.2), transparent 60%)" }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <button className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all hover:scale-110">
            <Play size={28} className="text-white fill-white ml-1" />
          </button>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="inline-block bg-black/40 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg">Tráiler oficial</div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Poster + info */}
        <div className="lg:w-56 flex-shrink-0">
          <div className="rounded-2xl overflow-hidden mb-4 h-72 lg:h-80" style={{ background: `linear-gradient(160deg, ${from}, ${to})` }}>
            <div className="w-full h-full flex items-end p-4">
              <span className="text-white font-bold text-lg drop-shadow-lg">{item.title}</span>
            </div>
          </div>
          <button
            onClick={() => onToggleFavorite(item.id)}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition-all mb-2
              ${isFav ? "bg-red-500/15 border-red-500/50 text-red-400" : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"}`}>
            <Heart size={15} className={isFav ? "fill-red-400" : ""} />
            {isFav ? "En favoritos" : "Añadir a favoritos"}
          </button>
          <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border border-border text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all">
            <Share2 size={15} /> Compartir
          </button>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <h1 className="text-foreground text-3xl font-bold mb-2">{item.title}</h1>
          <div className="flex items-center gap-3 flex-wrap mb-4">
            <StarRating rating={item.rating} />
            <span className="text-muted-foreground text-sm">{item.year}</span>
            <span className="text-muted-foreground text-sm">·</span>
            <span className="text-muted-foreground text-sm">{item.duration}</span>
            <span className="text-muted-foreground text-sm">·</span>
            <span className="bg-secondary text-muted-foreground text-xs px-2 py-0.5 rounded-lg">{item.genre}</span>
          </div>

          <p className="text-muted-foreground text-sm leading-relaxed mb-6">{item.synopsis}</p>

          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            {item.director && (
              <div>
                <span className="text-muted-foreground text-xs block mb-1">Director</span>
                <span className="text-foreground font-medium">{item.director}</span>
              </div>
            )}
            <div>
              <span className="text-muted-foreground text-xs block mb-1">Tipo</span>
              <span className="text-foreground font-medium capitalize">{item.type === "movie" ? "Película" : "Serie"}</span>
            </div>
            {item.cast && (
              <div className="col-span-2">
                <span className="text-muted-foreground text-xs block mb-1.5">Reparto principal</span>
                <div className="flex gap-2 flex-wrap">
                  {item.cast.map((actor) => (
                    <span key={actor} className="bg-secondary text-foreground text-xs px-2.5 py-1 rounded-lg">{actor}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Availability section */}
          <div>
            <h2 className="text-foreground font-semibold text-base mb-3 flex items-center gap-2">
              <Monitor size={16} className="text-primary" /> Disponible en
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {item.platforms.map((pName) => {
                const p = PLATFORMS_DATA.find((x) => x.name === pName);
                return (
                  <div key={pName} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between hover:border-primary/40 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${p?.color}22` }}>
                        <span className="text-xs font-bold" style={{ color: p?.color }}>{pName[0]}</span>
                      </div>
                      <div>
                        <p className="text-foreground text-sm font-semibold">{pName}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-green-400 text-[10px] font-medium flex items-center gap-0.5">
                            <Check size={10} /> Disponible
                          </span>
                          <span className="text-muted-foreground text-[10px]">· {p?.quality}</span>
                        </div>
                        <p className="text-muted-foreground text-[10px]">{p?.price}</p>
                      </div>
                    </div>
                    <a href="#" className="bg-primary hover:bg-primary/80 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:scale-105 flex items-center gap-1.5">
                      <ExternalLink size={11} /> Abrir
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Similar content */}
      {similar.length > 0 && (
        <section className="mt-4">
          <h2 className="text-foreground font-semibold text-base mb-4">Contenido similar</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {similar.map((s) => (
              <ContentCard key={s.id} item={s} onNavigate={onNavigate} favorites={favorites} onToggleFavorite={onToggleFavorite} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ─── SPORTS PAGE ──────────────────────────────────────────────────────────────
function SportsPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [cat, setCat] = useState("Todos");
  const filtered = cat === "Todos" ? SPORTS_EVENTS : SPORTS_EVENTS.filter((e) => e.sport === cat);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-foreground text-2xl font-bold flex items-center gap-2">
          <Trophy size={22} className="text-yellow-400" /> Deportes
        </h1>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-red-400 text-xs font-semibold">{SPORTS_EVENTS.filter((e) => e.status === "live").length} EN VIVO</span>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {SPORT_CATS.map((c) => (
          <button key={c} onClick={() => setCat(c)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all
              ${cat === c ? "bg-primary/15 border-primary text-primary" : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"}`}>
            {c !== "Todos" && SPORT_ICONS[c]} {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Trophy size={40} className="text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">No hay eventos en esta categoría</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((event) => (
            <div key={event.id} className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-black/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{SPORT_ICONS[event.sport] || "🏆"}</span>
                  <span className="text-muted-foreground text-xs font-medium">{event.sport}</span>
                </div>
                {event.status === "live" && (
                  <span className="flex items-center gap-1 bg-red-500/15 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-500/30">
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" /> EN VIVO
                  </span>
                )}
                {event.status === "upcoming" && (
                  <span className="flex items-center gap-1 bg-blue-500/10 text-blue-400 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-blue-500/20">
                    <Calendar size={10} /> Próximo
                  </span>
                )}
                {event.status === "finished" && (
                  <span className="bg-secondary text-muted-foreground text-[10px] px-2 py-0.5 rounded-full">Finalizado</span>
                )}
              </div>

              <h3 className="text-foreground font-bold text-base mb-1">{event.title}</h3>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-muted-foreground text-sm">{event.teams[0]}</span>
                <span className="text-muted-foreground text-xs">vs</span>
                <span className="text-muted-foreground text-sm">{event.teams[1]}</span>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-4">
                <Clock size={12} /> {event.date} · {event.time}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-1.5 flex-wrap">
                  {event.platforms.map((p) => <PlatformPill key={p} name={p} />)}
                </div>
                <a href="#" className="bg-primary hover:bg-primary/80 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:scale-105 flex items-center gap-1">
                  <ExternalLink size={11} /> Ir al servicio
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── PLATFORMS PAGE ───────────────────────────────────────────────────────────
function PlatformsPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const platform = PLATFORMS_DATA.find((p) => p.id === selected);
  const platformContent = selected
    ? ALL_CONTENT.filter((c) => c.platforms.includes(platform?.name ?? ""))
    : [];

  if (selected && platform) {
    return (
      <div>
        <button onClick={() => setSelected(null)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors text-sm">
          <ArrowLeft size={16} /> Todas las plataformas
        </button>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black border border-border"
            style={{ background: `${platform.color}15`, color: platform.color }}>
            {platform.name[0]}
          </div>
          <div>
            <h1 className="text-foreground text-2xl font-bold">{platform.name}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-muted-foreground text-sm">{platform.quality}</span>
              <span className="text-muted-foreground text-sm">·</span>
              <span style={{ color: platform.color }} className="text-sm font-medium">{platform.price}</span>
            </div>
          </div>
          <a href="#" className="ml-auto bg-primary hover:bg-primary/80 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2">
            <ExternalLink size={14} /> Ir a {platform.name}
          </a>
        </div>
        <p className="text-muted-foreground text-sm mb-6">{platform.description}</p>
        <h2 className="text-foreground font-semibold text-base mb-4">Contenido disponible ({platformContent.length})</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {platformContent.map((item) => (
            <ContentCard key={item.id} item={item} onNavigate={(p, id) => onNavigate(p)} favorites={[]} onToggleFavorite={() => {}} />
          ))}
        </div>
        {platformContent.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">No hay contenido registrado para esta plataforma en el demo.</div>
        )}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-foreground text-2xl font-bold mb-2 flex items-center gap-2">
        <Monitor size={22} className="text-primary" /> Plataformas
      </h1>
      <p className="text-muted-foreground text-sm mb-8">Explora el catálogo de cada servicio de streaming</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {PLATFORMS_DATA.map((p) => (
          <button key={p.id} onClick={() => setSelected(p.id)}
            className="bg-card border border-border rounded-2xl p-5 flex flex-col items-center gap-3 hover:border-primary/40 hover:scale-105 transition-all group">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black"
              style={{ background: `${p.color}15`, color: p.color }}>
              {p.name[0]}
            </div>
            <div className="text-center">
              <p className="text-foreground font-semibold text-sm">{p.name}</p>
              <p className="text-muted-foreground text-[10px] mt-0.5">{p.quality}</p>
              <p style={{ color: p.color }} className="text-[11px] font-medium mt-1">{p.price}</p>
            </div>
            <span className="text-primary text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
              Ver catálogo <ChevronRight size={11} />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── FAVORITES PAGE ───────────────────────────────────────────────────────────
function FavoritesPage({
  onNavigate, favorites, onToggleFavorite,
}: {
  onNavigate: (p: Page, id?: number) => void;
  favorites: number[];
  onToggleFavorite: (id: number) => void;
}) {
  const items = ALL_CONTENT.filter((c) => favorites.includes(c.id));
  return (
    <div>
      <h1 className="text-foreground text-2xl font-bold mb-6 flex items-center gap-2">
        <Heart size={22} className="text-red-400" /> Favoritos
        <span className="text-muted-foreground text-base font-normal">({items.length})</span>
      </h1>
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Heart size={48} className="text-muted-foreground/20 mb-4" />
          <h3 className="text-foreground font-semibold text-lg mb-2">Sin favoritos aún</h3>
          <p className="text-muted-foreground text-sm mb-6">Guarda películas y series para verlas después</p>
          <button onClick={() => onNavigate("dashboard")}
            className="bg-primary hover:bg-primary/80 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all">
            Explorar contenido
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {items.map((item) => (
            <div key={item.id} className="group relative rounded-xl overflow-hidden bg-card border border-border hover:border-primary/40 hover:scale-105 transition-all cursor-pointer"
              onClick={() => onNavigate("detail", item.id)}>
              <Poster id={item.id} title={item.title} className="h-52" />
              <div className="p-2.5">
                <p className="text-foreground text-xs font-semibold truncate">{item.title}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-muted-foreground text-[10px]">{item.year}</span>
                  <StarRating rating={item.rating} />
                </div>
              </div>
              <div className="absolute top-0 right-0 flex gap-1 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => { e.stopPropagation(); onToggleFavorite(item.id); }}
                  className="p-1.5 rounded-full bg-black/60 backdrop-blur-sm">
                  <Trash2 size={12} className="text-red-400" />
                </button>
                <button onClick={(e) => e.stopPropagation()} className="p-1.5 rounded-full bg-black/60 backdrop-blur-sm">
                  <Share2 size={12} className="text-white" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── HISTORY PAGE ─────────────────────────────────────────────────────────────
function HistoryPage({
  onNavigate, onSearch,
}: {
  onNavigate: (p: Page, id?: number) => void;
  onSearch: (q: string) => void;
}) {
  const opened = HISTORY_OPENED.map((id) => ALL_CONTENT.find((c) => c.id === id)).filter(Boolean) as ContentItem[];
  return (
    <div>
      <h1 className="text-foreground text-2xl font-bold mb-8 flex items-center gap-2">
        <Clock size={22} className="text-blue-400" /> Historial
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-foreground font-semibold text-base mb-4">Búsquedas recientes</h2>
          <div className="space-y-2">
            {HISTORY_SEARCHES.map((q) => (
              <div key={q} className="flex items-center justify-between bg-card border border-border rounded-xl px-4 py-3 hover:border-primary/40 transition-all">
                <div className="flex items-center gap-3">
                  <Search size={14} className="text-muted-foreground" />
                  <span className="text-foreground text-sm">{q}</span>
                </div>
                <button
                  onClick={() => { onSearch(q); onNavigate("search"); }}
                  className="text-primary text-xs font-medium hover:underline flex items-center gap-1">
                  <ChevronRight size={12} /> Buscar
                </button>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-foreground font-semibold text-base mb-4">Vistos recientemente</h2>
          <div className="space-y-2">
            {opened.map((item) => (
              <div key={item.id}
                className="flex items-center gap-3 bg-card border border-border rounded-xl p-3 hover:border-primary/40 transition-all cursor-pointer"
                onClick={() => onNavigate("detail", item.id)}>
                <Poster id={item.id} title={item.title} className="w-12 h-16 rounded-lg flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-foreground text-sm font-semibold truncate">{item.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-muted-foreground text-xs">{item.year}</span>
                    <StarRating rating={item.rating} />
                  </div>
                  <div className="flex gap-1 mt-1.5 flex-wrap">
                    {item.platforms.slice(0, 2).map((p) => <PlatformPill key={p} name={p} />)}
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); onNavigate("detail", item.id); }}
                  className="text-primary text-xs font-medium flex items-center gap-1 flex-shrink-0">
                  <Eye size={12} /> Ver
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PROFILE PAGE ─────────────────────────────────────────────────────────────
function ProfilePage({ onNavigate, favorites }: { onNavigate: (p: Page) => void; favorites: number[] }) {
  const [darkMode] = useState(true);
  const [lang, setLang] = useState("Español");

  return (
    <div className="max-w-2xl">
      <h1 className="text-foreground text-2xl font-bold mb-8 flex items-center gap-2">
        <User size={22} className="text-primary" /> Mi perfil
      </h1>

      <div className="bg-card border border-border rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-5 mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
            US
          </div>
          <div>
            <h2 className="text-foreground text-xl font-bold">Usuario</h2>
            <p className="text-muted-foreground text-sm">user@correo.com</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="bg-primary/15 text-primary text-[11px] font-semibold px-2 py-0.5 rounded-full">Plan Gratuito</span>
              <span className="text-muted-foreground text-xs">{favorites.length} favoritos</span>
            </div>
          </div>
          <button className="ml-auto border border-border hover:border-primary/40 text-foreground text-sm px-4 py-2 rounded-xl transition-all">
            Editar
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
          {[
            { label: "Favoritos", value: favorites.length, icon: <Heart size={16} className="text-red-400" /> },
            { label: "Búsquedas", value: HISTORY_SEARCHES.length, icon: <Search size={16} className="text-blue-400" /> },
            { label: "Plataformas", value: 3, icon: <Monitor size={16} className="text-green-400" /> },
          ].map(({ label, value, icon }) => (
            <div key={label} className="text-center">
              <div className="flex justify-center mb-1">{icon}</div>
              <p className="text-foreground text-xl font-bold">{value}</p>
              <p className="text-muted-foreground text-xs">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden mb-6">
        <div className="p-4 border-b border-border">
          <h3 className="text-foreground font-semibold">Preferencias</h3>
        </div>
        {[
          { label: "Tema oscuro", value: darkMode ? "Activado" : "Desactivado", icon: <Globe size={16} /> },
          { label: "Idioma", value: lang, icon: <Globe size={16} /> },
          { label: "País", value: "España", icon: <Globe size={16} /> },
        ].map(({ label, value, icon }) => (
          <div key={label} className="flex items-center justify-between px-4 py-3.5 border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground">{icon}</span>
              <span className="text-foreground text-sm">{label}</span>
            </div>
            <span className="text-muted-foreground text-sm">{value}</span>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <button className="w-full flex items-center gap-3 px-4 py-4 text-red-400 hover:bg-red-500/10 transition-colors" onClick={() => onNavigate("landing")}>
          <LogOut size={16} />
          <span className="text-sm font-medium">Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
}

// ─── SETTINGS PAGE ────────────────────────────────────────────────────────────
function SettingsPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const sections = [
    {
      title: "General",
      items: [
        { label: "Idioma", value: "Español", type: "select" },
        { label: "País / Región", value: "España", type: "select" },
        { label: "Moneda", value: "EUR €", type: "select" },
      ],
    },
    {
      title: "Notificaciones",
      items: [
        { label: "Notificaciones de estrenos", value: true, type: "toggle" },
        { label: "Deportes en vivo", value: true, type: "toggle" },
        { label: "Recomendaciones semanales", value: false, type: "toggle" },
      ],
    },
    {
      title: "Privacidad",
      items: [
        { label: "Historial de búsqueda", value: true, type: "toggle" },
        { label: "Compartir actividad", value: false, type: "toggle" },
      ],
    },
    {
      title: "Suscripciones favoritas",
      items: [
        { label: "Netflix", value: true, type: "toggle" },
        { label: "Disney+", value: true, type: "toggle" },
        { label: "Prime Video", value: false, type: "toggle" },
        { label: "Max", value: true, type: "toggle" },
      ],
    },
  ];

  const [toggles, setToggles] = useState<Record<string, boolean>>({
    "Notificaciones de estrenos": true,
    "Deportes en vivo": true,
    "Recomendaciones semanales": false,
    "Historial de búsqueda": true,
    "Compartir actividad": false,
    "Netflix": true,
    "Disney+": true,
    "Prime Video": false,
    "Max": true,
  });

  return (
    <div className="max-w-2xl">
      <h1 className="text-foreground text-2xl font-bold mb-8 flex items-center gap-2">
        <Settings size={22} className="text-primary" /> Configuración
      </h1>
      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.title} className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <h3 className="text-foreground font-semibold text-sm">{section.title}</h3>
            </div>
            {section.items.map(({ label, value, type }) => (
              <div key={label} className="flex items-center justify-between px-4 py-3.5 border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
                <span className="text-foreground text-sm">{label}</span>
                {type === "toggle" ? (
                  <button
                    onClick={() => setToggles((prev) => ({ ...prev, [label]: !prev[label] }))}
                    className={`w-10 h-5.5 rounded-full transition-all relative flex-shrink-0 ${toggles[label] ? "bg-primary" : "bg-secondary"}`}
                    style={{ height: "22px", width: "40px" }}
                  >
                    <span
                      className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200 ${toggles[label] ? "left-[calc(100%-18px)]" : "left-0.5"}`}
                    />
                  </button>
                ) : (
                  <span className="text-muted-foreground text-sm">{value as string}</span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<Page>("landing");
  const [detailId, setDetailId] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<number[]>([1, 103]);

  const navigate = (p: Page, id?: number) => {
    if (id !== undefined) setDetailId(id);
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) navigate("search");
  };

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const getPageTitle = () => {
    const titles: Partial<Record<Page, string>> = {
      search: "Resultados de búsqueda",
      detail: ALL_CONTENT.find((c) => c.id === detailId)?.title ?? "Detalle",
      sports: "Deportes",
      platforms: "Plataformas",
      favorites: "Favoritos",
      history: "Historial",
      profile: "Mi Perfil",
      settings: "Configuración",
    };
    return titles[page];
  };

  if (page === "landing") return <LandingPage onNavigate={navigate} />;
  if (page === "login") return <LoginPage onNavigate={navigate} />;
  if (page === "register") return <RegisterPage onNavigate={navigate} />;

  return (
    <AppShell
      currentPage={page}
      onNavigate={navigate}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      onSearchSubmit={handleSearchSubmit}
    >
      {page === "dashboard" && (
        <DashboardPage onNavigate={navigate} favorites={favorites} onToggleFavorite={toggleFavorite} />
      )}
      {page === "search" && (
        <SearchPage onNavigate={navigate} searchQuery={searchQuery} favorites={favorites} onToggleFavorite={toggleFavorite} />
      )}
      {page === "detail" && (
        <DetailPage itemId={detailId} onNavigate={navigate} favorites={favorites} onToggleFavorite={toggleFavorite} />
      )}
      {page === "sports" && <SportsPage onNavigate={navigate} />}
      {page === "platforms" && <PlatformsPage onNavigate={navigate} />}
      {page === "favorites" && (
        <FavoritesPage onNavigate={navigate} favorites={favorites} onToggleFavorite={toggleFavorite} />
      )}
      {page === "history" && (
        <HistoryPage onNavigate={navigate} onSearch={setSearchQuery} />
      )}
      {page === "profile" && <ProfilePage onNavigate={navigate} favorites={favorites} />}
      {page === "settings" && <SettingsPage onNavigate={navigate} />}
    </AppShell>
  );
}
