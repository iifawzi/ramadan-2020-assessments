// Forms: 
const change = {
  title(e){
    if (e)
    state.form.topic_title = e.target.value;
    checkValidation(state.form.topic_title,[required,MaxLength],"topic_title");
  }, 
  details(e){
    if (e)
    state.form.topic_details = e.target.value;
    checkValidation(state.form.topic_details,[required],"topic_details");
  }, 
  results(e){
    if(e)
    state.form.expected_result = e.target.value;
    checkValidation(state.form.expected_result,[required],"expected_result");
  }, 
  target(e){
    if (e)
    state.form.target_level = e.target.value;
    checkValidation(state.form.target_level,[required],"target_level");
  }, 
};
const loginData = {
  name(e){
    if (e)
      state.login.author_name = e.target.value;
    checkValidation(state.login.author_name,[required],"author_name", "login");
  }, 
  email(e){
    if (e)
      state.login.author_email = e.target.value;
    checkValidation(state.login.author_email,[required],"author_email", "login");
  }, 
}

// State: 
const state = {
  form: {
    topic_title: "",
    topic_details: "",
    expected_result: "",
    target_level: "",
    author_name: "",
    author_email: "",
  }, 
  login: {
    author_name: "",
    author_email: "",
  },
  validation: {
    login: {
      author_name: false,
      author_email: false,
    },
    form: {
      topic_title: false,
      topic_details: false,
      expected_result: false,
      target_level: false,
    },
  },
  user:{
    id: "",
    author_email: "",
    author_name:"",
  },
  requests: "",
  filteredRequests:"",
  sort_type:"new_first",
  keyWord: '',
};

(function (){
  if (window.location.search){
    const urlParams = new URLSearchParams(window.location.search);
    const user_id = urlParams.get('id');
    if (user_id){
      fetch("http://localhost:7777/user", {
        method:"POST", 
        headers: {
          'Content-Type': 'application/json',
        },
        body:JSON.stringify({_id: user_id})})
        .then(response => response.json())
        .then(data => {
          if (data != false){
            state.user._id = data._id;
            state.user.author_email = data.author_email;
            state.user.author_name = data.author_name;
            document.querySelectorAll(".d-none").forEach(function(elem){
              elem.classList.remove("d-none");
            });
           document.getElementById("loginForm").classList.add("d-none");
          }else {
            window.location.href = "http://localhost:5500/"
          }

        });
   

    }
  }
})();

// Login : 

const login = (e)=>{
  e.preventDefault();
  let isValid = true;
  Object.keys(state.validation.login).forEach(elem=>{
      if (state.validation.login[elem] !== true){
        isValid = false;
      }
  })
  if (!isValid){
    Object.keys(loginData).forEach(elem=>{
      loginData[elem]();
    });
  }else {
    fetch("http://localhost:7777/users/login", {
      method:"POST", 
      headers: {
        'Content-Type': 'application/json',
      },
      body:JSON.stringify(state.login)})
      .then(response => response.json())
      .then(id => {
window.location.href = "http://localhost:5500?id="+id;
state.user.id = id;
state.user.author_email = state.login.author_email;
state.user.author_name = state.login.author_name;
      });
  }
}


// Methods: 
// send new request to the db and update the view by showRequests
const sendRequest = (e)=>{
  e.preventDefault();
  let isValid = true;
  Object.keys(state.validation.form).forEach(elem=>{
      if (state.validation.form[elem] !== true){
        isValid = false;
      }
  })
  if (!isValid){
    document.getElementById("formError").classList.remove("hidden");
    Object.keys(change).forEach(elem=>{
      change[elem]();
    });
  }else {
    document.getElementById("formError").classList.add("hidden");
    const data = {
      ...state.form,
      author_email: state.user.author_email,
      author_name: state.user.author_name
    };
    fetch('http://localhost:7777/video-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
     })
    .then(response => response.json())
    .then(request => {
      state.requests.push(request);
      addRequestDiv(request);
      showRequests();
    });
  }
};

// to get the request from db
const getRequests = (()=>{
  fetch("http://localhost:7777/video-request")
  .then(response => response.json())
.then(data => {state.requests = data; showRequests()});
})();


// for adding a new request to the div
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


// to show the requests by calling add requersts method
const showRequests =  async (request_by = 'new_first',e = null)=>{
  const requestsDiv = document.getElementById("listOfRequests");
  const top_voted = document.getElementById("top_voted");
  const new_first = document.getElementById("new_first");
  await filteredResuls(e);
  requestsDiv.innerHTML = "";
  addRequests(request_by,state.filteredRequests);
};


// for sorting the requests
const sortRequests = (request_by)=>{
  request_by === 'top_voted' ?  showRequests("top_voted") :  showRequests();
};


// the request to the database for the asked word 
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


// devounceing for the search input
const debounce = function(func, delay){
  let debounceTimer 
return function(...args){
const context = this;
clearTimeout(debounceTimer) 
    debounceTimer = setTimeout(() => func(...args), delay);
}
}

// search results
const searchResults =  debounce((e)=>{
showRequests(state.sort_type,e);
}, 500);



// for down/up votes

const updateVote = (e, id, vote_type)=>{
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



// the div which will be added for each request 
const addRequestDiv = (request)=>{
  const htmlContent =  `<div class='card mb-3'><div class='card-body d-flex justify-content-between flex-row'><div class='d-flex flex-column'><h3>${request.topic_title}</h3><p class='text-muted mb-2'>${request.topic_details}</p><p class='mb-0 text-muted'><strong>Expected results:</strong>${request.expected_result}</p></div><div class='d-flex flex-column text-center'><a class='btn btn-link' onClick='updateVote(event, "${request._id}", "ups")'>🔺</a><h3>${request.votes.ups - request.votes.downs}</h3><a class='btn btn-link' onClick='updateVote(event, "${request._id}", "downs")'>🔻</a></div></div><div class='card-footer d-flex flex-row justify-content-between'><div><span class='text-info'>${request.status}</span>&bullet; added by <strong>${request.author_name}</strong> on<strong>${request.submit_date}</strong></div><div class='d-flex justify-content-center flex-column 408ml-auto mr-2'><div class='badge badge-success'>${request.target_level}</div></div></div></div>`;
  const requestsDiv = document.getElementById("listOfRequests");
  const requestNode = document.createElement("div");
  requestNode.innerHTML = htmlContent;
  requestsDiv.prepend(requestNode);
};


// Validation : 
    // Methods: 
const required = (input)=>{
  if (input || false){
      return false;
  }else {
      return "Required";
  }
};

const MaxLength = (input, max = 100)=>{
  if ((input.length < max)){
      return false;
  }else {
      return "Maximum Length is  " + max + " digit"
  }
};
// Checker: 
const checkValidation = (input,arrayOfChecks,Handler,type = "form")=>{
  let status = true;
  let errors = []; 
  arrayOfChecks.forEach(check=>{
      const theCheck = check(input);
     if (theCheck !== false){
      errors.push(theCheck)
      status = false;
     }
  });
  const errorDiv = document.getElementById(Handler+"_error");
  if (!status){
    errors.forEach(error=>{
      let errorSpan = `<span class='text-danger d-block'>${error}<span>`
      if (!errorDiv.innerHTML.includes(error)){
        errorDiv.innerHTML += errorSpan;
      }
    })
  }else {
    state.validation[type][Handler] = true;
    errorDiv.innerHTML = "";
  }
};