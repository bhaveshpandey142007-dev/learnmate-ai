const $ = (id) => document.getElementById(id);

const sampleQuiz = [
  {q:"What is the main purpose of a variable in programming?", options:["To store data","To design a webpage","To connect to the internet"], answer:0, why:"A variable stores a value that a program can use."},
  {q:"What should you do when you get a question wrong?", options:["Stop learning","Review the related concept and try again","Skip every future lesson"], answer:1, why:"Reviewing mistakes helps identify gaps and improve understanding."},
  {q:"Which approach supports personalized learning?", options:["Same pace for every student","Adapting practice to a learner's progress","Never checking understanding"], answer:1, why:"Personalized learning adjusts activities based on each learner's needs."}
];

let state = JSON.parse(localStorage.getItem("learnmateState") || '{"completed":[],"bestScore":null,"plansMade":0}');
let currentLessons = [];

function saveState(){
  localStorage.setItem("learnmateState", JSON.stringify(state));
  renderStats();
}
function renderStats(){
  $("completedCount").textContent = state.completed.length;
  $("bestScore").textContent = state.bestScore === null ? "—" : state.bestScore + "%";
  $("plansMade").textContent = state.plansMade;
}
function makeLessons(topic, level, totalMinutes){
  const templates = [
    ["Understand the basics", "Learn the key ideas and important terms."],
    ["Explore core concepts", "Study the main building blocks with examples."],
    ["See it in practice", "Work through a small real-world example."],
    ["Practise and revise", "Test your understanding and review weak areas."]
  ];
  const count = totalMinutes <= 15 ? 2 : totalMinutes <= 30 ? 3 : 4;
  const each = Math.floor(totalMinutes / count);
  return templates.slice(0,count).map((item,i)=>({
    id: topic.toLowerCase()+"-"+level+"-"+i,
    title: item[0],
    description: item[1],
    minutes: i===count-1 ? totalMinutes-each*(count-1) : each
  }));
}
$("planForm").addEventListener("submit", (event)=>{
  event.preventDefault();
  const topic = $("topic").value.trim();
  if(!topic) return;
  const level = $("level").value;
  const minutes = Number($("minutes").value);
  currentLessons = makeLessons(topic,level,minutes);
  state.plansMade++;
  saveState();
  $("planTitle").textContent = "Your " + topic + " learning path";
  $("planSummary").textContent = `Designed for a ${level.toLowerCase()} learner with ${minutes} minutes available. Complete each step at your own pace.`;
  $("lessons").innerHTML = "";
  currentLessons.forEach((lesson,index)=>{
    const done = state.completed.includes(lesson.id);
    const card = document.createElement("div");
    card.className = "lesson";
    card.innerHTML = `<span class="number">${index+1}</span><div class="lesson-info"><strong>${lesson.title}</strong><small>${lesson.description} · ${lesson.minutes} min</small></div><button class="complete ${done?"done":""}" type="button">${done?"Completed ✓":"Mark done"}</button>`;
    card.querySelector("button").addEventListener("click",()=>{
      if(state.completed.includes(lesson.id)){
        state.completed = state.completed.filter(id=>id!==lesson.id);
      }else{
        state.completed.push(lesson.id);
      }
      saveState();
      card.querySelector("button").classList.toggle("done",state.completed.includes(lesson.id));
      card.querySelector("button").textContent=state.completed.includes(lesson.id)?"Completed ✓":"Mark done";
    });
    $("lessons").appendChild(card);
  });
  $("planSection").classList.remove("hidden");
  $("quizSection").classList.remove("hidden");
  $("quizResult").classList.add("hidden");
  renderQuiz();
  $("planSection").scrollIntoView({behavior:"smooth",block:"start"});
});

function renderQuiz(){
  $("quiz").innerHTML = "";
  sampleQuiz.forEach((q,i)=>{
    const block=document.createElement("div");
    block.className="question";
    const options=q.options.map((option,j)=>`<label class="option"><input type="radio" name="q${i}" value="${j}"> ${option}</label>`).join("");
    block.innerHTML=`<p>${i+1}. ${q.q}</p>${options}`;
    $("quiz").appendChild(block);
  });
  const submit=document.createElement("button");
  submit.className="primary";
  submit.type="button";
  submit.textContent="Submit answers";
  submit.addEventListener("click",gradeQuiz);
  $("quiz").appendChild(submit);
}
function gradeQuiz(){
  let score=0, answered=0, feedback=[];
  sampleQuiz.forEach((q,i)=>{
    const selected=document.querySelector(`input[name="q${i}"]:checked`);
    if(selected){
      answered++;
      if(Number(selected.value)===q.answer){score++;feedback.push(`Q${i+1}: Correct. ${q.why}`);}
      else{feedback.push(`Q${i+1}: Review this concept. ${q.why}`);}
    }else{feedback.push(`Q${i+1}: Not answered. ${q.why}`);}
  });
  if(answered!==sampleQuiz.length){$("quizResult").textContent="Please answer all questions before submitting."; $("quizResult").classList.remove("hidden");return;}
  const percent=Math.round(score/sampleQuiz.length*100);
  state.bestScore=state.bestScore===null?percent:Math.max(state.bestScore,percent);
  saveState();
  const advice=percent===100?"Excellent work! You have understood this sample quiz.":percent>=60?"Good effort. Review the explanations below and practise again.":"Start by revisiting the lesson basics, then try the quiz again.";
  $("quizResult").innerHTML=`<strong>Your score: ${score}/${sampleQuiz.length} (${percent}%)</strong><br>${advice}<br><br>${feedback.map(x=>"• "+x).join("<br>")}`;
  $("quizResult").classList.remove("hidden");
}
$("resetBtn").addEventListener("click",()=>{
  if(confirm("Reset all saved LearnMate demo progress?")){
    state={completed:[],bestScore:null,plansMade:0};
    saveState();
    $("planSection").classList.add("hidden");
    $("quizSection").classList.add("hidden");
  }
});
renderStats();
