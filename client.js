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
  }
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
.then(data => console.log(data));
}


