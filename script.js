let currentViewDate = new Date();
let selectedDateKey = null;
let trackerData = JSON.parse(localStorage.getItem('multiMedTracker')) || {};

function initCalendar() {
    const month = currentViewDate.getMonth();
    const year = currentViewDate.getFullYear();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    document.getElementById('monthDisplay').innerText = `${monthNames[month]} ${year}`;
    const grid = document.getElementById('calendarGrid');
    grid.innerHTML = '';

    ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].forEach(d => {
        const div = document.createElement('div');
        div.className = 'day-name';
        div.innerText = d;
        grid.appendChild(div);
    });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) grid.appendChild(document.createElement('div'));

    for (let i = 1; i <= daysInMonth; i++) {
        const dateKey = `${year}-${month + 1}-${i}`;
        const dayEl = document.createElement('div');
        dayEl.className = 'day';
        dayEl.innerHTML = `<span>${i}</span>`;
        
        const iconsDiv = document.createElement('div');
        iconsDiv.className = 'icons-container';
        
        if (trackerData[dateKey]) {
            trackerData[dateKey].forEach(status => {
                const span = document.createElement('span');
                span.className = 'small-icon';
                if(status === 'taken') span.innerText = '✅';
                if(status === 'period') span.innerText = '🩸';
                if(status === 'missed') span.innerText = '❌';
                iconsDiv.appendChild(span);
            });
        }

        dayEl.appendChild(iconsDiv);
        dayEl.onclick = () => openModal(dateKey);
        grid.appendChild(dayEl);
    }
}

function openModal(dateKey) {
    selectedDateKey = dateKey;
    document.querySelectorAll('.opt-btn').forEach(btn => btn.classList.remove('selected'));
    
    if (trackerData[dateKey]) {
        trackerData[dateKey].forEach(status => {
            document.querySelector(`.btn-${status}`).classList.add('selected');
        });
    }
    
    document.getElementById('optionsModal').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

function toggleStatus(status) {
    if (!trackerData[selectedDateKey]) trackerData[selectedDateKey] = [];
    
    const index = trackerData[selectedDateKey].indexOf(status);
    if (index > -1) {
        trackerData[selectedDateKey].splice(index, 1);
        document.querySelector(`.btn-${status}`).classList.remove('selected');
    } else {
        // Agar 'taken' select kar rahe hain to 'missed' hata do aur vice-versa
        if(status === 'taken') {
            const mIndex = trackerData[selectedDateKey].indexOf('missed');
            if(mIndex > -1) trackerData[selectedDateKey].splice(mIndex, 1);
        }
        if(status === 'missed') {
            const tIndex = trackerData[selectedDateKey].indexOf('taken');
            if(tIndex > -1) trackerData[selectedDateKey].splice(tIndex, 1);
        }
        
        trackerData[selectedDateKey].push(status);
        openModal(selectedDateKey); // Refresh selected state in modal
    }
    
    localStorage.setItem('multiMedTracker', JSON.stringify(trackerData));
    initCalendar();
}

function closeModal() {
    document.getElementById('optionsModal').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

function changeMonth(dir) {
    currentViewDate.setMonth(currentViewDate.getMonth() + dir);
    initCalendar();
}

initCalendar();
