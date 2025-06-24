document.addEventListener('DOMContentLoaded', () => {
    const daysContainer = document.getElementById('days-container');
    const resetProgressBtn = document.getElementById('resetProgressBtn');

    // Your study plan data (unchanged, but crucial for rendering)
    const studyPlan = [
        {
            day: "Day 1",
            emoji: "🧠",
            morning: [
                "Pair of Linear Equations – Part 1 video (1.5 hr)",
                "Note graph methods + substitution"
            ],
            evening: [
                "Pair of Linear Equations – Part 2 video (2 hr)",
                "Practice 2 word problems"
            ]
        },
        {
            day: "Day 2",
            emoji: "🧠",
            morning: [
                "Pair of Linear Equations – Quick Recap (1 hr)",
                "Practice set 1 (30 mins)"
            ],
            evening: [
                "Quadratic Equation – Part 1 video (1.25 hr)",
                "Note: factorization, formula method"
            ]
        },
        {
            day: "Day 3",
            emoji: "🧠",
            morning: [
                "Quadratic Equation – Part 2 video (1.25 hr)",
                "Practice 4 sums"
            ],
            evening: [
                "Quadratic Equation – Revise + Apply (2 hr)",
                "Solve 5 MCQs + 2 word problems"
            ]
        },
        {
            day: "Day 4",
            emoji: "🧠",
            morning: [
                "Arithmetic Progression – Part 1 (1.5 hr)",
                "nth term + sum concepts"
            ],
            evening: [
                "Arithmetic Progression – Part 2 (1.5 hr)",
                "Practice 4 questions + doubt list"
            ]
        },
        {
            day: "Day 5",
            emoji: "🧠",
            morning: [
                "Arithmetic Progression – Recap + Test (1.5 hr)",
                "Self-check quiz (5 Qs)"
            ],
            evening: [
                "Acid, Base and Salts – Full video (1.25 hr)",
                "Table of indicators + daily life examples"
            ]
        },
        {
            day: "Day 6",
            emoji: "🧠",
            morning: [
                "Control & Coordination – Full video (1.5 hr)",
                "Mind map of reflex arc, hormones"
            ],
            evening: [
                "Revise: All Science chapters (2 hr)",
                "Flashcards + past paper Qs"
            ]
        },
        {
            day: "Day 7 (Fatte Chak Day 💥)",
            emoji: "💥",
            morning: [
                "Revise: All Math chapters (1.5 hr)",
                "5 sums mixed type"
            ],
            evening: [
                "Doubt Solving + Mega Recap",
                "Chill with confidence 😎"
            ]
        }
    ];

    // --- Local Storage Functions ---

    // Function to load saved state from Local Storage
    const loadState = () => {
        const savedState = localStorage.getItem('studyPlanState');
        try {
            return savedState ? JSON.parse(savedState) : {};
        } catch (e) {
            console.error("Error parsing saved state from Local Storage:", e);
            return {}; // Return empty state on error
        }
    };

    // Function to save state to Local Storage
    const saveState = (state) => {
        try {
            localStorage.setItem('studyPlanState', JSON.stringify(state));
        } catch (e) {
            console.error("Error saving state to Local Storage:", e);
        }
    };

    // Get initial state or empty object
    let currentPlanState = loadState();

    // --- Rendering and Event Handling ---

    // Function to render the study plan
    const renderPlan = () => {
        daysContainer.innerHTML = ''; // Clear existing content

        studyPlan.forEach((dayData, dayIndex) => {
            const dayCard = document.createElement('div');
            dayCard.classList.add('day-card');
            dayCard.dataset.dayIndex = dayIndex; // Store day index for easy lookup

            const dayTitle = document.createElement('h2');
            dayTitle.innerHTML = `${dayData.emoji} ${dayData.day}`;
            dayCard.appendChild(dayTitle);

            // Render Morning Slot
            if (dayData.morning && dayData.morning.length > 0) {
                const morningSlot = document.createElement('div');
                morningSlot.classList.add('time-slot');
                morningSlot.innerHTML = '<h3>Morning</h3>';
                const morningList = document.createElement('ul');
                morningList.classList.add('task-list');

                dayData.morning.forEach(task => {
                    const taskItem = createTaskElement(dayIndex, task);
                    morningList.appendChild(taskItem);
                });
                morningSlot.appendChild(morningList);
                dayCard.appendChild(morningSlot);
            }

            // Render Evening Slot
            if (dayData.evening && dayData.evening.length > 0) {
                const eveningSlot = document.createElement('div');
                eveningSlot.classList.add('time-slot');
                eveningSlot.innerHTML = '<h3>Evening</h3>';
                const eveningList = document.createElement('ul');
                eveningList.classList.add('task-list');

                dayData.evening.forEach(task => {
                    const taskItem = createTaskElement(dayIndex, task);
                    eveningList.appendChild(taskItem);
                });
                eveningSlot.appendChild(eveningList);
                dayCard.appendChild(eveningSlot);
            }

            daysContainer.appendChild(dayCard);
            checkDayCompletion(dayCard, dayIndex); // Check completion status initially for each day
        });
    };

    // Helper function to create a task list item
    const createTaskElement = (dayIndex, taskText) => {
        const taskItem = document.createElement('li');
        taskItem.classList.add('task-item');

        // Create a unique ID for each task using dayIndex and base64 encoding of taskText
        // This ensures unique IDs even if task text repeats across days
        const taskId = `day-${dayIndex}-task-${btoa(taskText).replace(/=/g, '')}`; // Remove padding for cleaner ID

        const isChecked = currentPlanState[taskId] === true;

        taskItem.innerHTML = `
            <input type="checkbox" id="${taskId}" ${isChecked ? 'checked' : ''}>
            <span class="custom-checkbox"></span>
            <span class="task-text">${taskText}</span>
        `;

        const checkbox = taskItem.querySelector(`#${taskId}`);
        checkbox.addEventListener('change', (event) => {
            currentPlanState[taskId] = event.target.checked;
            saveState(currentPlanState); // Save state immediately on change

            // Find the parent day card and update its completion status
            const dayCard = event.target.closest('.day-card');
            if (dayCard) {
                const currentDayIndex = parseInt(dayCard.dataset.dayIndex);
                checkDayCompletion(dayCard, currentDayIndex);
            }
        });

        return taskItem;
    };

    // Function to check and update a day card's completion status
    const checkDayCompletion = (dayCardElement, dayIndex) => {
        // Get all checkbox elements within this specific dayCardElement
        const checkboxes = Array.from(dayCardElement.querySelectorAll('.task-item input[type="checkbox"]'));

        if (checkboxes.length === 0) {
            dayCardElement.classList.remove('completed'); // If no tasks, it's not completed
            return;
        }

        const allTasksCompleted = checkboxes.every(cb => cb.checked);

        if (allTasksCompleted) {
            dayCardElement.classList.add('completed');
        } else {
            dayCardElement.classList.remove('completed');
        }
    };

    // --- Event Listeners ---

    // Reset Progress Button
    resetProgressBtn.addEventListener('click', () => {
        if (confirm("Are you sure you want to reset all your progress? This cannot be undone.")) {
            localStorage.removeItem('studyPlanState'); // Clear all saved data
            currentPlanState = {}; // Reset current state in memory
            renderPlan(); // Re-render the plan from scratch
            alert("All progress has been reset!");
        }
    });


    // Initial render when the page loads
    renderPlan();
});
