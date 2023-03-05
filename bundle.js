/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/styles/style.css":
/*!******************************!*\
  !*** ./src/styles/style.css ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/components/API.js":
/*!*******************************!*\
  !*** ./src/components/API.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TOKEN_KEY": () => (/* binding */ TOKEN_KEY),
/* harmony export */   "api": () => (/* binding */ api)
/* harmony export */ });
const TOKEN_KEY = 'token';

class ApiError extends Error {
    constructor({message, data, status}) {
        super(message);
        this.status = status;
        this.data = data; 
    }
}

class API {
    constructor() {
        this.baseURL = 'https://byte-tasks.herokuapp.com/api';
        this.headers = {
            Authorization: null,
            'Content-Type': 'application/json',
        };
    }

    async handleErrors(response) {
        const {ok, status, statusText} = response;
        if(!ok){
            /* throw new Error(`Response on ${url} failed with status ${status}`) */
            throw new ApiError({
                message: "Error!",
                data: await response.json(),
                status: status,
            })
        }
    }

    async register(data) {
        const response = await fetch(`${this.baseURL}/auth/register`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(data),
        });

        await this.handleErrors(response);

        const registeredUser = await response.json();
    
        return registeredUser;
    }

    async login(data) {
        const response = await fetch(`${this.baseURL}/auth/login/`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(data),
        })

        await this.handleErrors(response);

        const {token} = await response.json();
    
        this.headers.Authorization = `Bearer ${token}`;
        localStorage.setItem(TOKEN_KEY, token);
    
    }
    
    async getSelf() {
        const response = await fetch(`${this.baseURL}/auth/user/self`, {
            method: 'GET',
            headers: this.headers,
        })
        await this.handleErrors(response)

        const user = await response.json()
        return user;
    }

    isLoggedIn() {
        return Boolean(localStorage.getItem(TOKEN_KEY))
    }

    autoLogin() {
        const localToken = localStorage.getItem(TOKEN_KEY);
        this.headers.Authorization = `Bearer ${localToken}`;

        return this.getSelf()
    }

    async createTask(data) {
        const res = await fetch(`${this.baseURL}/task`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: this.headers,
        });
        await this.handleErrors(res);

        return res.json();
    }

    async getAllTasks() {
        const response = await fetch(`${this.baseURL}/task`, {
          method: "GET",
          headers: this.headers,
        });
    
       await this.handleErrors(response);
        
        return await response.json();
      }

    async editTask(id, data) {
        const res = await fetch(`${this.baseURL}/task/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: this.headers,
        });
        await this.handleErrors(res);

        return res.json();
    }

    async deleteTask(id, data) {
        const res = await fetch(`${this.baseURL}/task/${id}`, {
            method: 'DELETE',
            headers: this.headers,
        });
        await this.handleErrors(res);

        return res;
    }

    logout() {
        localStorage.removeItem(TOKEN_KEY);
    }
}




const api = new API();





/***/ }),

/***/ "./src/components/AUTH.js":
/*!********************************!*\
  !*** ./src/components/AUTH.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Auth": () => (/* binding */ Auth)
/* harmony export */ });
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./API */ "./src/components/API.js");
/* harmony import */ var _Input__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Input */ "./src/components/Input.js");
/* harmony import */ var _Form__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Form */ "./src/components/Form.js");
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../index */ "./src/index.js");
/* harmony import */ var _configInputs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./configInputs */ "./src/components/configInputs.js");






const getLoginForm = (onSuccess) => 
    new _Form__WEBPACK_IMPORTED_MODULE_2__.Form({
    inputs: _configInputs__WEBPACK_IMPORTED_MODULE_4__.loginConfig.map(input => new _Input__WEBPACK_IMPORTED_MODULE_1__.Input(input)),
    submitBtnText: 'Submit',
    title: 'LOGIN',
    onSubmit: async (data) => {
        await _API__WEBPACK_IMPORTED_MODULE_0__.api.login(data);
        onSuccess()
    },
    })

const getRegisterForm =(onSuccess) => 
    new _Form__WEBPACK_IMPORTED_MODULE_2__.Form({
    inputs: _configInputs__WEBPACK_IMPORTED_MODULE_4__.registerConfig.map(input => new _Input__WEBPACK_IMPORTED_MODULE_1__.Input(input)),
    submitBtnText: 'Submit',
    title: 'REGISTER',
    onSubmit: async (data) => {
        await _API__WEBPACK_IMPORTED_MODULE_0__.api.register(data);
        onSuccess()
    },
});


class Auth {
    constructor({appContainer, onLoginSuccess}) {
        this.appContainer = appContainer;

        this.formContainer = document.createElement('div');
        this.switchBtn = document.createElement('button');
        this.logoutBtn = document.createElement('button');
        this.avatar = document.createElement('span');

        this.form = null;
        this.user = null;
        this.isLogin = true // login | register

        this.loginForm = getLoginForm(onLoginSuccess);
        this.registerForm = getRegisterForm(this.switchForms.bind(this));

        this.createFormContainer();
        this.createHeaderControls();
    }

    createFormContainer() {
        this.formContainer.classList.add('auth-form');
        this.switchBtn.classList.add('text-registration');
        this.switchBtn.innerText = 'REGISTER';
        this.formContainer.prepend(this.switchBtn);

        this.switchBtn.addEventListener('click', () => {
            this.switchForms()
        })
    }

    createHeaderControls(){
        this.logoutBtn.classList.add('button', 'button_text');
        this.logoutBtn.innerText = 'Logout';
        this.avatar.classList.add('avatar');

        this.logoutBtn.addEventListener('click', () => {
            this.logout();
            _API__WEBPACK_IMPORTED_MODULE_0__.api.logout();
            _index__WEBPACK_IMPORTED_MODULE_3__.taskBoard.logout()
        });

    }

    renderHeaderControls(){
        const controlContainer = document.getElementById('header-controls');
        this.avatar.innerText = this.user.name[0];

        controlContainer.append(this.logoutBtn, this.avatar)        
    }

    renderAuthForm(){
        if(this.form) {
            this.form.form.remove()
        }

        if(this.isLogin){
            this.form = this.loginForm;
        }else {
            this.form = this.registerForm;
        }
       
        this.form.render(this.formContainer)
        this.appContainer.append(this.formContainer) 

        }

    switchForms(){
        this.isLogin = !this.isLogin;

        if(this.isLogin){
            this.switchBtn.innerText = 'REGISTER';
        }else {
            this.switchBtn.innerText = 'LOGIN'
        }
        
        this.renderAuthForm()
    }

    logout(){
        this.avatar.remove();
        this.logoutBtn.remove();
        this.appContainer.innerHTML = '';
        this.isLogin = true;

        this.renderAuthForm();

    }
}


/***/ }),

/***/ "./src/components/Form.js":
/*!********************************!*\
  !*** ./src/components/Form.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Form": () => (/* binding */ Form)
/* harmony export */ });

class Form {
    constructor (options){
        
        const{inputs, changeBtnText, title} = options;

        this.inputs = inputs;
        this.title = title;
        this.changeBtnText = changeBtnText;
        
        this.form = document.createElement('form');
        this.createForm(options)
        
    }

    static getFormValue (inputs) {
        return inputs.reduce((values, input) =>{
            values[input.name] = input.value;

            return values;
        }, {}); 
    }

        createForm({onSubmit, registerText, submitBtnText, title}){
            this.submitBtn = document.createElement('button');
            registerText = document.createElement('h3');
            this.submitBtnText = submitBtnText;

            this.form.classList.add('form');
            this.submitBtn.type = 'submit';
            this.submitBtn.classList.add('button', 'button_submit');
            registerText.classList.add('button', 'button_text');
    
            registerText.innerText = title;
            this.submitBtn.innerText = submitBtnText;
            this.form.append(registerText);

            this.form.addEventListener('submit', async (e) =>{
                e.preventDefault();

                const formValues = Form.getFormValue(this.inputs);
                
                this.submitBtn.setAttribute('disabled', '');
                try {
                    await onSubmit(formValues, e)
                } catch (err) {
                    err.data.details.forEach(({path, message}) =>{
                        const erroredInput = this.inputs.find((input) => {
                            return input.name === path[0];
                        });
                        erroredInput.updateErrorMessage(message)
                    })
                }
                this.submitBtn.removeAttribute('disabled');
                    
            })

            this.inputs.forEach((input) =>{
                this.form.append(input.control)
            })
            
            this.form.append(this.submitBtn);
            
        }
        render(container) {
            container.append(this.form);

            return container
        }
        
    }

   
   





/***/ }),

/***/ "./src/components/Input.js":
/*!*********************************!*\
  !*** ./src/components/Input.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Input": () => (/* binding */ Input)
/* harmony export */ });
class Input {
    constructor (options){
        const{name, label, placeholder, type, onInput, onChange} = options;

        this.element = document.createElement('input');
        this.errorMessage = document.createElement('span');

        this.value = this.element.value;
        this.name = name;
        this.label = label;
        this.element.name = name;
        this.element.type = type;
        this.element.placeholder = placeholder;
        this.element.label = label;

        this.value = this.element.value;

        this.control = this.createControl(onInput, onChange);

        }

        createControl(onInput, onChange){
            const div = document.createElement('div');
            const labelInput = document.createElement('label');
            const inputId = `_${this.name}`;

            div.classList.add('input-container');
            this.errorMessage.classList.add('input-error');
            this.element.classList.add('input_name');

            this.element.id = inputId;

            labelInput.setAttribute('for', this.element.id);
            labelInput.innerText = this.label;

            div.append(labelInput, this.element, this.errorMessage);
            
            this.element.addEventListener('input', (e) =>{
                this.value = e.target.value;
                this.updateErrorMessage('');
                if(onInput){
                onInput(e);
                };
            })

            if(onChange){
                this.element.addEventListener('change', (e) =>{
                    onChange(e);
                });
            }
            
            return div
        }

        updateErrorMessage(message) {
            this.errorMessage.innerText = message;
        }
        

    render(div){
        this.control.append(this.div) 
    }
    
}







/***/ }),

/***/ "./src/components/Task.js":
/*!********************************!*\
  !*** ./src/components/Task.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Task": () => (/* binding */ Task)
/* harmony export */ });
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./API */ "./src/components/API.js");


class Task {
    constructor({
       name,
       description,
        timeTracked,
        isActive,
        isFinished,
        _id,
        createdAt,
    }){
        this.name = name;
        this.description = description;
        this.timeTracked = timeTracked;
        this.isActive = isActive;
        this.isFinished = isFinished;
        this.createdAt = new Date(createdAt);

        this.id = _id;

        this.taskCard = document.createElement('div');//глобальная карточка, которая содержит все остальное.
        this.taskContent = document.createElement('div');
        this.deleteBtn = document.createElement('button');// кнопка, которая удаляет карточку(крестик);
        this.timerBtn = document.createElement('button'); //кнопка, которая работает с таймером;
        this.timeTrackedElement = document.createElement('span');// элемент, содержащи колличество затреканого времени;
        this.markAsDoneBtn = document.createElement('button');
        this.restartBtn = document.createElement('button'); //кнопка, которая отмечает задачу как сделаную или начать віполнять
        this.timeTrackedIntervalId = null; // на фротнэнде отвечает за запуск секундомера
    }

    renderTaskCard(container) {
        const titleElem = document.createElement('h3');
        const descriptionElem = document.createElement('p');
        const timeTracker = document.createElement('div');//кнопка + трєкер
        const dateElement = document.createElement('p');

        titleElem.classList.add('task-title');
        descriptionElem.classList.add('task-description');
        timeTracker.classList.add('time-tracker');
        dateElement.classList.add('task-date');

        this.taskCard.classList.add('task-card');
        this.deleteBtn.classList.add('task-delete-btn');
        this.timerBtn.classList.add('timer-btn');
        this.markAsDoneBtn.classList.add('button', 'button_task', 'btn-small');
        this.restartBtn.classList.add('button', 'button_task', 'btn-small', 'disabled-btn');

        if(this.isFinished){

            this.timerBtn.setAttribute('disabled', '');
            this.taskCard.classList.add('task-finished');
            this.restartBtn.innerText = 'Restart';
            
        }else{
            this.timerBtn.classList.add(
                this.isActive ? 'timer-btn-stop' : 'timer-btn-play'
            );
            this.markAsDoneBtn.innerText = 'Mark as done';
            
        }

        titleElem.innerText = this.name;
        descriptionElem.innerText = this.description;

        dateElement.innerText = Task.getFormattedDate(this.createdAt);
        this.timeTrackedElement.innerText = Task.getFormattedTimeTracked(this.timeTracked);
        this.deleteBtn.innerHTML = '<i class="fas fa-times"></i>';

        if(this.isActive){
            this.startTracker();
            this.timerBtn.innerHTML = `<i class="fas fa-pause"></i>`;
        }else{
            this.timerBtn.innerHTML = `<i class="fas fa-play"></i>`; 
        }

        timeTracker.append(this.timerBtn, this.timeTrackedElement);

        this.taskContent.append(
            titleElem,
            descriptionElem,
            timeTracker,
            dateElement,
            this.deleteBtn,
        )

        this.taskCard.append(
            this.taskContent,
            this.markAsDoneBtn,
            this.restartBtn,
            
        );

        container.append(this.taskCard);

        this.timerBtn.addEventListener('click', this.toggleTimeTracker);
        this.deleteBtn.addEventListener('click', this.removeTaskCard);
        this.restartBtn.addEventListener('click', this.restartTracker);
        this.markAsDoneBtn.addEventListener('click', this.toggleTaskFinished);
      
        console.log(this.isActive) 
        console.log('Task5', this.isFinished)
        
    }
  
    removeTaskCard =  async () => {
        await _API__WEBPACK_IMPORTED_MODULE_0__.api.deleteTask(this.id);
        this.taskCard.remove()
    };

    toggleTimeTracker = async () => {
        this.isActive = !this.isActive;

        await _API__WEBPACK_IMPORTED_MODULE_0__.api.editTask(this.id, {isActive: this.isActive});

        if(this.isActive) {
            this.startTracker();
        } else {
            this.stopTracker();
        }

    };

    toggleTaskFinished = async () => {
        this.isFinished = !this.isFinished;

        await _API__WEBPACK_IMPORTED_MODULE_0__.api.editTask(this.id, { isFinished: this.isFinished});

        this.taskContent.classList.toggle('task-finished');

        if(this.isFinished){
            this.timerBtn.setAttribute('disabled', '');
            this.markAsDoneBtn.classList.remove('active-btn') 
            this.markAsDoneBtn.classList.add('disabled-btn') 
            this.restartBtn.classList.remove('disabled-btn')  
            this.restartBtn.classList.add('active-btn')  
            this.restartBtn.innerText = 'Restart'        
            this.stopTracker();

        } else {
            clearInterval(this.timeTrackedIntervalId);
            this.timerBtn.removeAttribute('disabled');
            this.markAsDoneBtn.classList.remove('disabled-btn') 
            this.markAsDoneBtn.classList.add('active-btn') 
            this.markAsDoneBtn.innerText = 'Mark as done';
            this.restartBtn.classList.remove('active-btn')  
            this.restartBtn.classList.add('disabled-btn') 
            
            this.startTracker()
        }
    };

    

    startTracker(){

        this.timerBtn.classList.remove('timer-btn-play');
        this.timerBtn.classList.add('timer-btn-stop');
        this.timerBtn.innerHTML = `<i class="fas fa-pause"></i>`;

        if(this.timeTrackedIntervalId == null){
            this.timeTrackedIntervalId = setInterval(() => {
                this.timeTracked += 1000;
                this.updateTimeTracker();
            }, 1000);
        } 
    }

    stopTracker(){
        this.timerBtn.classList.remove('timer-btn-stop');
        this.timerBtn.classList.add('timer-btn-play');
        this.timerBtn.innerHTML = `<i class="fas fa-play"></i>`;
        
        clearInterval(this.timeTrackedIntervalId);
        this.timeTrackedIntervalId = null;
    }

    restartTracker = async () =>{
        
        this.timeTracked = 0;
        this.updateTimeTracker()
        this.isActive = false;
        this.isFinished = false;

        await _API__WEBPACK_IMPORTED_MODULE_0__.api.editTask(this.id, { isFinished: this.isFinished});
        await _API__WEBPACK_IMPORTED_MODULE_0__.api.editTask(this.id, {isActive: this.isActive});
        await _API__WEBPACK_IMPORTED_MODULE_0__.api.editTask(this.id, {timeTracked: this.timeTracked});

        this.markAsDoneBtn.classList.remove('disabled-btn') 
        this.markAsDoneBtn.classList.add('active-btn') 
        this.restartBtn.classList.remove('active-btn')  
        this.restartBtn.classList.add('disabled-btn') 
        this.timerBtn.removeAttribute('disabled');
        this.taskContent.classList.toggle('task-finished');

        this.timerBtn.classList.add('timer-btn-play');
        this.timerBtn.innerHTML = `<i class="fas fa-play"></i>`;
         /* this.isActive = !this.isActive; */
        console.log(this.isActive) 
        console.log('Task5', this.isFinished)
    }

    updateTimeTracker(){
        const formatted = Task.getFormattedTimeTracked(this.timeTracked);
        this.timeTrackedElement.innerText = formatted;

    }

    

    static getFormattedDate(d) {
        const date = d.toLocaleDateString();
        const time = d.toLocaleTimeString();

        return `${date} ${time}`;
    }

    static addOptionalZero(value) {
        return value > 9 ? value : `0${value}`;
    }

    static getFormattedTimeTracked(timeTracked) {
        const timeTrackedSeconds = Math.floor(timeTracked / 1000);
        const hours =  Math.floor(timeTrackedSeconds / 3600);
        const minutes =  Math.floor((timeTrackedSeconds  - hours * 3600 )/ 60);
        const seconds = timeTrackedSeconds - hours * 3600 - minutes * 60;

        return `${this.addOptionalZero(hours)}:${this.addOptionalZero(minutes)}:${this.addOptionalZero(seconds)}`;
    }


}

/***/ }),

/***/ "./src/components/TaskBoard.js":
/*!*************************************!*\
  !*** ./src/components/TaskBoard.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TaskBoard": () => (/* binding */ TaskBoard)
/* harmony export */ });
/* harmony import */ var _Input__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Input */ "./src/components/Input.js");
/* harmony import */ var _Form__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Form */ "./src/components/Form.js");
/* harmony import */ var _Task__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Task */ "./src/components/Task.js");
/* harmony import */ var _configInputs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./configInputs */ "./src/components/configInputs.js");
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./API */ "./src/components/API.js");






const getTaskForm = (onTaskCreated) =>
    new _Form__WEBPACK_IMPORTED_MODULE_1__.Form({
        inputs:  _configInputs__WEBPACK_IMPORTED_MODULE_3__.taskBoardConfig.map(input => new _Input__WEBPACK_IMPORTED_MODULE_0__.Input(input)),
        title: 'ADD TASK',
        submitBtnText: 'Add',
        onSubmit: async (data) => {
            
            const createdTask = await _API__WEBPACK_IMPORTED_MODULE_4__.api.createTask(data);
            onTaskCreated(createdTask);
        },
    })

class TaskBoard {
    constructor({appContainer}) {
       this.appContainer = appContainer;
       this.taskForm =  getTaskForm(this.addTask.bind(this))
       this.tasksContainer = document.createElement('div')//содержит карточки заданий
    }
    renderLayout() {
        const board = document.createElement('div'); // cодержит все карточки и taskForm
        const formContainer = document.createElement('div');//контейнер для формы

        board.classList.add('board');
        formContainer.classList.add('task-form');
        this.tasksContainer.classList.add('task-cards');

        board.append(formContainer, this.tasksContainer);
        this.taskForm.render(formContainer);

        this.appContainer.append(board)
    }

    addTask(taskData) {
        const task = new _Task__WEBPACK_IMPORTED_MODULE_2__.Task(taskData);

        task.renderTaskCard(this.tasksContainer)

    }

    logout() {
        this.tasksContainer.innerText = '';
    }

}
    

/***/ }),

/***/ "./src/components/configInputs.js":
/*!****************************************!*\
  !*** ./src/components/configInputs.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "loginConfig": () => (/* binding */ loginConfig),
/* harmony export */   "registerConfig": () => (/* binding */ registerConfig),
/* harmony export */   "taskBoardConfig": () => (/* binding */ taskBoardConfig)
/* harmony export */ });
const loginConfig = [
    {
        name: 'email', 
        placeholder: 'Enter your Email',
        type: 'email',
        label: 'Email', 

    },
    {
        name: 'password', 
        placeholder: 'Enter your Password',
        type: 'password',
        label:  'Password',

    }
   
]

const registerConfig = [
    {
        name: 'email', 
        placeholder: 'Enter your Email',
        type: 'email',
        label: 'Email', 

    },
    {
        name: 'name', 
        placeholder: 'Enter your Name',
        type: 'text',  
        label:  'Name',

    },
    {
        name: 'password', 
        placeholder: 'Enter your Password',
        type: 'password',
        label:  'Password',

    },

]

const taskBoardConfig = [
    {
        name: 'name', 
        placeholder: 'Task name',
        type: 'text',
        label: 'Name', 

    },
    {
        name: 'description', 
        placeholder: 'Task description',
        type: 'text',
        label:  'Description',

    }
   
]




/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "taskBoard": () => (/* binding */ taskBoard)
/* harmony export */ });
/* harmony import */ var _components_Input__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/Input */ "./src/components/Input.js");
/* harmony import */ var _components_Form__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/Form */ "./src/components/Form.js");
/* harmony import */ var _components_AUTH__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/AUTH */ "./src/components/AUTH.js");
/* harmony import */ var _components_TaskBoard__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/TaskBoard */ "./src/components/TaskBoard.js");
/* harmony import */ var _components_API__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/API */ "./src/components/API.js");
/* harmony import */ var _styles_style_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./styles/style.css */ "./src/styles/style.css");








const appContainer = document.getElementById('app');

const onLoginSuccess = async() => {
    appContainer.innerHTML = '';
    const user = await _components_API__WEBPACK_IMPORTED_MODULE_4__.api.getSelf();
    renderAppLayout(user);
}

const auth = new _components_AUTH__WEBPACK_IMPORTED_MODULE_2__.Auth({
    appContainer,
    onLoginSuccess,
})

const taskBoard = new _components_TaskBoard__WEBPACK_IMPORTED_MODULE_3__.TaskBoard ({
    appContainer
})

const renderAppLayout = async (user) => {
auth.user = user;
auth.renderHeaderControls();
taskBoard.renderLayout();
const taskList = await _components_API__WEBPACK_IMPORTED_MODULE_4__.api.getAllTasks();

taskList.forEach((task) => taskBoard.addTask(task))

}

const init = async () => {
    const isLoggedIn = _components_API__WEBPACK_IMPORTED_MODULE_4__.api.isLoggedIn();
  
    if (!isLoggedIn) {
      auth.renderAuthForm();
    } else {
      const user = await _components_API__WEBPACK_IMPORTED_MODULE_4__.api.autoLogin();
      renderAppLayout(user);
    }
  };
  
  init();













/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;
//# sourceMappingURL=bundle.js.map