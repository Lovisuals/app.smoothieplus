// --- SYSTEM CONFIGURATION ---
const SYSTEM_SETTINGS = {
    // Backend URL (Google Apps Script)
    apiUrl: "https://script.google.com/macros/s/AKfycbylW3_w8NdVfE-Ow-2qdaMDJn-b90Nvj-M2bKfz-d_w4IYCLtSFE5kL0i16tKQp906R/exec",
    
    // Security Keys
    keys: { 
        INVESTOR: "iwillinvesT", 
        BUILDER: "AdminEDITGODMODE", 
        COMMANDER: "Admin GODMODE" 
    },
    
    // Admin Details
    admin: { 
        whatsapp: "2347068516779", 
        bankName: "OPay", 
        acctNum: "8083000771", 
        acctName: "LAWAL OPEYEMI MICHAEL" 
    }
};

// --- PRODUCT CATALOG ---
const PRODUCT_CATALOG = [
    { 
        id: 1, 
        name: "Diabetes Defense", 
        price: 3500, 
        img: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?auto=format&fit=crop&w=500&q=80", 
        color: "green", 
        description: "Low-glycemic blend designed for steady energy.", 
        ingredients: "Green Apple, Cucumber" 
    },
    { 
        id: 2, 
        name: "Mood Lifter", 
        price: 4200, 
        img: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=500&q=80", 
        color: "purple", 
        description: "Antioxidant rich antidepressant focus.", 
        ingredients: "Banana, Berries" 
    },
    { 
        id: 3, 
        name: "Workaholic Energy", 
        price: 3800, 
        img: "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&w=500&q=80", 
        color: "orange", 
        description: "Instant natural energy spike.", 
        ingredients: "Watermelon, Pineapple" 
    },
    { 
        id: 4, 
        name: "Pure Hydration", 
        price: 3000, 
        img: "https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?auto=format&fit=crop&w=500&q=80", 
        color: "cyan", 
        description: "Single-fruit maximum hydration.", 
        ingredients: "100% Watermelon" 
    }
];