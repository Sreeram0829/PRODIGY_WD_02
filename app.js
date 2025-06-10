  // DOM Elements
        const display = document.getElementById('display');
        const startBtn = document.getElementById('startBtn');
        const lapBtn = document.getElementById('lapBtn');
        const resetBtn = document.getElementById('resetBtn');
        const lapsList = document.getElementById('lapsList');
        const lapsContainer = document.getElementById('lapsContainer');

        // Stopwatch variables
        let startTime;
        let elapsedTime = 0;
        let timerInterval;
        let isRunning = false;
        let laps = [];
        let fastestLap = null;
        let slowestLap = null;

        // Format time (HH:MM:SS.mmm)
        function formatTime(time) {
            const date = new Date(time);
            const hours = date.getUTCHours().toString().padStart(2, '0');
            const minutes = date.getUTCMinutes().toString().padStart(2, '0');
            const seconds = date.getUTCSeconds().toString().padStart(2, '0');
            const milliseconds = date.getUTCMilliseconds().toString().padStart(3, '0');
            
            return `${hours}:${minutes}:${seconds}.${milliseconds}`;
        }

        // Update display
        function updateDisplay() {
            display.textContent = formatTime(elapsedTime);
        }

        // Start the stopwatch
        function start() {
            if (!isRunning) {
                startTime = Date.now() - elapsedTime;
                timerInterval = setInterval(() => {
                    elapsedTime = Date.now() - startTime;
                    updateDisplay();
                }, 10);
                
                isRunning = true;
                startBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
                startBtn.classList.remove('btn-primary');
                startBtn.classList.add('btn-danger');
                lapBtn.disabled = false;
                resetBtn.disabled = false;
            } else {
                pause();
            }
        }

        // Pause the stopwatch
        function pause() {
            clearInterval(timerInterval);
            isRunning = false;
            startBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
            startBtn.classList.remove('btn-danger');
            startBtn.classList.add('btn-primary');
        }

        // Reset the stopwatch
        function reset() {
            clearInterval(timerInterval);
            isRunning = false;
            elapsedTime = 0;
            updateDisplay();
            laps = [];
            fastestLap = null;
            slowestLap = null;
            lapsList.innerHTML = '';
            
            startBtn.innerHTML = '<i class="fas fa-play"></i> Start';
            startBtn.classList.remove('btn-danger');
            startBtn.classList.add('btn-primary');
            lapBtn.disabled = true;
            resetBtn.disabled = true;
        }

        // Record lap time
        function lap() {
            if (!isRunning) return;
            
            const lapTime = elapsedTime - (laps.length > 0 ? laps.reduce((acc, lap) => acc + lap.time, 0) : 0);
            const lapData = {
                number: laps.length + 1,
                time: lapTime,
                total: elapsedTime
            };
            
            laps.push(lapData);
            
            // Update fastest and slowest laps
            if (fastestLap === null || lapTime < fastestLap.time) {
                fastestLap = lapData;
            }
            if (slowestLap === null || lapTime > slowestLap.time) {
                slowestLap = lapData;
            }
            
            renderLaps();
            
            // Scroll to bottom of laps container
            lapsContainer.scrollTop = lapsContainer.scrollHeight;
        }

        // Render laps list
        function renderLaps() {
            lapsList.innerHTML = '';
            
            laps.forEach(lap => {
                const lapItem = document.createElement('div');
                lapItem.className = 'lap-item';
                
                const lapNumber = document.createElement('span');
                lapNumber.className = 'lap-number';
                lapNumber.textContent = `Lap ${lap.number}`;
                
                const lapTime = document.createElement('span');
                lapTime.className = 'lap-time';
                
                // Add classes for fastest/slowest laps
                if (fastestLap && lap.number === fastestLap.number) {
                    lapTime.classList.add('fastest');
                } else if (slowestLap && lap.number === slowestLap.number) {
                    lapTime.classList.add('slowest');
                }
                
                lapTime.textContent = formatTime(lap.time);
                
                lapItem.appendChild(lapNumber);
                lapItem.appendChild(lapTime);
                lapsList.appendChild(lapItem);
            });
        }

        // Event listeners
        startBtn.addEventListener('click', start);
        lapBtn.addEventListener('click', lap);
        resetBtn.addEventListener('click', reset);

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                if (isRunning || elapsedTime === 0) {
                    start();
                } else {
                    start(); // Resume
                }
            } else if (e.code === 'KeyL' && !lapBtn.disabled) {
                e.preventDefault();
                lap();
            } else if (e.code === 'KeyR' && !resetBtn.disabled) {
                e.preventDefault();
                reset();
            }
        });

        // Initialize
        updateDisplay();