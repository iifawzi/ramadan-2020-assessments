// Forms: 
const change = {
  name(e){
    state.form.author_name = e.target.value;
  }, 
  email(e){
    state.form.author_email = e.target.value;
  }, 
  title(e){
    state.form.topic_title = e.target.value;
  }, 
  details(e){
    state.form.topic_details = e.target.value;
  }, 
  results(e){
    state.form.expected_result = e.target.value;
  }, 
  target(e){
    state.form.target_level = e.target.value;
  }, 
}

// State: 
const state = {
  form: {
    author_name: "",
    author_email: "",
    topic_title: "",
    topic_details: "",
    expected_result: "",
    target_level: "",
  }, 
  requests: "",
}

// Methods: 

const sendRequest = (e)=>{
  e.preventDefault();
 fetch('http://localhost:7777/video-request', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(state.form),
 })
.then(response => response.json())
.then(request => {
  addRequestDiv(request);
});
}

const getRequests = (()=>{
  fetch("http://localhost:7777/video-request")
  .then(response => response.json())
.then(data => {state.requests = data; showRequests()});
})();


const showRequests = ()=>{
  for (request of state.requests){
    addRequestDiv(request);
  }
};



const addRequestDiv = (request)=>{
  const htmlContent =  `<div class='card mb-3'><div class='card-body d-flex justify-content-between flex-row'><div class='d-flex flex-column'><h3>${request.topic_title}</h3><p class='text-muted mb-2'>${request.topic_details}</p><p class='mb-0 text-muted'><strong>Expected results:</strong>${request.expected_result}</p></div><div class='d-flex flex-column text-center'><a class='btn btn-link'>🔺</a><h3>0</h3><a class='btn btn-link'>🔻</a></div></div><div class='card-footer d-flex flex-row justify-content-between'><div><span class='text-info'>${request.status}</span>&bullet; added by <strong>${request.author_name}</strong> on<strong>${request.submit_date}</strong></div><div class='d-flex justify-content-center flex-column 408ml-auto mr-2'><div class='badge badge-success'>${request.target_level}</div></div></div></div>`;

  const requestsDiv = document.getElementById("listOfRequests");
  const requestNode = document.createElement("div");
  const contentOfNode = requestNode.innerHTML = htmlContent;
  requestsDiv.prepend(requestNode);
}
