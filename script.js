let skinViewer = null;
let currentView = 'Overall';

const tierPoints = {
    "HT1": 60, "LT1": 50, "HT2": 40, "LT2": 35, "HT3": 25, 
    "LT3": 15, "HT4": 10, "LT4": 8, "HT5": 4, "LT5": 2, "None": 0
};

const playersData = [
    { name: "ANKITCRAFTFIRE", region: "AS", ranks: { NetheritePotion: "HT4", DiamondPotion: "LT4", Crystals: "HT4", Swords: "LT4", Axe: "LT4", UHC: "HT4", SMP: "LT4", Mace: "HT5", CartPvP: "LT4", DiamondSMP: "LT4" } },
    { name: "Matrix_legit", region: "AS", ranks: { NetheritePotion: "HT3", DiamondPotion: "LT3", Crystals: "None", Swords: "HT4", Axe: "HT4", UHC: "LT3", SMP: "LT3", Mace: "None", CartPvP: "HT4", DiamondSMP: "LT3" } },
    { name: "icykrish_", region: "AS", ranks: { NetheritePotion: "HT4", DiamondPotion: "None", Crystals: "LT4", Swords: "HT4", Axe: "None", UHC: "None", SMP: "LT3", Mace: "HT3", CartPvP: "None", DiamondSMP: "None" } },
    { name: "MR_ZEX_444", region: "AS", ranks: { NetheritePotion: "None", DiamondPotion: "None", Crystals: "LT3", Swords: "None", Axe: "None", UHC: "None", SMP: "None", Mace: "None", CartPvP: "None", DiamondSMP: "None" } },
    { name: "DEVIL_PLAYS2010", region: "AS", ranks: { NetheritePotion: "LT3", DiamondPotion: "LT3", Crystals: "LT3", Swords: "HT4", Axe: "LT3", UHC: "HT4", SMP: "HT3", Mace: "LT4", CartPvP: "None", DiamondSMP: "HT3" } },
    { name: "KinciiV2", region: "AS", ranks: { NetheritePotion: "None", DiamondPotion: "None", Crystals: "LT4", Swords: "None", Axe: "None", UHC: "None", SMP: "None", Mace: "None", CartPvP: "None", DiamondSMP: "None" } },
    { name: "ibann1", region: "AS", ranks: { NetheritePotion: "None", DiamondPotion: "None", Crystals: "LT3", Swords: "None", Axe: "None", UHC: "None", SMP: "None", Mace: "None", CartPvP: "None", DiamondSMP: "None" } },
    { name: "FrostyGirl", region: "AS", ranks: { NetheritePotion: "None", DiamondPotion: "None", Crystals: "HT4", Swords: "None", Axe: "None", UHC: "None", SMP: "None", Mace: "None", CartPvP: "None", DiamondSMP: "None" } },
    { name: "ItsFiqq", region: "AS", ranks: { NetheritePotion: "None", DiamondPotion: "None", Crystals: "LT3", Swords: "None", Axe: "None", UHC: "None", SMP: "None", Mace: "None", CartPvP: "None", DiamondSMP: "None" } }
];

function switchTab(view) {
    currentView = view;
    document.querySelectorAll('.tab-btn').forEach(btn => {
        const onclickAttr = btn.getAttribute('onclick');
        btn.classList.toggle('active', onclickAttr.includes(`'${view}'`));
    });
    renderTiers();
}

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
    let globalRank = 1;

    if (currentView === 'Overall') {
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
            let rows = groups[g].map(p => {
                const r = globalRank++;
                return `<div class="flex items-center justify-between p-5 hover:bg-white/5 transition cursor-pointer border-b border-gray-900/40" onclick="openSkinModal('${p.name}', '${p.totalPoints} PTS', '${g}', '${p.grade.class}')">
                    <div class="flex items-center space-x-6">
                        <span class="text-gray-700 font-black w-8">#${r}</span>
                        <img src="https://mc-heads.net/avatar/${p.name}/48" class="w-10 h-10 rounded shadow-lg">
                        <div class="flex flex-col">
                            <span class="font-bold text-lg text-white leading-none">${p.name}</span>
                            <span class="text-[9px] font-black text-gray-600 uppercase mt-1 tracking-widest">${p.region}</span>
                        </div>
                    </div>
                    <div class="text-yellow-400 font-black font-mono text-lg">${p.totalPoints}</div>
                </div>`;
            }).join('');
            container.innerHTML += `<div class="tier-card mb-8"><div class="tier-header"><h2 class="${groups[g][0].grade.class} font-black uppercase italic tracking-tighter text-xs">${g}</h2></div><div class="divide-y divide-gray-900/20">${rows}</div></div>`;
        });
    } else {
        const sorted = [...playersData].filter(p => p.ranks[currentView] && p.ranks[currentView] !== "None")
            .sort((a, b) => (tierPoints[b.ranks[currentView]] || 0) - (tierPoints[a.ranks[currentView]] || 0));

        let rows = sorted.map((p, i) => `<div class="flex items-center justify-between p-5 hover:bg-white/5 transition cursor-pointer border-b border-gray-900/40" onclick="openSkinModal('${p.name}', '${p.ranks[currentView]}', '${currentView}', 'text-white')">
            <div class="flex items-center space-x-6">
                <span class="text-gray-700 font-black w-8">#${i + 1}</span>
                <img src="https://mc-heads.net/avatar/${p.name}/48" class="w-10 h-10 rounded shadow-lg">
                <div class="flex flex-col">
                    <span class="font-bold text-lg text-white leading-none">${p.name}</span>
                    <span class="text-[9px] font-black text-gray-600 uppercase mt-1 tracking-widest">${p.region}</span>
                </div>
            </div>
            <div class="text-red-500 font-black text-xl italic">${p.ranks[currentView]}</div>
        </div>`).join('');
        container.innerHTML = `<div class="tier-card"><div class="tier-header"><h2 class="text-white font-black uppercase italic text-xs tracking-widest">${currentView} Ranking</h2></div><div>${rows}</div></div>`;
    }
}

function filterPlayers() {
    const query = document.getElementById('playerSearch').value.toLowerCase();
    const rows = document.querySelectorAll('.tier-card div[onclick]');
    rows.forEach(row => {
        const name = row.querySelector('span.font-bold').innerText.toLowerCase();
        row.style.display = name.includes(query) ? "flex" : "none";
    });
    document.querySelectorAll('.tier-card').forEach(section => {
        const hasVisible = Array.from(section.querySelectorAll('div[onclick]')).some(r => r.style.display !== "none");
        section.style.display = hasVisible ? "block" : "none";
    });
}

async function openSkinModal(name, pts, tier, tClass) {
    const player = playersData.find(p => p.name === name);
    document.getElementById('skinModal').style.display = 'flex';
    document.getElementById('modalName').innerText = name;
    document.getElementById('modalRegion').innerText = player ? `REGION: ${player.region}` : 'REGION: UNKNOWN';
    document.getElementById('modalPts').innerText = pts;
    const badge = document.getElementById('modalTierBadge');
    badge.innerText = tier;
    badge.className = `${tClass} bg-black/50 px-4 py-2 rounded-lg text-xs font-black uppercase mt-2 inline-block border border-white/5`;
    const canvasDiv = document.getElementById('skinCanvasContainer');
    canvasDiv.innerHTML = '';
    try {
        if (skinViewer) skinViewer.dispose();
        skinViewer = new skinview3d.SkinViewer({ width: 280, height: 380 });
        canvasDiv.appendChild(skinViewer.canvas);
        await skinViewer.loadSkin(`https://mc-heads.net/skin/${name}`);
        skinViewer.autoRotate = true;
        skinViewer.animations.add(skinview3d.WalkingAnimation);
    } catch (e) {
        canvasDiv.innerHTML = `<img src="https://mc-heads.net/body/${name}" class="h-full object-contain">`;
    }
}

function closeSkinModal() {
    document.getElementById('skinModal').style.display = 'none';
    if(skinViewer) skinViewer.dispose();
}

window.onload = renderTiers;
