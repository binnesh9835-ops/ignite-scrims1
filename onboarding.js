let step = 0;

const steps = [
    {
        title: "Welcome 🔥",
        text: "Play tournaments and win real money."
    },
    {
        title: "Join Matches",
        text: "Tap on Join Now to enter matches."
    },
    {
        title: "Add Money",
        text: "Add money using UPI to play."
    },
    {
        title: "Win Rewards",
        text: "Earn money from kills and booyah."
    },
    {
        title: "Withdraw",
        text: "Withdraw your winnings anytime."
    }
];

window.onload = () => {
    document.getElementById("onboarding").classList.remove("hidden");
    updateStep();
};

function updateStep() {
    document.getElementById("step-title").innerText = steps[step].title;
    document.getElementById("step-text").innerText = steps[step].text;
}

function nextStep() {
    if (step < steps.length - 1) {
        step++;
        updateStep();
    } else {
        closeOnboarding();
    }
}

function prevStep() {
    if (step > 0) {
        step--;
        updateStep();
    }
}
