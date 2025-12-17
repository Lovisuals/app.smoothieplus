/* ============ GLOBAL CONFIGURATION ============ */
const GOOGLE_API_URL = "https://script.google.com/macros/s/AKfycbylW3_w8NdVfE-Ow-2qdaMDJn-b90Nvj-M2bKfz-d_w4IYCLtSFE5kL0i16tKQp906R/exec";
const SITE_STATE = 'ACTIVE'; // Options: 'ACTIVE', 'MAINTENANCE'

const KEYS = { 
    INVESTOR: "iwillinvesT", 
    BUILDER: "AdminEDITGODMODE", 
    COMMANDER: "Admin GODMODE" 
};

const STORE_CONFIG = {
    admin: { 
        whatsapp: "2347068516779", 
        bankName: "OPay", 
        acctNum: "8083000771", 
        acctName: "LAWAL OPEYEMI MICHAEL" 
    },
    products: [
        { id: 1, name: "Diabetes Defense", price: 3500, img: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?auto=format&fit=crop&w=500&q=80", color: "green", description: "Low-glycemic blend.", ingredients: "Green Apple, Cucumber" },
        { id: 2, name: "Mood Lifter", price: 4200, img: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=500&q=80", color: "purple", description: "Antidepressant focus.", ingredients: "Banana, Berries" },
        { id: 3, name: "Workaholic Energy", price: 3800, img: "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&w=500&q=80", color: "orange", description: "Instant natural energy.", ingredients: "Watermelon, Pineapple" },
        { id: 4, name: "Pure Hydration", price: 3000, img: "https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?auto=format&fit=crop&w=500&q=80", color: "cyan", description: "Single-fruit variety.", ingredients: "100% Watermelon" }
    ]
};

/* ============ APP STATE ============ */
let cart = {};
let adminMode = false;
let currentName = localStorage.getItem('mySmoothieName') || 'UNKNOWN';
let localUserPin = localStorage.getItem('mySmoothiePin');
let tasks = [];

/* ============ PWA MANIFEST GENERATOR ============ */
const manifest = {
    name: "smoothiePlus+", short_name: "sPlus+", start_url: ".", display: "standalone",
    background_color: "#050508", theme_color: "#000000",
    icons: [{ src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Ccircle cx='256' cy='256' r='256' fill='%23050508'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-weight='900' font-size='300' fill='%2339ff14' text-anchor='middle' dy='.35em'%3ES+%3C/text%3E%3C/svg%3E", sizes: "512x512", type: "image/svg+xml" }]
};

// Inject manifest immediately
const placeholder = document.getElementById('manifest-placeholder');
if(placeholder) {
    placeholder.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(manifest));
}
