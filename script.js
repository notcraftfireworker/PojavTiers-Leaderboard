// 1. Points Table
const tierPoints = {
    "HT1": 60, "LT1": 50, "HT2": 40, "LT2": 35, "HT3": 25, 
    "LT3": 15, "HT4": 10, "LT4": 8, "HT5": 4, "LT5": 2, "None": 0
};

// 2. Player Data (Bas yahan player add karo, har tab mein apne aap dikhenge)
const playersData = [
    { 
        name: "ANKITCRAFTFIRE", 
        ranks: {
            NetheritePotion: "HT1", DiamondPotion: "LT1", Crystals: "HT2",
            Swords: "HT1", Axe: "LT2", UHC: "HT3", SMP: "HT2",
            Mace: "HT1", CartPvP: "None", DiamondSMP: "HT2"
        }
    },
    { 
        name: "Dream", 
        ranks: {
            NetheritePotion: "HT1", DiamondPotion: "HT1", Crystals: "HT1",
            Swords: "HT1", Axe: "HT1", UHC: "HT1", SMP: "HT1",
            Mace: "HT1", CartPvP: "HT1", DiamondSMP: "HT1"
        }
    },
    { 
        name: "Technoblade", 
        ranks: {
            NetheritePotion: "HT2", DiamondPotion: "LT1", Crystals: "HT1",
            Swords: "HT1", Axe: "HT1", UHC: "HT1", SMP: "HT1",
            Mace: "HT3", CartPvP: "HT1", DiamondSMP: "HT1"
        }
    }
];

let currentView = 'Overall';

// 3. Tab Switching Logic (SABSE IMPORTANT)
function switchTab(viewName) {
    console.log("Switching to:", viewName); // Console mein check karne ke liye
    currentView = viewName;

    // Buttons ka color change karne ke liye
    const allButtons = document.querySelectorAll('.tab-btn');
    allButtons.forEach(btn => {
        // Button ke text ko normalize karke match karna
        const btnText = btn.getAttribute('onclick').match(/'([^']+)'/)[1];
        if (btnText === viewName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    renderTiers(); // List ko refresh karein
}

// Grade calculation
function getGrade(totalPoints) {
    if (totalPoints >= 300) return { name: "Combat Grandmaster", class: "c-gm" };
    if (totalPoints >= 150) return { name: "Combat Master", class: "c-m" };
    if (totalPoints >= 90) return { name: "Combat Ace", class: "c-ace" };
    if (totalPoints >= 50) return { name: "Combat Novice", class: "c-novice" };
    return { name: "Unranked", class: "text-gray-500" };
}

function renderTiers() {
    const container = document.getElementById('tiers-container');
    container.innerHTML = '';

    if (currentView === 'Overall') {
        // OVERALL LEADERBOARD
        const processed = playersData.map(p => {
            let total = 0;
            for (let m in p.ranks) total += tierPoints[p.ranks[m]] || 0;
            return { ...p, totalPoints: total, grade: getGrade(total) };
        }).sort((a, b) => b.totalPoints - a.totalPoints);

        const groups = processed.reduce((acc, p) => {
            (acc[p.grade.name] = acc[p.grade.name] || []).push(p);
            return acc;
        }, {});

        ["Combat Grandmaster", "Combat Master", "Combat Ace", "Combat Novice", "Unranked"].forEach(g => {
            if (!groups[g]) return;
            let rows = groups[g].map((p, i) => `
                <div class="flex items-center justify-between p-5 hover:bg-white/5 transition cursor-pointer border-b border-gray-900/50" onclick="openSkinModal('${p.name}', '${p.totalPoints} PTS', '${g}', '${p.grade.class}')">
                    <div class="flex items-center space-x-6">
                        <span class="text-gray-800 font-bold w-6">#${i + 1}</span>
                        <img src="https://mc-heads.net/avatar/${p.name}/48" class="w-10 h-10 rounded shadow-md">
                        <span class="font-bold text-lg">${p.name}</span>
                    </div>
                    <div class="text-yellow-400 font-black">${p.totalPoints}</div>
                </div>`).join('');
            container.innerHTML += `<div class="tier-card"><div class="tier-header"><h2 class="${groups[g][0].grade.class} font-black uppercase italic">${g}</h2></div><div>${rows}</div></div>`;
        });

    } else {
        // SPECIFIC GAMEMODE LEADERBOARD
        const sorted = [...playersData]
            .filter(p => p.ranks[currentView] && p.ranks[currentView] !== "None")
            .sort((a, b) => (tierPoints[b.ranks[currentView]] || 0) - (tierPoints[a.ranks[currentView]] || 0));

        if (sorted.length === 0) {
            container.innerHTML = `<p class="text-center text-gray-600 mt-10 font-bold uppercase tracking-widest">No players ranked in ${currentView}</p>`;
            return;
        }

        let rows = sorted.map((p, i) => `
            <div class="flex items-center justify-between p-5 hover:bg-white/5 transition cursor-pointer border-b border-gray-900/50" onclick="openSkinModal('${p.name}', '${p.ranks[currentView]}', '${currentView}', 'text-white')">
                <div class="flex items-center space-x-6">
                    <span class="text-gray-800 font-bold w-6">#${i + 1}</span>
                    <img src="https://mc-heads.net/avatar/${p.name}/48" class="w-10 h-10 rounded">
                    <span class="font-bold text-lg">${p.name}</span>
                </div>
                <div class="text-red-500 font-black text-xl italic">${p.ranks[currentView]}</div>
            </div>`).join('');

        container.innerHTML = `<div class="tier-card"><div class="tier-header"><h2 class="text-white font-black uppercase italic">${currentView} Ranking</h2></div><div>${rows}</div></div>`;
    }
}

// 4. Modal & Skin Logic (Baki code same)
let skinViewer;
async function openSkinModal(name, pts, tier, tClass) {
    document.getElementById('skinModal').style.display = 'flex';
    document.getElementById('modalName').innerText = name;
    document.getElementById('modalPts').innerText = pts;
    const badge = document.getElementById('modalTierBadge');
    badge.innerText = tier;
    badge.className = `${tClass} bg-black/50 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest mt-2 inline-block`;
    const canvasDiv = document.getElementById('skinCanvasContainer');
    canvasDiv.innerHTML = `<img src="https://mc-heads.net/body/${name}" class="h-full object-contain">`;
    try {
        skinViewer = new skinview3d.SkinViewer({ width: 280, height: 380 });
        await skinViewer.loadSkin(`https://mc-heads.net/skin/${name}`, { model: "auto-detect" });
        canvasDiv.innerHTML = ''; 
        canvasDiv.appendChild(skinViewer.canvas);
        skinViewer.autoRotate = true;
        skinViewer.animations.add(skinview3d.WalkingAnimation);
    } catch (e) { console.log("3D viewer blocked/failed"); }
}

function closeSkinModal() {
    document.getElementById('skinModal').style.display = 'none';
    if(skinViewer) { skinViewer.dispose(); skinViewer = null; }
}

window.onload = renderTiers;