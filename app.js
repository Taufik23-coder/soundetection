const URL = "https://teachablemachine.withgoogle.com/models/S34FgxfR_/";

let recognizer, labelContainer, classLabels;

// Automatically initialize the audio model
window.onload = async function () {
    await init();
};

// Load the audio model and set up the dashboard
async function init() {
    recognizer = await createModel();
    classLabels = recognizer.wordLabels(); // Get class labels

    // Set up the label container with bar chart
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < classLabels.length; i++) {
        const bar = document.createElement("div");
        bar.classList.add("bar");

        const label = document.createElement("div");
        label.classList.add("bar-label");
        label.textContent = classLabels[i];

        const barFill = document.createElement("div");
        barFill.classList.add("bar-fill");
        barFill.style.backgroundColor = getRandomColor();
        barFill.style.width = "0%";

        bar.appendChild(label);
        bar.appendChild(barFill);
        labelContainer.appendChild(bar);
    }

    // Start listening for sound
    recognizer.listen(result => {
        const scores = result.scores; // Probabilities for each class
        for (let i = 0; i < classLabels.length; i++) {
            const bar = labelContainer.childNodes[i];
            const barFill = bar.querySelector(".bar-fill");

            // Update the bar width based on probability
            barFill.style.width = `${scores[i] * 100}%`;
            barFill.textContent = `${(scores[i] * 100).toFixed(1)}%`;
        }
    }, {
        includeSpectrogram: true, // Optional spectrogram visualization
        probabilityThreshold: 0.75,
        invokeCallbackOnNoiseAndUnknown: true,
        overlapFactor: 0.5 // Overlap factor for smoother detection
    });
}

// Load the model and metadata
async function createModel() {
    const checkpointURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    const recognizer = speechCommands.create(
        "BROWSER_FFT", // Fourier Transform type
        undefined, // Speech commands vocabulary
        checkpointURL,
        metadataURL
    );

    await recognizer.ensureModelLoaded();
    return recognizer;
}

// Generate random colors for each bar
function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
