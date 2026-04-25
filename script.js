let currentView = 'Overall';

const tierPoints = {
    "HT1": 60, "LT1": 50, "HT2": 40, "LT2": 35, "HT3": 25, 
    "LT3": 15, "HT4": 10, "LT4": 8, "HT5": 4, "LT5": 2, "None": 0
};

// Players Data (Wahi jo tune di thi)
const playersData = [
    { name: "ANKITCRAFTFIRE", region: "AS", ranks: { NetheritePotion: "HT4", DiamondPotion: "LT4", Crystals: "HT4", Swords: "LT4", Axe: "LT4", UHC: "HT4", SMP: "LT4", Mace: "HT5", CartPvP: "LT4", DiamondSMP: "LT4" } },
    { name: "Matrix_legit", region: "AS", ranks: { NetheritePotion: "HT3", DiamondPotion: "LT3", Crystals: "HT5", Swords: "HT4", Axe: "HT4", UHC: "LT3", SMP: "LT3", Mace: "None", CartPvP: "HT4", DiamondSMP: "LT3" } },
    { name: "icykrish_", region: "AS", ranks: { NetheritePotion: "HT4", DiamondPotion: "None", Crystals: "LT4", Swords: "HT4", Axe: "None", UHC: "None", SMP: "LT3", Mace: "HT3", CartPvP: "None", DiamondSMP: "None" } },
{ name: "ibann1", region: "AS", ranks: { NetheritePotion: "None", DiamondPotion: "None", Crystals: "LT3", Swords: "None", Axe: "None", UHC: "None", SMP: "None", Mace: "None", CartPvP: "None", DiamondSMP: "None" } },
 { name: "FrostyGirl", region: "AS", ranks: { NetheritePotion: "None", DiamondPotion: "None", Crystals: "HT4", Swords: "None", Axe: "None", UHC: "None", SMP: "None", Mace: "None", CartPvP: "None", DiamondSMP: "None" } },
{ name: "CompyYT", region: "AS", ranks: { NetheritePotion: "None", DiamondPotion: "None", Crystals: "LT4", Swords: "None", Axe: "None", UHC: "None", SMP: "None", Mace: "None", CartPvP: "None", DiamondSMP: "None" } },
{ name: "LuciferKing001", region: "AS", ranks: { NetheritePotion: "None", DiamondPotion: "None", Crystals: "HT4", Swords: "None", Axe: "None", UHC: "None", SMP: "None", Mace: "None", CartPvP: "None", DiamondSMP: "None" } },
    { name: "Gamerz_ajay", region: "AS", ranks: { NetheritePotion: "None", DiamondPotion: "None", Crystals: "HT4", Swords: "None", Axe: "None", UHC: "None", SMP: "None", Mace: "None", CartPvP: "None", DiamondSMP: "None" } },
    { name: "ItsFiqq", region: "AS", ranks: { NetheritePotion: "None", DiamondPotion: "None", Crystals: "LT3", Swords: "None", Axe: "None", UHC: "None", SMP: "None", Mace: "None", CartPvP: "None", DiamondSMP: "None" } },
    { name: "MR_ZEX_444", region: "AS", ranks: { NetheritePotion: "None", DiamondPotion: "None", Crystals: "LT3", Swords: "None", Axe: "None", UHC: "None", SMP: "None", Mace: "None", CartPvP: "None", DiamondSMP: "None" } },
    { name: "DEVIL_PLAYS2010", region: "AS", ranks: { NetheritePotion: "LT3", DiamondPotion: "LT3", Crystals: "HT3", Swords: "HT3", Axe: "LT3", UHC: "HT4", SMP: "HT3", Mace: "LT4", CartPvP: "None", DiamondSMP: "HT3" } },
    { name: "KinciiV2", region: "AS", ranks: { NetheritePotion: "None", DiamondPotion: "None", Crystals: "LT4", Swords: "None", Axe: "None", UHC: "None", SMP: "None", Mace: "None", CartPvP: "None", DiamondSMP: "None" } },
    { name: "CurzClaps", region: "AS", ranks: { NetheritePotion: "LT2", DiamondPotion: "None", Crystals: "None", Swords: "LT2", Axe: "HT3", UHC: "None", SMP: "None", Mace: "None", CartPvP: "None", DiamondSMP: "None" } }
];

function switchTab(view) {
    currentView = view;
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('onclick').includes(`'${view}'`));
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
                // Rank Special Rows logic (Purani wahi rakhi hai)
                let rankClass = r === 1 ? 'rank-gold shine-row' : r === 2 ? 'rank-silver shine-row' : r === 3 ? 'rank-bronze shine-row' : '';
                let rankNumColor = r === 1 ? 'text-[#ffd700]' : r === 2 ? 'text-[#c0c0c0]' : r === 3 ? 'text-[#cd7f32]' : 'text-gray-700';

                return `<div class="flex items-center justify-between p-5 hover:bg-white/5 transition cursor-pointer border-b border-gray-900/40 ${rankClass}" onclick="openSkinModal('${p.name}', '${p.totalPoints} PTS', '${g}', '${p.grade.class}')">
                    <div class="flex items-center space-x-6">
                        <span class="${rankNumColor} font-black w-8">#${r}</span>
                        <img src="https://mc-heads.net/avatar/${p.name}/48" class="w-10 h-10 rounded shadow-lg">
                        <div class="flex flex-col">
                            <span class="font-bold text-lg text-white leading-none">${p.name}</span>
                            <span class="text-[9px] font-black text-gray-600 uppercase mt-1 tracking-widest">${p.region}</span>
                        </div>
                    </div>
                    <div class="text-yellow-400 font-black font-mono text-lg">${p.totalPoints}</div>
                </div>`;
            }).join('');
            container.innerHTML += `<div class="tier-card mb-8"><div class="tier-header"><h2 class="${groups[g][0].grade.class} font-black uppercase italic tracking-tighter text-xs">${g}</h2></div><div>${rows}</div></div>`;
        });
    } else {
        const sorted = [...playersData].filter(p => p.ranks[currentView] && p.ranks[currentView] !== "None")
            .sort((a, b) => (tierPoints[b.ranks[currentView]] || 0) - (tierPoints[a.ranks[currentView]] || 0));

        let rows = sorted.map((p, i) => {
            const r = i + 1;
            const tierValue = p.ranks[currentView];
            // HT/LT Color logic (Purani wahi rakhi hai)
            const tierColor = tierValue.startsWith('HT') ? 'text-red-500' : 'text-blue-400';
            let rankClass = r === 1 ? 'rank-gold shine-row' : r === 2 ? 'rank-silver shine-row' : r === 3 ? 'rank-bronze shine-row' : '';
            const rankNumColor = r === 1 ? 'text-[#ffd700]' : r === 2 ? 'text-[#c0c0c0]' : r === 3 ? 'text-[#cd7f32]' : 'text-gray-700';

            return `<div class="flex items-center justify-between p-5 hover:bg-white/5 transition cursor-pointer border-b border-gray-900/40 ${rankClass}" onclick="openSkinModal('${p.name}', '${tierValue}', '${currentView}', '${tierColor}')">
                <div class="flex items-center space-x-6">
                    <span class="${rankNumColor} font-black w-8">#${r}</span>
                    <img src="https://mc-heads.net/avatar/${p.name}/48" class="w-10 h-10 rounded shadow-lg">
                    <div class="flex flex-col">
                        <span class="font-bold text-lg text-white leading-none">${p.name}</span>
                        <span class="text-[9px] font-black text-gray-600 uppercase mt-1 tracking-widest">${p.region}</span>
                    </div>
                </div>
                <div class="${tierColor} font-black text-xl italic">${tierValue}</div>
            </div>`;
        }).join('');
        container.innerHTML = `<div class="tier-card"><div class="tier-header"><h2 class="text-white font-black uppercase italic text-xs tracking-widest">${currentView} Ranking</h2></div><div>${rows}</div></div>`;
    }
}

function filterPlayers() {
    const query = document.getElementById('playerSearch').value.toLowerCase();
    document.querySelectorAll('.tier-card div[onclick]').forEach(row => {
        const name = row.querySelector('span.font-bold').innerText.toLowerCase();
        row.style.display = name.includes(query) ? "flex" : "none";
    });
}

// Updated Modal function to load Circle Avatar
function openSkinModal(name, pts, tier, tClass) {
    const player = playersData.find(p => p.name === name);
    const modal = document.getElementById('skinModal');
    
    document.getElementById('modalName').innerText = name;
    document.getElementById('modalRegion').innerText = player ? `REGION: ${player.region}` : 'REGION: AS';
    document.getElementById('modalPts').innerText = pts;
    
    const badge = document.getElementById('modalTierBadge');
    badge.innerText = tier;
    badge.className = `${tClass} bg-black/50 px-4 py-2 rounded-lg text-xs font-black uppercase mt-2 inline-block border border-white/5`;
    
    // Set Big Circle Avatar from mc-heads.net
    const avatarImg = document.getElementById('modalAvatar');
    avatarImg.src = `https://mc-heads.net/avatar/${name}/128`; // High-res face
    
    modal.style.display = 'flex';
}

function closeSkinModal() { 
    document.getElementById('skinModal').style.display = 'none'; 
}

window.onload = renderTiers;
