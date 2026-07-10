# MASTER TASK: Build Physics Festival 2026 MVP Landing Page

You are an Expert UI/UX Frontend Engineer. Your objective is to build the complete, production-ready landing page for "Physics Festival 2026" based strictly on the provided design guidelines, data, and tech stack[cite: 5].

## 1. Prerequisites & Context
- **Tech Stack:** Next.js (App Router), Tailwind CSS, Shadcn UI, Framer Motion, `@studio-freight/react-lenis`, `next/image` (for logos), and `lucide-react`[cite: 5].
- **Design Rules:** You MUST strictly follow the rules defined in `claude.md` (Clean Cosmic & Earthy Balance, High Contrast Separation, Responsive Hover vs Tap, Centered Media)[cite: 5].
- **Execution Style:** Write modular, DRY code[cite: 5]. Create separate components for each section and assemble them in `app/page.tsx`[cite: 5].

## 2. Event Data & Copywriting
- **Event Name:** Physics Festival 2026 (Physics Festival XXV)[cite: 5].
- **Location & Maps:** 
  - Auditorium Universitas Andalas (https://maps.app.goo.gl/3A3qKx8K4q8o8R1A8)
  - Convention Hall Universitas Andalas (https://maps.app.goo.gl/8J8L2L8B8Q8Q8Q8Q8)
- **Contacts:** Madani Ulfa (0821-7273-8476), Agiel (0895-0275-1930)[cite: 5].
- **Social:** Instagram @physicsfestivalunand[cite: 5].

## 3. Page Structure & Component Requirements

### Step 1: Layout & Setup
- **`components/SmoothScroll.tsx`**: Create a Lenis smooth scroll wrapper[cite: 5].
- **`components/Navbar.tsx`**: Sticky top navigation[cite: 5]. **CRITICAL:** Implement the logo using `next/image` pointing to `/logo.png` (or `.svg`) from the public folder. Links: Beranda, Tentang, Cabang Lomba, Timeline, Unduh Berkas, Kontak[cite: 5]. Add a "Daftar Sekarang" primary button[cite: 5].

### Step 2: Hero & About Sections
- **`components/Hero.tsx`**: 
  - Background: Image of Universitas Andalas Rectorate. **MUST use `bg-center bg-cover`** overlaid with a heavy Cosmic Navy gradient (`from-navy-900/95 to-navy-900/75`) to guarantee maximum text contrast and ensure it doesn't blend invisibly into the background.
  - Text: White and Gold (`#E7A93C`)[cite: 5]. Heading "Cosmic Odyssey", subheading "Exploring the Boundaries of Space and Time"[cite: 5]. 
  - Animations: Staggered fade-up for text[cite: 5].
- **`components/About.tsx`**: 
  - Background: Soft, light earthy base (`#F4F9FF`)[cite: 5].
  - Content: 6 goals of the festival[cite: 5]. Implement soft drop-shadows on the text containers for visual separation.

### Step 3: Competitions Section (The Core)
- **`components/Competitions.tsx`** & **`components/FlipCard.tsx`**:
  - Grid layout[cite: 5]. Use 3D Flip Cards (Front: Clean white with `shadow-md` and `border` for contrast, Back: Cosmic dark gradient)[cite: 5].
  - **CRITICAL INTERACTION:** Implement responsive flip logic (hover for desktop, `onClick` state for mobile to prevent sticky hover).
  - Render these 6 competitions: Galaxy Voyage, Orbit of Champions, Cosmic Brainstorm Battle, Galaxy Research Odyssey, Vortex, Nebula Visual Quest[cite: 5].

### Step 4: Timeline & Downloads Section
- **`components/Timeline.tsx`**: Vertical staggered list revealing via Framer Motion[cite: 5].
- **`components/Downloads.tsx`**: A clean section providing links to download static files (Surat Keorisinalitasan and Template Kartu Peserta) using Shadcn Buttons with `lucide-react`[cite: 5].

### Step 5: Footer & Assembly
- **`components/Footer.tsx`**: Deep cosmic background[cite: 5]. 
  - **CRITICAL:** You MUST include an embedded Google Maps `<iframe>` showcasing the Universitas Andalas location at the bottom of the footer, alongside the brand logo (`/logo.png`), quick links, and contact info[cite: 5].
- **`app/page.tsx`**: Assemble all components gracefully[cite: 5].

## 4. Execution Plan
Please generate the code step-by-step to avoid truncation[cite: 5]:
1. First, generate `SmoothScroll.tsx`, `Navbar.tsx` (with logo), and `Hero.tsx`. Wait for my "NEXT"[cite: 5].
2. Second, generate `About.tsx` and the 3D `FlipCard.tsx` component. Wait for my "NEXT"[cite: 5].
3. Third, generate `Competitions.tsx` and `Timeline.tsx`. Wait for my "NEXT"[cite: 5].
4. Finally, generate `Downloads.tsx`, `Footer.tsx` (with Gmaps), and `app/page.tsx`[cite: 5].