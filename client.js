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
};

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
  filteredRequests:"",
  sort_type:"new_first",
  keyWord: '',
};


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
  state.requests.push(request);
  addRequestDiv(request);
  showRequests();
});
};


const getRequests = (()=>{
  fetch("http://localhost:7777/video-request")
  .then(response => response.json())
.then(data => {state.requests = data; showRequests()});
})();



const addRequests = (request_by,MainRequests)=>{
  if (request_by === 'top_voted'){
    state.sort_type = "top_voted";
    const requests = JSON.parse(JSON.stringify(MainRequests));
    const sortedRequests = requests.sort((a,b)=>(a.votes.ups - a.votes.downs)-(b.votes.ups - b.votes.downs));
    top_voted.classList.add("active");
    new_first.classList.remove("active");
    for (request of sortedRequests){
      addRequestDiv(request);
    }
  }else {
    state.sort_type = "new_first";
    top_voted.classList.remove("active");
    new_first.classList.add("active");
    for (request of MainRequests){
      addRequestDiv(request);
    }
  }
}



const showRequests =  async (request_by = 'new_first',e = null)=>{
  const requestsDiv = document.getElementById("listOfRequests");
  const top_voted = document.getElementById("top_voted");
  const new_first = document.getElementById("new_first");
  await filteredResuls(e);
  requestsDiv.innerHTML = "";
  addRequests(request_by,state.filteredRequests);
};



const sortRequests = (request_by)=>{
  request_by === 'top_voted' ?  showRequests("top_voted") :  showRequests();
};



const filteredResuls = async (e)=>{
  let keyWord = '';
  if (e != null){
    keyWord = e.target.value;
    state.keyWord = keyWord;
  }else {
    keyWord = state.keyWord;
  }
  const filtered = await fetch("http://localhost:7777/searchRequests", {
    method:"POST", 
    headers: {
      'Content-Type': 'application/json',
    },
    body:JSON.stringify({topic:keyWord})})
  const requests = await filtered.json();
  const filteredRequests = requests.filter(request=>request.topic_title.toLowerCase().includes(keyWord.toLowerCase()));
  state.filteredRequests = filteredRequests;
};

const debounce = function(func, delay){
  let debounceTimer 
return function(...args){
const context = this;
clearTimeout(debounceTimer) 
    debounceTimer = setTimeout(() => func(...args), delay);
}
}


const searchResults =  debounce((e)=>{
showRequests(state.sort_type,e);
}, 500);





const updateVote = (e, id, vote_type)=>{
  console.log(id);
  fetch("http://localhost:7777/video-request/vote", {
    method: "PUT", 
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({id, vote_type}),
  })
  .then(response => response.json())
  .then(data => {
    const index = state.requests.findIndex(request=>request._id === id);
    state.requests[index].votes[vote_type] = data.votes[vote_type];
    e.target.parentNode.childNodes[1].innerHTML = data.votes.ups - data.votes.downs;
  });
};




const addRequestDiv = (request)=>{
  const htmlContent =  `<div class='card mb-3'><div class='card-body d-flex justify-content-between flex-row'><div class='d-flex flex-column'><h3>${request.topic_title}</h3><p class='text-muted mb-2'>${request.topic_details}</p><p class='mb-0 text-muted'><strong>Expected results:</strong>${request.expected_result}</p></div><div class='d-flex flex-column text-center'><a class='btn btn-link' onClick='updateVote(event, "${request._id}", "ups")'>🔺</a><h3>${request.votes.ups - request.votes.downs}</h3><a class='btn btn-link' onClick='updateVote(event, "${request._id}", "downs")'>🔻</a></div></div><div class='card-footer d-flex flex-row justify-content-between'><div><span class='text-info'>${request.status}</span>&bullet; added by <strong>${request.author_name}</strong> on<strong>${request.submit_date}</strong></div><div class='d-flex justify-content-center flex-column 408ml-auto mr-2'><div class='badge badge-success'>${request.target_level}</div></div></div></div>`;
  const requestsDiv = document.getElementById("listOfRequests");
  const requestNode = document.createElement("div");
  requestNode.innerHTML = htmlContent;
  requestsDiv.prepend(requestNode);
};
