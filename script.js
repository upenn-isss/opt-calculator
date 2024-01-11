var programEnd; // Program End Date
var earlyStartDate; // Earliest Requested OPT Start
var earlyApply; // Earliest date to apply
var applyDeadline;
var lateStartDate; // Latest Start Date and Latest Date to Apply
var endDate; // OPT Employment End Date
var remainingTime = 365; //OPT Time Remaining
var lblNames = 0;
var latestEnd;

const options = {
  timeZone: "UTC",
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

// helper functions -------------------------

function makeDate(date) {
  return new Date(date).toLocaleString("en-US", options);
}

function dateMath(date, operator, numDays) {
  const newDate = new Date(date.valueOf());

  switch (operator) {
    case "+":
      newDate.setUTCDate(newDate.getUTCDate() + numDays);
      return newDate;
    case "-":
      newDate.setUTCDate(newDate.getUTCDate() - numDays);
      return newDate;
    default:
      console.log("invalid dateMath");
  }
}

function fadeIn(item) {
  item.classList.remove("appear");
  void item.offsetWidth;
  item.classList.add("appear");
}

function resetCalculator() {
  let allSecs = document.querySelectorAll(".calc-section").length;

  for (var i = allSecs - 1; i > 0; i--) {
    document.querySelectorAll(".calc-section")[i].style.display = "none";
  }

  fadeIn(pt1);

  text1.style.display = "none";
  document.querySelector("[data-pt='pt2']").style.display = "none";
  previousOPT.reset();
  remainingTime = 365;
}

// end helper functions ---------------------------

// select text elements, form elements, buttons, etc

const text1 = document.querySelector("#text1");
const text2 = document.querySelector("#text2");
const text3 = document.querySelector("#text3");
const text6 = document.querySelector("#text6");
const degree = document.querySelector("#lvl");
const year = document.querySelector("#sem");
const season = document.querySelector("#season");
const startselect = document.querySelector("#startselect");
const previousopt = document.querySelector("#previousOPT");
const optYESradio = document.querySelector("#optYES");
const optNOradio = document.querySelector("#optNO");
const calcRemainingBtn = document.querySelector("#calcRemaining");
const startDateSelect = document.querySelector("#startDateSelect");
const latestPossibleEnd = document.querySelector("#latestPossibleEnd");
const viewSummaryBtn = document.querySelector("#viewSummary");
const reset = document.querySelector("#reset");

// select each form step

const pt1 = document.querySelector("#pt1");
const pt2 = document.querySelector("#pt2");
const pt3 = document.querySelector("#pt3");
const pt4 = document.querySelector("#pt4");
const pt5 = document.querySelector("#pt5");
const pt6 = document.querySelector("#pt6");

const summary = document.querySelector("#summary");

// dates from Penn academic calendar: https://almanac.upenn.edu/penn-academic-calendar ; https://www.ipenn.oip.upenn.edu/istart/xservices/services/upenn-codes.cfm

const dates = {
  2024: {
    spring: "2024-05-20",
    summer: "2024-08-09",
    fall: "2024-12-19",
  },
  2025: {
    spring: "2025-05-19",
    summer: "2025-08-08",
    fall: "2025-12-18",
     },
  2026: {
    spring: "2026-05-18",
    summer: "2026-08-07",
    fall: "2026-12-18",
  },
};

// class defines each existing past OPT authorization

class OptAuth {
  static OptLength = 0;
  constructor(start, end, type) {
    this.start = start;
    this.end = end;
    this.type = type;
    this.getDuration = function () {
      const duration = end - start;

      switch (type) {
        case "pt":
          OptAuth.OptLength +=
            Math.floor(duration / (1000 * 60 * 60 * 24) + 1) / 2;
          break;
        case "ft":
          OptAuth.OptLength += Math.floor(duration / (1000 * 60 * 60 * 24) + 1);
      }
    };
    this.getDuration();
  }
}

// triggers re-calculation based on prog end date

function set() {
  programEnd = new Date(dates[year.value][season.value]);
  calcDates();
  updateTxt();
  calcEndDate();
  calcLatestEnd();
  updateSummary();

  if (text1.style.display == "none") {
    text1.style.display == "block";
  } else {
    return;
  }

  if (document.querySelector("#infotext1").style.display == "none") {
    document.querySelector("#infotext1").style.display == "block";
  } else {
    return;
  }
}

function calcDates() {
  earlyStartDate = makeDate(dateMath(programEnd, "+", 1)); // Earliest requested start date: Program end date + 1
  lateStartDate = makeDate(dateMath(programEnd, "+", 60)); // Latest OPT start date: Program end date + 60
  earlyApply = makeDate(dateMath(programEnd, "-", 90)); // Earliest date to apply: Program end date - 90
  applyDeadline = makeDate(dateMath(programEnd, "+", 60));
}

//update all text fields
function updateTxt() {
  calcDates();

  // first section --
  text1.innerHTML = `
  <p>Your program end date is <strong class="bubble" tabindex="0">${makeDate(
    programEnd
  )}. <span class="timeSpan">Final day of the semester.</span></strong></p>
  `;

  if (degree.value == "phd") {
    text1.innerHTML += `<p><strong>NOTE:</strong> As a doctoral student, you have some flexibility in determining your program end date for OPT purposes. You may want to use a custom date, such as your dissertation defense date.</p>`;
    text1.innerHTML += `
    <label for = "customdate">Enter Custom Program End Date 
    <em>(optional)&nbsp;&nbsp;&nbsp;</em>
    <input type="date" value="${programEnd}" onChange = "useCustomDate()" id="customdate">
    </label>`;
  }
  //end first section --

  //second section --
  text2.innerHTML = `
  <p>You may send your application to USCIS as early as <strong class="bubble" tabindex="0">${earlyApply} <span class="timeSpan">90 days before program end date.</span></strong>. 
  Your application must be <em>received by USCIS</em> by <strong class="bubble" tabindex="0">${applyDeadline} <span class="timeSpan">60 days after program end date.</span></strong>.
  `;
  //end second section --

  //third section --
  text3.innerHTML = `
  <p>Your earliest start date is <strong class="bubble" tabindex="0">${earlyStartDate} <span class="timeSpan">1 day after program end date.</span></strong>. 
  Your start date must be no later than <strong class="bubble" tabindex="0">${lateStartDate} <span class="timeSpan">60 days after program end date.</span></strong>.
  `;
  //end third section --
}

// use custom prog end date

function useCustomDate() {
  programEnd = document.querySelector("#customdate").value;
  updateTxt();
  calcDates();
  calcEndDate();
  updateSummary();
}

// initializes value of select in final form step with program end date + one day

function calcEndDate() {
  startDateSelect.value = dateMath(programEnd, "+", 1)
    .toISOString()
    .split("T")[0];
  text6.innerHTML = `You have <strong class="bubble">${remainingTime}/365 <span class="timeSpan" tabindex="0">You have used ${OptAuth.OptLength} days of OPT.</span></strong> days of OPT remaining.`;
}

// updates summary table

function updateSummary() {
  summary.querySelector("#summary-progend").innerText = makeDate(programEnd);
  summary.querySelector("#summary-earlyst").innerText = earlyStartDate;
  summary.querySelector("#summary-latestst").innerText = lateStartDate;
  summary.querySelector("#summary-appdeadline").innerText = applyDeadline;
  summary.querySelector("#summary-optremain").innerText = remainingTime;
  summary.querySelector("#summary-startdt").innerText = makeDate(
    startDateSelect.value
  );
  summary.querySelector("#summary-enddt").innerText = latestEnd;
}

// calculates remaining OPT time based on used OPT time at same degree lvl

function calcRemainingOPTTime() {
  OptAuth.OptLength = 0; // reinitialize total used OPT time to 0
  document.querySelectorAll(".opt-row").forEach((row) => {
    if (row.querySelector(".past-opt-start").value == "") {
      // account for empty rows
      return;
    } else {
      const oldStart = row.querySelector(".past-opt-start").value;
      const oldEnd = row.querySelector(".past-opt-end").value;
      const optLoad = row.querySelector("select").value;
      const newOpt = new OptAuth(new Date(oldStart), new Date(oldEnd), optLoad);
    }
  });

  remainingTime = 365 - OptAuth.OptLength;
  calcLatestEnd();
  updateSummary();
}

// calculate end date based on remaining time and selected end date
function calcLatestEnd() {
  latestEnd = makeDate(dateMath(startDateSelect.value, "+", remainingTime - 1));
  latestPossibleEnd.innerText = latestEnd;
  updateSummary();
}

function addEADrow() {
  lblNames++;

  const newRow = document.createElement("fieldset");

  newRow.classList.add("opt-row");
  newRow.setAttribute("id", `opt-rows${lblNames}`);

  newRow.innerHTML += `
                <div class="row-wrap">
                    <label for="past-opt-start${lblNames}">Start Date
                        <input type="date" id="past-opt-start${lblNames}" name="past-opt" class="past-opt-start"></label>
                </div>
                <div class="row-wrap">
                    <label for="past-opt-end${lblNames}">End Date
                        <input type="date" id="past-opt-end${lblNames}" name="past-opt" class="past-opt-end"></label>
                </div>
                <div class="row-wrap">
                    <label for="pt-ft${lblNames}">Full-Time/Part-Time
                        <select name="pt-ft" id="pt-ft${lblNames}">
                            <option value="ft">Full-Time</option>
                            <option value="pt">Part-Time (&lt;20 hrs/wk)</option>
                        </select></label>        
  `;

  document.querySelector("#opt-rows").appendChild(newRow);
  fadeIn(newRow);
  document.documentElement.scrollTop = newRow.offsetTop;
}

function showFirstBtn() {
  document.querySelector("[data-pt='pt2']").classList.remove("appear");
  void document.querySelector("[data-pt='pt2']").offsetWidth;
  document.querySelector("[data-pt='pt2']").classList.add("appear");
  document.querySelector("[data-pt='pt2']").style.display = "block";
}

// Event Listeners

// Submit for program date

startselect.addEventListener("submit", (e) => {
  e.preventDefault();
  set();
});

// Display next section on button click based on data attribute

document.querySelectorAll(".nxtBtn").forEach((button) => {
  if (button.dataset.pt == "") {
    return;
  } else {
    button.addEventListener("click", (e) => {
      document.querySelector(`#${button.dataset.pt}`).style.display = "block";
      fadeIn(document.querySelector(`#${button.dataset.pt}`));
      document.documentElement.scrollTop = document.querySelector(
        `#${button.dataset.pt}`
      ).offsetTop;
    });
  }
});

// Add New EAD Row on click

document.querySelector("#addrow").addEventListener("click", (e) => {
  addEADrow();
  document
    .querySelector(`#past-opt-start${lblNames}`)
    .addEventListener("change", (e) => {
      document
        .querySelector(`#past-opt-end${lblNames}`)
        .setAttribute(
          "min",
          document.querySelector(`#past-opt-start${lblNames}`).value
        );
    });
});

// Show the first button and then remove the event listener

startselect.addEventListener("submit", showFirstBtn);

// Display next section on button click based on data attribute

previousopt.addEventListener("submit", (e) => {
  e.preventDefault();
  set();
});

//event listener for "yes" option

optYESradio.addEventListener("change", (e) => {
  if (e.target.checked) {
    pt5.style.display = "block";
    document.documentElement.scrollTop = pt5.offsetTop;
  } else {
    pt5.style.display = "none";
  }
});

//event listener for "no" option on prev
optNOradio.addEventListener("change", (e) => {
  if (e.target.checked) {
    remainingTime = 365;
    pt5.style.display = "none";

    pt6.style.display = "block";
    fadeIn(pt6);
    document.documentElement.scrollTop = pt6.offsetTop;

    for (
      var i =
        document.querySelector("#opt-rows").querySelectorAll(".opt-row")
          .length - 1;
      i > 0, i--;

    ) {
      document
        .querySelector("#opt-rows")
        .querySelectorAll(".opt-row")
        [i].remove();
    }

    calcEndDate();
    calcLatestEnd();
  } else {
    pt5.style.display = "block";
    document.documentElement.scrollTop = pt5.offsetTop;
  }
});

// Change end date based on date input

startDateSelect.addEventListener("change", calcLatestEnd);

// Display summary

viewSummaryBtn.addEventListener("click", updateSummary);

// Reset calculator

reset.addEventListener("click", resetCalculator);

// Calculate remaining OPT time on button click

calcRemainingBtn.addEventListener("click", (e) => {
  calcRemainingOPTTime();
  if (pt6.style.display != "block") {
    pt6.style.display = "block";
  }
  calcEndDate();
  calcLatestEnd();
});

// prevent user from selecting previous end dates that are before the start date on the first EAD

document.querySelector(`#past-opt-start0`).addEventListener("change", (e) => {
  document
    .querySelector(`#past-opt-end0`)
    .setAttribute("min", document.querySelector(`#past-opt-start0`).value);
});

document.querySelector("#email").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.querySelector("#emailinput").value;
  const formattedBOdy = `
    Here is your OPT timeline from http://global.upenn.edu/isss/opt. \n\n
    Program End Date: ${makeDate(programEnd)} \n 
    Application Deadline: ${applyDeadline} \n
    Earliest Start Date: ${earlyStartDate} \n 
    Latest Start Date: ${lateStartDate} \n
    Selected Start Date: ${makeDate(startDateSelect.value)} \n
    Latest Possible End Date: ${latestEnd} \n \n \n
    Good luck with your OPT application :) 
      `;

  const link = `mailto:${email}?subject=My OPT Timeline&body=${encodeURIComponent(
    formattedBOdy
  )}`;
  window.location.href = link;
});

earlyStartDate;
summary.querySelector("#summary-latestst").innerText = lateStartDate;
summary.querySelector("#summary-appdeadline").innerText = applyDeadline;
summary.querySelector("#summary-optremain").innerText = remainingTime;
summary.querySelector("#summary-startdt").innerText = makeDate(
  startDateSelect.value
);
summary.querySelector("#summary-enddt").innerText = latestEnd;
