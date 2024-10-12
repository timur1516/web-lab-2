import {drawPoint, drawBatman, getClickCoordinates} from "./graph.js";

window.addEventListener("load", loadPoints);
// Подобие enum для обработки исключений и вывода сообщений
const message_type = Object.freeze({
    OK: 1,
    EMPTY_FIELDS: 2,
    SOME_SERVER_ERROR: 3,
    CHOOSE_R: 4
});

let selectedR = null;

document.getElementById('calculator').addEventListener('click', function (evt) {
    if (selectedR == null) {
        show_user_message(message_type.CHOOSE_R);
        return;
    }
    let point = getClickCoordinates(evt.clientX, evt.clientY);
    check_point(point.x, point.y, selectedR, false, (hit) =>{
        drawPoint(point, hit ? 'green' : 'red');
    });
});

const r_radiobuttons = document.getElementsByName("r_radio_input");
r_radiobuttons.forEach(radiobutton => {
    radiobutton.addEventListener("change", () => {
        selectedR = radiobutton.value;
        drawBatman(Number(selectedR));
    });
});

let active_x_button = null;
const x_buttons = document.getElementsByName("x_button_input");
x_buttons.forEach(button => {
    button.addEventListener("click", () => {
        if (button === active_x_button) {
            active_x_button.style.borderColor = 'black';
            active_x_button = null;
        } else {
            if (active_x_button !== null) active_x_button.style.borderColor = 'black';
            active_x_button = button;
            active_x_button.style.borderColor = 'red';
        }
    })
});

document.getElementById("form").addEventListener("submit", () => submitForm(event));
//Функция отправки запроса на сервер и получения ответа
function submitForm(event) {
    event.preventDefault();
    //Извлекаем данные формы
    const formData = new FormData(event.target);
    const x = active_x_button == null ? null : active_x_button.value;
    const y = formData.get("y_text_input");
    const r = formData.get("r_radio_input");
    check_point(x, y, r, true);
}

function check_point(x, y, r, redirect, callback) {
    let result = validate_data(x, y, r);
    show_user_message(result);
    if (result !== message_type.OK) return;

    const queryParams = new URLSearchParams();
    queryParams.append("X", x);
    queryParams.append("Y", y);
    queryParams.append("R", r);
    queryParams.append("redirect", redirect);

    fetch(`MyMVC?${queryParams.toString()}`)
        .then(response => {
            if (response.redirected) {
                if(redirect) window.location.href = response.url;
                else{
                    throw Error('Redirect was not expected');
                }
            }
            return response.json();
        })
        .then(data => {
            add_data_to_history(
                data.x,
                data.y,
                data.r,
                data.hit,
                data.calculationTime,
                new Date(data.time[0], data.time[1] - 1, data.time[2], data.time[3], data.time[4], data.time[5]));
            callback(data.hit);
        })
        .catch(() => {
            show_user_message(message_type.SOME_SERVER_ERROR);
        });
}

function add_data_to_history(x, y, r, hit, execution_time, real_time) {
    let table_ref = document.querySelector("#history_table tbody");
    let newRow = table_ref.insertRow(0);
    [
        x.toFixed(2).toString(),
        y.toFixed(2).toString(),
        r.toFixed(2).toString(),
        hit ? "Попал" : "Промазал",
        `${real_time.toLocaleDateString()} ${real_time.toLocaleTimeString()}`,
        execution_time.toString() + "мкс"
    ].forEach(value => newRow.insertCell().textContent = value);
}

// Метод генерации сообщений пользователю
function show_user_message(message) {
    let error_field = document.getElementById("error_field");
    error_field.style.visibility = "visible";
    switch (message) {
        case message_type.EMPTY_FIELDS:
            error_field.textContent = "Пожалуйста, заполните все поля!";
            break;
        case message_type.SOME_SERVER_ERROR:
            error_field.textContent = "Упс... Произошла ошибка при работе с сервером. Пожалуйста, повторите попытку позже.";
            break;
        case message_type.CHOOSE_R:
            error_field.textContent = "Невозможно определить координаты точки! Пожалуйста, выберете R!";
            break;
        default:
            error_field.style.visibility = "hidden";
            error_field.textContent = "";
            break;
    }
}

// Функция валидации данных формы
function validate_data(x, y, r) {
    if (x == null || y == null || r == null || y === "") return message_type.EMPTY_FIELDS;
    return message_type.OK;
}

function loadPoints(){
    fetch(`MyMVC?data`)
        .then(response => {
            return response.json();
        })
        .then(data => {
            if(data == null) return;
            data.data.forEach(point => {
                drawPoint(point, point.hit ? 'green' : 'red');
            });
        })
        .catch(() => {
            show_user_message(message_type.SOME_SERVER_ERROR);
        });
}