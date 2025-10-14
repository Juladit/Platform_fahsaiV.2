document.addEventListener('DOMContentLoaded', function() {
    const grid = document.getElementById('calendarGrid');
    const title = document.getElementById('calendarTitle');
    const prevBtn = document.getElementById('prevMonth');
    const nextBtn = document.getElementById('nextMonth');

    // Allow deep link via ?date=YYYY-MM-DD
    const params = new URLSearchParams(window.location.search);
    const requested = params.get('date');
    let current = requested ? new Date(requested) : new Date();
    current.setDate(1);
    let highlightDate = requested || null;

    const events = [
        { date: '2025-10-13', title: 'Annual Basketball...', type: 'registered' },
        { date: '2025-10-11', title: 'Archery activity', type: 'registered' },
        { date: '2025-10-11', title: 'Football Tournament', type: 'open' },
        { date: '2025-10-10', title: 'Archery activity first...', type: 'completed' }
    ];

    function formatYearMonth(d) {
        return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    }

    function getEventsByDate(ymd) {
        return events.filter(e => e.date === ymd);
    }

    function render() {
        const month = current.getMonth();
        const year = current.getFullYear();
        title.textContent = `${current.toLocaleString('default', { month: 'long' })} ${year}`;

        // Remove previous days (keep weekday headers: 7 items)
        [...grid.querySelectorAll('.day')].forEach(n => n.remove());

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startWeekday = (firstDay.getDay() + 6) % 7; // make Monday=0
        const totalDays = lastDay.getDate();

        // Previous month tail
        const prevLast = new Date(year, month, 0).getDate();
        for (let i = startWeekday - 1; i >= 0; i--) {
            const dayNum = prevLast - i;
            const cell = createDayCell(year, month - 1, dayNum, true);
            grid.appendChild(cell);
        }

        // Current month days
        for (let d = 1; d <= totalDays; d++) {
            const cell = createDayCell(year, month, d, false);
            grid.appendChild(cell);
        }

        // Next month head to fill complete weeks
        const cellsNow = grid.querySelectorAll('.day').length;
        const remainder = cellsNow % 7;
        if (remainder !== 0) {
            const toAdd = 7 - remainder;
            for (let d = 1; d <= toAdd; d++) {
                const cell = createDayCell(year, month + 1, d, true);
                grid.appendChild(cell);
            }
        }
    }

    function createDayCell(year, month, day, outside) {
        const cell = document.createElement('div');
        cell.className = 'day' + (outside ? ' outside' : '');

        const dateObj = new Date(year, month, day);
        const ymd = `${dateObj.getFullYear()}-${String(dateObj.getMonth()+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;

        const number = document.createElement('div');
        number.className = 'day-number';
        number.textContent = String(day);
        cell.appendChild(number);

        // Mark today
        const today = new Date();
        if (!outside && dateObj.toDateString() === today.toDateString()) {
            cell.classList.add('today');
        }

        // Highlight if matches requested date
        if (highlightDate) {
            if (!outside && `${dateObj.getFullYear()}-${String(dateObj.getMonth()+1).padStart(2,'0')}-${String(day).padStart(2,'0')}` === highlightDate) {
                cell.classList.add('highlight');
                // Scroll into view after render
                setTimeout(() => cell.scrollIntoView({ behavior: 'smooth', block: 'center' }), 0);
            }
        }

        // Events
        const items = getEventsByDate(ymd);
        items.forEach(evt => {
            const badge = document.createElement('span');
            badge.className = `event ${evt.type}`;
            badge.title = evt.title;
            badge.textContent = evt.title;
            cell.appendChild(badge);
        });

        cell.addEventListener('click', () => {
            alert(`${ymd}\n\n${items.length ? items.map(e=>`• ${e.title}`).join('\n') : 'No events'}`);
        });

        return cell;
    }

    prevBtn.addEventListener('click', () => {
        current.setMonth(current.getMonth() - 1);
        render();
    });

    nextBtn.addEventListener('click', () => {
        current.setMonth(current.getMonth() + 1);
        render();
    });

    render();
});
