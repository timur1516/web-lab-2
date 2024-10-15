import {draw_point, draw_batman, get_click_coordinates} from "./graph.js";

window.addEventListener("load", load_points);

const message_type = Object.freeze({
    OK: 1,
    EMPTY_FIELDS: 2,
    SOME_SERVER_ERROR: 3,
    CHOOSE_R: 4
});

let selected_r = null;
document.getElementById('calculator').addEventListener('click', async function (evt) {
    if (selected_r == null) {
        show_user_message(message_type.CHOOSE_R);
        return;
    }
    let point = get_click_coordinates(evt.clientX, evt.clientY);
    const hit = await check_point(point.x, point.y, selected_r, false);
    if(hit == null) return;
    draw_point(point, hit ? 'green' : 'red');
});

document.getElementsByName("r_radio_input").forEach(radiobutton => {
    radiobutton.addEventListener("change", () => {
        selected_r = radiobutton.value;
        draw_batman(Number(selected_r));
    });
});

let active_x_button = null;
document.getElementsByName("x_button_input").forEach(button => {
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

document.getElementById("form").addEventListener("submit", async () =>{
    await submit_form(event);
});

let prev_point;

async function submit_form(event) {
    event.preventDefault();
    //Извлекаем данные формы
    const formData = new FormData(event.target);
    const x = active_x_button == null ? null : active_x_button.value;
    const y = formData.get("y_text_input");
    const r = formData.get("r_radio_input");
    const hit = await check_point(x, y, r, false);
    if(hit == null) return;

    const animatedDiv = document.getElementById('main_form');
    animatedDiv.classList.add('animate');

    // Удаляем класс после завершения анимации, чтобы можно было запустить снова
    animatedDiv.addEventListener('animationend', function() {
        animatedDiv.classList.remove('animate');
        draw_point({x, y}, hit ? 'green' : 'red');
    }, { once: true });
}

async function check_point(x, y, r, redirect) {
    let result = validate_data(x, y, r);
    show_user_message(result);
    if (result !== message_type.OK) return;

    const queryParams = new URLSearchParams();
    queryParams.append("X", x);
    queryParams.append("Y", y);
    queryParams.append("R", r);
    queryParams.append("redirect", redirect);
    try {
        const response = await fetch(`Controller?${queryParams.toString()}`);
        if (response.redirected ^ redirect) {
            show_user_message(message_type.SOME_SERVER_ERROR);
            return;
        }
        if (redirect){
            window.location.href = response.url;
            return;
        }

        const data = await response.json();
        add_data_to_history(
            data.x,
            data.y,
            data.r,
            data.hit,
            data.calculationTime,
            new Date(data.time[0], data.time[1] - 1, data.time[2], data.time[3], data.time[4], data.time[5])
        );
        return data.hit;
    } catch (e) {
        show_user_message(message_type.SOME_SERVER_ERROR);
    }
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

function load_points() {
    fetch(`Controller?data`)
        .then(response => {
            return response.json();
        })
        .then(data => {
            if (data == null) return;
            data.data.forEach(point => {
                draw_point(point, point.hit ? 'green' : 'red');
            });
        })
        .catch(() => {
            show_user_message(message_type.SOME_SERVER_ERROR);
        });
}