document.addEventListener('DOMContentLoaded', () => {
    // --- Data Definition ---
    const studyPlan = [
        {
            day: 1,
            title: "Day 1",
            subTitle: "(आज का Target 💥)",
            sections: [
                {
                    time: "Morning (10–11:30 AM)",
                    tasks: [
                        "Quadratic Equation – Video Part 1",
                        "Notes bana, key formulae likh"
                    ]
                },
                {
                    time: "Evening (5–7 PM)",
                    tasks: [
                        "Quadratic Equation – Video Part 2",
                        "Quick 30 min recap",
                        "3 Questions practice"
                    ]
                }
            ]
        },
        {
            day: 2,
            title: "Day 2",
            sections: [
                {
                    time: "Morning",
                    tasks: [
                        "Pair of Linear Equations – Video Part 1",
                        "Graph method note karna mat bhoolna"
                    ]
                },
                {
                    time: "Evening",
                    tasks: [
                        "Pair of Linear Equations – Video Part 2",
                        "3 word problems try kar"
                    ]
                }
            ]
        },
        {
            day: 3,
            title: "Day 3",
            sections: [
                {
                    time: "Morning",
                    tasks: [
                        "Pair of Linear Equations – Revision",
                        "Formulas flashcards banale"
                    ]
                },
                {
                    time: "Evening",
                    tasks: [
                        "Arithmetic Progression – Video Part 1",
                        "Focus: nth term, sum formula"
                    ]
                }
            ]
        },
        {
            day: 4,
            title: "Day 4",
            sections: [
                {
                    time: "Morning",
                    tasks: [
                        "Arithmetic Progression – Part 2",
                        "Doubts clear + 3 sums practice"
                    ]
                },
                {
                    time: "Evening",
                    tasks: [
                        "Control & Coordination – Full video",
                        "Mind map bana le: hormones, reflex, neurons"
                    ]
                }
            ]
        },
        {
            day: 5,
            title: "Day 5",
            sections: [
                {
                    time: "Morning",
                    tasks: [
                        "Acid, Base and Salts – Full",
                        "Indicators table yaad rakh!"
                    ]
                },
                {
                    time: "Evening",
                    tasks: [
                        "Sci Chapter 1 & 2 – Quick Recap",
                        "5 PYQs solve kar lena"
                    ]
                }
            ]
        },
        {
            day: 6,
            title: "Day 6",
            sections: [
                {
                    time: "Morning",
                    tasks: [
                        "Math Chapter 1 & 2 Revision",
                        "Key concepts & mistakes jot down"
                    ]
                },
                {
                    time: "Evening",
                    tasks: [
                        "Mix Practice Sheet: 5 questions each",
                        "Weak areas ko highlight karna"
                    ]
                }
            ]
        },
        {
            day: 7,
            title: "Day 7",
            subTitle: "(Victory Day 🏆)",
            sections: [
                {
                    time: "Morning",
                    tasks: [
                        "Mega Recap – Flashcards + Mind Maps",
                        "20 min chill test (MCQs only)"
                    ]
                },
                {
                    time: "Evening",
                    tasks: [
                        "Solve doubts",
                        "Chill + Motivation session (your fav YouTuber)"
                    ]
                }
            ]
        }
    ];

    let taskStates = {}; // Stores the completion state for all tasks

    // --- DOM Elements ---
    const daysContainer = document.querySelector('.days-container');
    const overallProgressBar = document.getElementById('overall-progress-bar');
    const overallProgressText = document.getElementById('overall-progress-text');
    const resetAllBtn = document.getElementById('reset-all-btn');
    const toastContainer = document.getElementById('toast-container');

    // --- Utility Functions ---

    /**
     * Displays a toast notification.
     * @param {string} message - The message to display.
     * @param {number} duration - How long the toast should be visible in milliseconds.
     */
    const showToast = (message, duration = 3000) => {
        const toast = document.createElement('div');
        toast.classList.add('toast');
        toast.textContent = message;
        toastContainer.appendChild(toast);

        // Animate in
        setTimeout(() => toast.style.opacity = '1', 10);
        toast.style.transform = 'translateX(0)';

        // Animate out and remove
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            toast.addEventListener('transitionend', () => toast.remove());
        }, duration);
    };

    /**
     * Triggers a confetti animation.
     */
    const triggerConfetti = () => {
        const confettiSettings = { target: 'confetti-canvas', max: 100, size: 1.2, clock: 25, props: ['circle', 'square', 'triangle', 'line'], colors: [[165,104,246],[230,61,135],[0,199,228],[253,214,126]], width: window.innerWidth, height: window.innerHeight };
        const confetti = new ConfettiGenerator(confettiSettings);
        confetti.render();
        setTimeout(() => confetti.clear(), 3000); // Clear confetti after 3 seconds
    };

    /**
     * Saves the current task states to Local Storage.
     */
    const saveTaskStates = () => {
        localStorage.setItem('studyTrackerTaskStates', JSON.stringify(taskStates));
        // showToast('Progress saved!'); // Optional: Too many toasts if saving on every click
    };

    /**
     * Loads task states from Local Storage.
     */
    const loadTaskStates = () => {
        const savedStates = localStorage.getItem('studyTrackerTaskStates');
        if (savedStates) {
            taskStates = JSON.parse(savedStates);
        } else {
            // Initialize taskStates if nothing is saved yet
            studyPlan.forEach(dayData => {
                taskStates[dayData.day] = {};
                dayData.sections.forEach(section => {
                    section.tasks.forEach((task, taskIdx) => {
                        if (!taskStates[dayData.day][section.time]) {
                            taskStates[dayData.day][section.time] = {};
                        }
                        taskStates[dayData.day][section.time][taskIdx] = false; // Default to not completed
                    });
                });
            });
            saveTaskStates(); // Save the initial empty state
        }
    };

    /**
     * Updates the progress bar for a specific day.
     * @param {number} dayNum - The day number.
     */
    const updateDayProgress = (dayNum) => {
        const dayCard = document.getElementById(`day-${dayNum}`);
        if (!dayCard) return;

        const dayProgressBar = dayCard.querySelector('.day-progress-bar');
        const dayStatusEmoji = dayCard.querySelector('.status-emoji');

        let completedTasks = 0;
        let totalTasks = 0;

        const dayState = taskStates[dayNum];
        if (dayState) {
            for (const time in dayState) {
                for (const taskIdx in dayState[time]) {
                    totalTasks++;
                    if (dayState[time][taskIdx]) {
                        completedTasks++;
                    }
                }
            }
        }

        const percentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
        dayProgressBar.style.width = `${percentage}%`;

        if (percentage === 100 && totalTasks > 0) {
            dayCard.classList.add('day-completed');
            dayStatusEmoji.textContent = '🎉';
            dayStatusEmoji.style.opacity = '1';
            // Only trigger confetti if it just became 100%
            if (!dayCard.dataset.confettiTriggered || dayCard.dataset.confettiTriggered === 'false') {
                 triggerConfetti();
                 dayCard.dataset.confettiTriggered = 'true';
            }
        } else {
            dayCard.classList.remove('day-completed');
            dayStatusEmoji.textContent = '';
            dayStatusEmoji.style.opacity = '0';
            dayCard.dataset.confettiTriggered = 'false';
        }

        // Update the "Mark Day as Complete" button state
        const markDayCompleteBtn = dayCard.querySelector('.mark-day-complete-btn');
        if (markDayCompleteBtn) {
            markDayCompleteBtn.disabled = (percentage === 100 && totalTasks > 0);
        }
    };

    /**
     * Updates the overall progress bar.
     */
    const updateOverallProgress = () => {
        let overallCompletedTasks = 0;
        let overallTotalTasks = 0;

        studyPlan.forEach(dayData => {
            const dayState = taskStates[dayData.day];
            if (dayState) {
                for (const time in dayState) {
                    for (const taskIdx in dayState[time]) {
                        overallTotalTasks++;
                        if (dayState[time][taskIdx]) {
                            overallCompletedTasks++;
                        }
                    }
                }
            }
        });

        const overallPercentage = overallTotalTasks === 0 ? 0 : Math.round((overallCompletedTasks / overallTotalTasks) * 100);
        overallProgressBar.style.width = `${overallPercentage}%`;
        overallProgressText.textContent = `${overallPercentage}% Complete`;
    };

    /**
     * Renders all day cards and their tasks based on studyPlan data.
     */
    const renderStudyPlan = () => {
        daysContainer.innerHTML = ''; // Clear existing content

        studyPlan.forEach((dayData, dayIndex) => {
            const dayCard = document.createElement('div');
            dayCard.classList.add('day-card');
            dayCard.id = `day-${dayData.day}`;
            dayCard.style.animationDelay = `${dayIndex * 0.1}s`; // Stagger animation

            let subTitleHtml = '';
            if (dayData.subTitle) {
                const subClass = dayData.subTitle.includes('Target') ? 'target-text' : 'victory-text';
                subTitleHtml = `<span class="${subClass}">${dayData.subTitle}</span>`;
            }

            dayCard.innerHTML = `
                <h2 class="day-title">
                    ${dayData.title} ${subTitleHtml}
                    <span class="status-emoji"></span>
                </h2>
                <div class="day-progress">
                    <div class="progress-bar-container day-progress-bar-container">
                        <div class="progress-bar day-progress-bar"></div>
                    </div>
                </div>
            `;

            dayData.sections.forEach(section => {
                const taskSectionDiv = document.createElement('div');
                taskSectionDiv.classList.add('task-section');
                taskSectionDiv.innerHTML = `<h3>${section.time}</h3><ul></ul>`;
                const ul = taskSectionDiv.querySelector('ul');

                section.tasks.forEach((taskText, taskIdx) => {
                    const li = document.createElement('li');
                    li.dataset.day = dayData.day;
                    li.dataset.time = section.time;
                    li.dataset.task = taskIdx;

                    // Check if task is completed from loaded states
                    const isCompleted = taskStates[dayData.day]?.[section.time]?.[taskIdx] || false;
                    if (isCompleted) {
                        li.classList.add('completed');
                    }

                    li.innerHTML = `
                        <input type="checkbox" id="day${dayData.day}-task${taskIdx}-${section.time.replace(/\W/g, '')}" ${isCompleted ? 'checked' : ''}>
                        <label for="day${dayData.day}-task${taskIdx}-${section.time.replace(/\W/g, '')}">${taskText}</label>
                    `;
                    ul.appendChild(li);
                });
                dayCard.appendChild(taskSectionDiv);
            });

            // Add "Mark Day as Complete" button
            const markDayCompleteBtn = document.createElement('button');
            markDayCompleteBtn.classList.add('mark-day-complete-btn');
            markDayCompleteBtn.innerHTML = '<i class="fas fa-check-double"></i> Mark Day Complete';
            markDayCompleteBtn.addEventListener('click', () => {
                markAllTasksForDay(dayData.day);
                showToast(`Day ${dayData.day} marked as complete!`);
            });
            dayCard.appendChild(markDayCompleteBtn);


            daysContainer.appendChild(dayCard);
        });

        // Attach event listeners after all elements are rendered
        attachEventListeners();
        updateAllProgress(); // Update progress bars after rendering
    };

    /**
     * Attaches event listeners to all dynamically created elements.
     */
    const attachEventListeners = () => {
        // Event listener for individual task checkboxes/list items
        document.querySelectorAll('li').forEach(listItem => {
            listItem.addEventListener('click', (event) => {
                // Ensure click is not on the label or input directly if that's preferred
                // If you want clicking anywhere on LI to toggle:
                if (event.target.tagName !== 'INPUT' && event.target.tagName !== 'LABEL') {
                    const checkbox = listItem.querySelector('input[type="checkbox"]');
                    checkbox.checked = !checkbox.checked;
                    // Manually dispatch change event to trigger checkbox's own listener
                    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });
        });

        // Event listener for actual checkbox changes
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (event) => {
                const li = event.target.closest('li');
                const day = li.dataset.day;
                const time = li.dataset.time;
                const taskIndex = li.dataset.task;

                taskStates[day][time][taskIndex] = event.target.checked;

                if (event.target.checked) {
                    li.classList.add('completed');
                    li.style.backgroundColor = 'var(--completed-bg)';
                    showToast('Task completed! ✅');
                } else {
                    li.classList.remove('completed');
                    li.style.backgroundColor = 'var(--uncompleted-bg)';
                    showToast('Task unchecked! 🔄');
                }

                // Reset background after a short delay for animation effect
                setTimeout(() => {
                    li.style.backgroundColor = '';
                }, 300);

                saveTaskStates();
                updateDayProgress(day);
                updateOverallProgress();
            });
        });
    };

    /**
     * Marks all tasks for a given day as complete.
     * @param {number} dayNum - The day number to mark complete.
     */
    const markAllTasksForDay = (dayNum) => {
        const dayCard = document.getElementById(`day-${dayNum}`);
        if (!dayCard) return;

        const dayState = taskStates[dayNum];
        if (dayState) {
            for (const time in dayState) {
                for (const taskIdx in dayState[time]) {
                    taskStates[dayNum][time][taskIdx] = true; // Mark as complete in state
                }
            }
        }

        // Visually update checkboxes and LIs
        dayCard.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = true;
            checkbox.closest('li').classList.add('completed');
        });

        saveTaskStates();
        updateDayProgress(dayNum);
        updateOverallProgress();
    };

    /**
     * Updates all day progress bars and the overall progress bar.
     */
    const updateAllProgress = () => {
        studyPlan.forEach(dayData => updateDayProgress(dayData.day));
        updateOverallProgress();
    };

    /**
     * Resets all progress data.
     */
    const resetAllProgress = () => {
        if (confirm('Are you sure you want to reset all your study progress? This action cannot be undone.')) {
            localStorage.removeItem('studyTrackerTaskStates');
            taskStates = {}; // Clear current state
            loadTaskStates(); // Re-initialize with empty state
            renderStudyPlan(); // Re-render everything
            showToast('All progress has been reset!', 4000);
        }
    };

    // --- Initializations ---
    loadTaskStates(); // Load state first
    renderStudyPlan(); // Then render the UI
    updateAllProgress(); // Ensure all progress bars are updated correctly

    // Create a canvas for confetti
    const confettiCanvas = document.createElement('canvas');
    confettiCanvas.id = 'confetti-canvas';
    document.body.appendChild(confettiCanvas);

    // Event listener for the "Reset All" button
    resetAllBtn.addEventListener('click', resetAllProgress);
});