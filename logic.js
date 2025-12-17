// STATE VARIABLES
let cart = {};
let adminMode = false;
let currentName = localStorage.getItem('mySmoothieName') || 'UNKNOWN';
let localUserPin = localStorage.getItem('mySmoothiePin');
let tasks = [];

// --- INITIALIZATION ---
window.addEventListener('load', () => {
    renderMenu();
    renderBankDetails();
    restoreSession();
    
    // Key Listeners
    setupKeyListeners();
    
    // Auto-Login Check
    if(window.location.hash === "#employee") openLoginModal();
    if(localStorage.getItem('smoothieActiveView') === 'teamPanelVault') startNeuralLink();
    
    // Set Identity
    const idDisplay = document.getElementById('userIdentityDisplay');
    if(idDisplay) idDisplay.innerText = currentName;
});

function setupKeyListeners() {
    const ids = ['accessKey', 'newPin', 'chatInput'];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if(el) {
            el.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') {
                    if(id === 'accessKey') checkAccess();
                    if(id === 'newPin') saveNewIdentity();
                    if(id === 'chatInput') sendChatMessage();
                }
            });
        }
    });
}

// --- RENDER FUNCTIONS ---
function renderMenu() {
    const c = document.getElementById('menuGrid');
    if(!c) return;
    
    let h = '';
    PRODUCT_CATALOG.forEach(p => {
        const edit = adminMode ? 'contenteditable="true" class="admin-editable rounded p-1"' : '';
        h += `
        <div onclick="showProductDetails(${p.id})" class="float-card bg-gray-900 border border-${p.color}-500/50 rounded-2xl p-3 shadow-lg flex flex-col justify-between cursor-pointer active:scale-95 transition shimmer-card">
            <div>
                <h3 ${edit} class="font-bold text-sm uppercase mb-2 text-white">${p.name}</h3>
                <div class="h-28 w-full rounded-xl mb-2 overflow-hidden bg-gray-800">
                    <img src="${p.img}" class="object-cover w-full h-full">
                </div>
            </div>
            <div class="flex justify-between items-center mt-2">
                <span class="text-${p.color}-400 font-bold">₦<span ${edit}>${p.price.toLocaleString()}</span></span>
                <button onclick="event.stopPropagation(); addToCart('${p.name}', ${p.price})" class="bg-${p.color}-600 text-black text-xs font-bold px-3 py-1.5 rounded-lg z-10">+ ADD</button>
            </div>
        </div>`;
    });
    
    c.innerHTML = h;
    const loading = document.getElementById('loadingMsg');
    if(loading) loading.style.display = 'none';

    renderInvestorGrid();
}

function renderInvestorGrid() {
    const invGrid = document.getElementById('investorProductGrid');
    if(invGrid) {
        let invHtml = '';
        PRODUCT_CATALOG.forEach(p => {
            const margin = Math.round(p.price * 0.6);
            invHtml += `<div class="bg-gray-800 p-3 rounded-xl border border-gray-700 flex items-center gap-3 shimmer-card"><img src="${p.img}" class="w-12 h-12 rounded-full object-cover"><div><p class="text-white font-bold text-sm">${p.name}</p><p class="text-neon text-xs">Margin ₦${margin.toLocaleString()}</p></div></div>`;
        });
        invGrid.innerHTML = invHtml;
    }
}

function renderBankDetails() {
    document.getElementById('dispBankName').innerText = SYSTEM_SETTINGS.admin.bankName;
    document.getElementById('dispAcctNum').innerText = SYSTEM_SETTINGS.admin.acctNum;
    document.getElementById('dispAcctName').innerText = SYSTEM_SETTINGS.admin.acctName;
}

// --- CART LOGIC ---
function addToCart(n, p) {
    if(cart[n]) cart[n].q++; else cart[n]={p:p, q:1};
    updateCart();
    document.getElementById('orderSheet').classList.add('active');
}

function updateCart() {
    const l = document.getElementById('cartItems');
    l.innerHTML='';
    let t=0, c=0;
    for(const [k,v] of Object.entries(cart)) {
        t+=v.p*v.q; c+=v.q;
        l.innerHTML+=`<div class="flex justify-between text-white"><span>${k} x${v.q}</span><span>₦${(v.p*v.q).toLocaleString()}</span></div>`;
    }
    document.getElementById('totalPrice').innerText = '₦'+t.toLocaleString();
    document.getElementById('cartCount').innerText = c;
    document.getElementById('cartCount').classList.toggle('hidden', c===0);
}

function sendOrder() {
    let m = `*NEW ORDER* %0A ${document.getElementById('custName').value}%0A ${document.getElementById('custAddress').value}%0A%0A`;
    for(const [k,v] of Object.entries(cart)) m+=`${k} (x${v.q}) - ₦${v.p*v.q}%0A`;
    
    if(SYSTEM_SETTINGS.apiUrl) safePost({ 
        type: 'ORDER', 
        customer: document.getElementById('custName').value, 
        orderString: m, 
        total: document.getElementById('totalPrice').innerText, 
        pin: SYSTEM_SETTINGS.keys.COMMANDER 
    });
    
    window.open(`https://wa.me/${SYSTEM_SETTINGS.admin.whatsapp}?text=${m}`, '_blank');
}

// --- SCANNER LOGIC ---
function startScanner() {
    document.getElementById('scannerModal').style.display = 'flex';
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(stream => {
        document.getElementById('scannerVideo').srcObject = stream;
        setTimeout(() => {
            const randomProduct = PRODUCT_CATALOG[Math.floor(Math.random() * PRODUCT_CATALOG.length)];
            closeScanner();
            showProductDetails(randomProduct.id);
            showToast("MATCH FOUND: " + randomProduct.name, "success");
        }, 3500);
    }).catch(e => {
        alert("Camera access required for Bio-Scan.");
        closeScanner();
    });
}

function closeScanner() {
    document.getElementById('scannerModal').style.display = 'none';
    const vid = document.getElementById('scannerVideo');
    if(vid.srcObject) vid.srcObject.getTracks().forEach(t => t.stop());
}

// --- SECURITY & AUTH ---
function checkAccess() {
    const val = document.getElementById('accessKey').value.trim();
    if (val === SYSTEM_SETTINGS.keys.INVESTOR) {
        launchApp('investorVault', "green", " INVESTOR VIEW");
        closeLoginModal();
    } else if (val === SYSTEM_SETTINGS.keys.BUILDER) {
        closeLoginModal();
        activateBuilderMode();
    } else if (val === SYSTEM_SETTINGS.keys.COMMANDER) {
        document.getElementById('authStage').classList.add('hidden');
        document.getElementById('createPinStage').classList.remove('hidden');
        document.getElementById('newName').focus();
    } else if (localUserPin && val === localUserPin) {
        launchApp('teamPanelVault', "blue", " COMMANDER ACTIVE");
        startNeuralLink();
        closeLoginModal();
    } else {
        alert("ACCESS DENIED");
    }
}

// --- SYNC & BACKEND ---
async function safePost(payload) {
    try {
        await fetch(SYSTEM_SETTINGS.apiUrl, { method: 'POST', mode: 'no-cors', body: JSON.stringify(payload) });
        showToast("SYNCED ✓", "success");
    } catch (e) {
        showToast("OFFLINE", "error");
    }
}

function startNeuralLink() {
    loadCloudData();
    setInterval(loadCloudData, 5000);
}

async function loadCloudData() {
    if(!SYSTEM_SETTINGS.apiUrl) return;
    try {
        const res = await fetch(SYSTEM_SETTINGS.apiUrl);
        const data = await res.json();
        // Chat and Task logic here (Simplified for modularity, can be expanded)
        tasks = data.tasks; 
        renderTasks(); 
    } catch(e) { console.log("Sync Error"); }
}

// --- UI HELPERS ---
function toggleSheet() { document.getElementById('orderSheet').classList.toggle('active'); }
function showToast(msg, type) { 
    const t = document.getElementById('apiToast'); 
    t.innerText = msg; 
    t.className = type === 'error' ? 'error active' : 'active'; 
    setTimeout(() => t.classList.remove('active'), 2000); 
}
function showProductDetails(id) {
    const p = PRODUCT_CATALOG.find(x => x.id === id);
    if(!p) return;
    document.getElementById('modalContent').innerHTML = `<div class="text-center mb-6"><img src="${p.img}" class="w-32 h-32 rounded-full mx-auto object-cover border-4 border-${p.color}-500 mb-4 shadow-[0_0_30px_rgba(255,255,255,0.2)]"><h2 class="text-3xl font-black uppercase text-white leading-none mb-1">${p.name}</h2><p class="text-${p.color}-400 font-bold text-xl">₦${p.price.toLocaleString()}</p></div><div class="space-y-4 text-sm text-gray-300"><div class="bg-gray-800/50 p-4 rounded-xl border border-gray-700"><p class="uppercase text-[10px] text-gray-500 font-bold tracking-widest mb-1">Function</p><p>${p.description}</p></div><div class="bg-gray-800/50 p-4 rounded-xl border border-gray-700"><p class="uppercase text-[10px] text-gray-500 font-bold tracking-widest mb-1">Contains</p><p class="italic text-gray-400">${p.ingredients}</p></div></div><button onclick="addToCart('${p.name}', ${p.price}); closeModal()" class="w-full mt-8 bg-white text-black font-black py-4 rounded-xl uppercase hover:scale-105 transition shadow-lg">Add to Order</button>`;
    document.getElementById('productModal').style.display = 'flex';
}
function closeModal() { document.getElementById('productModal').style.display = 'none'; }
function openLoginModal() { document.getElementById('loginModal').style.display = 'flex'; }
function closeLoginModal() { document.getElementById('loginModal').style.display = 'none'; }
function togglePassVisibility() { const i = document.getElementById('accessKey'); i.type = i.type === "password" ? "text" : "password"; }
function closeDrawer(id) { document.getElementById(id).classList.remove('active'); localStorage.setItem('smoothieActiveView', 'none'); document.getElementById('statusBadge').classList.add('hidden'); }
function minimizeDrawer(id) { document.getElementById(id).classList.remove('active'); }
function restoreSession() { const v = localStorage.getItem('smoothieActiveView'); if(v && v !== 'none') document.getElementById(v).classList.add('active'); }
function launchApp(viewId, color, badgeText) { document.getElementById(viewId).classList.add('active'); localStorage.setItem('smoothieActiveView', viewId); showStatusBadge(badgeText, color); }
function showStatusBadge(text, color) { const b = document.getElementById('statusBadge'); b.innerText = text; b.className = `fixed top-4 left-4 z-[300] px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase shadow-xl backdrop-blur-md border border-${color}-500 text-${color}-500 animate-pulse bg-black`; b.classList.remove('hidden'); }
function copyBank() { const num = document.getElementById('dispAcctNum').innerText; navigator.clipboard.writeText(num).then(() => { const btn = document.getElementById('copyBankBtn'); const originalText = btn.innerText; btn.innerText = "COPIED!"; btn.classList.add('bg-green-600', 'text-white'); setTimeout(() => { btn.innerText = originalText; btn.classList.remove('bg-green-600', 'text-white'); }, 2000); }); }