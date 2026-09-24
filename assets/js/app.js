const timer = document.querySelector('#timer');
const startBtn = document.querySelector('#start-btn');
const pauseBtn = document.querySelector('#pause-btn');
const resetBtn = document.querySelector('#reset-btn');

const cycleCount = document.querySelector('#cycle-count');
const sessionCount = document.querySelector('#session-count');

const sessionType = document.querySelector('#session-type');
const sessionIndicator = document.querySelector('#session-indicator');

const settingsBtn = document.querySelector('#settings-btn');
const settingsPanel = document.querySelector('#settings-panel');
const closeSettingsBtn = document.querySelector('#close-settings-btn');
const saveSettingsBtn = document.querySelector('#save-settings-btn');

const workDurationInput = document.querySelector('#work-duration');
const shortBreakDurationInput = document.querySelector('#short-break-duration');
const longBreakDurationInput = document.querySelector('#long-break-duration');


// =========================
// Settings Initialization
// =========================

let workDuration = Number(workDurationInput.value);
let shortBreakDuration = Number(shortBreakDurationInput.value);
let longBreakDuration = Number(longBreakDurationInput.value);


// =========================
// Timer State Variables
// =========================

let timeLeft = workDuration * 60;
let timerId = null;
let currentCycle = 0;
let sessionResult = 0;
let currentSession = 'work';


// =========================
// Initial UI Render
// =========================

formatTime(timeLeft);
cycleCount.textContent = `${currentCycle} / 4`;
sessionCount.textContent = sessionResult;


// =========================
// Start Timer Event
// =========================

startBtn.addEventListener('click', () => {
    // Prevent creating multiple intervals if the timer is already running
    if (timerId !== null) {
        return;
    }

    // Fixed the interval bug: changed from 100ms to 1000ms (1 second) for accurate countdown
    timerId = setInterval(() => {
        timeLeft--;
        formatTime(timeLeft);

        if (timeLeft === 0) {
            finishSession();
        }
    }, 1000);
});


// =========================
// Pause Timer Event
// =========================

pauseBtn.addEventListener('click', () => {
    if (timerId === null) {
        return;
    }

    clearInterval(timerId);
    timerId = null;
});


// =========================
// Reset Timer Event
// =========================

resetBtn.addEventListener('click', () => {
    clearInterval(timerId);
    timerId = null;

    currentCycle = 0;
    sessionResult = 0;
    currentSession = 'work';
    timeLeft = workDuration * 60;

    formatTime(timeLeft);
    updateUI();
});


// =========================
// Finish Session Logic
// =========================

function finishSession() {
    clearInterval(timerId);
    timerId = null;

    // -------------------------
    // Work Session Finished
    // -------------------------
    if (currentSession === 'work') {
        sessionResult++;
        currentCycle++;

        sessionCount.textContent = sessionResult;
        cycleCount.textContent = `${currentCycle} / 4`;

        // After 4 work sessions, trigger long break
        if (currentCycle === 4) {
            currentSession = 'longBreak';
            timeLeft = longBreakDuration * 60;
        } 
        // Otherwise, trigger short break
        else {
            currentSession = 'shortBreak';
            timeLeft = shortBreakDuration * 60;
        }
    }
    // -------------------------
    // Short Break Finished
    // -------------------------
    else if (currentSession === 'shortBreak') {
        currentSession = 'work';
        timeLeft = workDuration * 60;
    }
    // -------------------------
    // Long Break Finished
    // -------------------------
    else if (currentSession === 'longBreak') {
        currentSession = 'work';
        currentCycle = 0;

        cycleCount.textContent = `${currentCycle} / 4`;
        timeLeft = workDuration * 60;
    }

    updateUI();
    formatTime(timeLeft);
}


// =========================
// Update UI Elements
// =========================

function updateUI() {
    cycleCount.textContent = `${currentCycle} / 4`;
    sessionCount.textContent = sessionResult;

    if (currentSession === 'work') {
        sessionType.textContent = 'Work';
        sessionIndicator.className = 'w-2 h-2 rounded-full bg-red-500';
    } else if (currentSession === 'shortBreak') {
        sessionType.textContent = 'Short Break';
        sessionIndicator.className = 'w-2 h-2 rounded-full bg-green-500';
    } else if (currentSession === 'longBreak') {
        sessionType.textContent = 'Long Break';
        sessionIndicator.className = 'w-2 h-2 rounded-full bg-blue-500';
    }
}


// =========================
// Format Time Function
// =========================

function formatTime(time) {
    let minute = Math.floor(time / 60);
    minute = minute.toString().padStart(2, '0');

    let second = time % 60;
    second = second.toString().padStart(2, '0');

    timer.textContent = `${minute} : ${second}`;
}


// =========================
// Settings Panel Handlers
// =========================

settingsBtn.addEventListener('click', () => {
    settingsPanel.classList.toggle('hidden');
});

closeSettingsBtn.addEventListener('click', () => {
    settingsPanel.classList.add('hidden');
});


// =========================
// Save Custom Settings
// =========================

saveSettingsBtn.addEventListener('click', () => {
    workDuration = Number(workDurationInput.value);
    shortBreakDuration = Number(shortBreakDurationInput.value);
    longBreakDuration = Number(longBreakDurationInput.value);

    // Stop active timer upon saving settings
    clearInterval(timerId);
    timerId = null;

    // Reset to work session with new duration
    currentSession = 'work';
    timeLeft = workDuration * 60;

    updateUI();
    formatTime(timeLeft);
    settingsPanel.classList.add('hidden');
});