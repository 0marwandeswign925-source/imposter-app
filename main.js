// main.js - لإدارة قائمة اللاعبين وبدء اللعبة

const playersList = document.getElementById('players-list');
const addPlayerCard = document.getElementById('add-player-card');
const startButton = document.querySelector('.start-button'); // زر 'يلا بينا'

// عناصر المودال
const modal = document.getElementById('custom-modal');
const newPlayerInput = document.getElementById('new-player-input');
const modalCancel = document.getElementById('modal-cancel');
const modalOk = document.getElementById('modal-ok');

// الحد الأدنى المطلوب للبدء
const REQUIRED_PLAYERS = 3;

// جلب اللاعبين من localStorage
let players = JSON.parse(localStorage.getItem('players')) || [];

// تنظيف القائمة من أي تكرارات سابقة عند التحميل
players = Array.from(new Set(players));


// ==================== وظائف مساعدة ====================

// توليد لون عشوائي لكل لاعب
function getRandomColor() {
    // تم اختيار مجموعة أحرف لتوليد ألوان أفتح/أكثر وضوحاً
    const letters = '0123789ABCDEF'; 
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
}

// تفعيل زر البداية لو فيه 3 لاعبين أو أكثر
function checkStartButton() {
    if (!startButton) return; 
    
    const isReady = players.length >= REQUIRED_PLAYERS;
    
    startButton.disabled = !isReady;
    startButton.style.opacity = isReady ? '1' : '0.5';
    // تحديث نص الزر حسب الحالة
    startButton.textContent = isReady ? 'يلا بينا!' : `يتطلب ${REQUIRED_PLAYERS} لاعبين على الأقل`;
}

// ==================== تحديث وعرض اللاعبين ====================

function renderPlayers() {
    // إزالة كل الكروت القديمة باستثناء كارت الإضافة
    playersList.querySelectorAll('.player-card').forEach(card => card.remove());
    
    // إنشاء كروت جديدة
    players.forEach(playerName => {
        const card = document.createElement('div');
        card.classList.add('player-card');
        card.setAttribute('data-name', playerName); 
        card.style.setProperty('--card-color', getRandomColor());
        
        card.innerHTML = `
            <div class="avatar">
                <span class="initial">${playerName.trim().charAt(0).toUpperCase()}</span>
            </div>
            <span class="name">${playerName}</span>
            <button type="button" class="delete-button">&times;</button>
        `;
        
        playersList.insertBefore(card, addPlayerCard);
    });
    
    checkStartButton();
}

// ==================== وظائف المودال (الإضافة) ====================

// فتح المودال عند الضغط على +
addPlayerCard.querySelector('.add-button').addEventListener('click', () => {
    newPlayerInput.value = '';
    modal.style.display = 'flex';
    newPlayerInput.focus();
});

// الغاء المودال
modalCancel.addEventListener('click', () => {
    modal.style.display = 'none';
});

// إضافة لاعب جديد (منع التكرار)
modalOk.addEventListener('click', () => {
    const playerName = newPlayerInput.value.trim();
    
    // 1. فحص الاسم الفارغ
    if (playerName === '') return;
    
    // 2. فحص تكرار الاسم (بدون الحساسية لحالة الأحرف)
    if (players.map(p => p.toLowerCase()).includes(playerName.toLowerCase())) {
        alert('هذا اللاعب موجود بالفعل في القائمة!');
        newPlayerInput.value = ''; // إفراغ الحقل ليسهل الكتابة مجددًا
        return;
    }
    
    // إضافة وحفظ
    players.push(playerName);
    localStorage.setItem('players', JSON.stringify(players));
    
    renderPlayers();
    modal.style.display = 'none';
});

// ==================== وظائف الحذف والتحكم ====================

// حذف لاعب
playersList.addEventListener('click', function(e) {
    if (e.target.classList.contains('delete-button')) {
        const card = e.target.closest('.player-card');
        const nameToDelete = card.getAttribute('data-name');
        
        // الحذف بالفلترة
        players = players.filter(p => p !== nameToDelete);
        localStorage.setItem('players', JSON.stringify(players));
        
        renderPlayers();
    }
});

// زر "يلا بينا" يفتح صفحة اللعبة
startButton.addEventListener('click', () => {
    if (players.length >= REQUIRED_PLAYERS) {
        // **الخطوة الأهم:** تأكيد إفراغ متغيرات الجولة السابقة (لضمان جولة جديدة)
        localStorage.removeItem('assignedRoles');
        localStorage.removeItem('sharedSecretWord');
        localStorage.removeItem('currentPlayerIndex');

        // الانتقال إلى صفحة اللعبة
        window.location.href = 'page4.html';
    }
});

// ==================== البدء ====================

// عرض أولي عند تحميل الصفحة
renderPlayers();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(() => console.log("SW Registered"))
    .catch(err => console.log("SW Error:", err));
}
function startGame() {
    // مسح جميع بيانات اللعبة السابقة
    localStorage.clear(); 
    
    // وضع قيمة افتراضية للأسماء والمؤشرات لضمان بداية نظيفة
    localStorage.setItem("players", "[]");
    localStorage.setItem("votes", "[]");
    localStorage.setItem("allVotes", "[]");
    localStorage.setItem("voteIndex", "0");
    localStorage.setItem("suspectIndex", "0"); 
    
    window.location.href = "players.html";
}


