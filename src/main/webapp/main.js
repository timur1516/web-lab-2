// Подобие enum для обработки исключений и вывода сообщений
const message_type = Object.freeze({
    OK: 1,
    EMPTY_FIELDS: 2,
    SOME_SERVER_ERROR: 3,
    CHOOSE_R: 4
});

let elt = document.getElementById('calculator');
let calculator = Desmos.GraphingCalculator(elt, {
    keypad: false,
    expressions: false,
    settingsMenu: false,
    lockViewport: true,
    zoomFit: true,
    pointsOfInterest: false,
    trace: false,
    xAxisStep: 1,
    yAxisStep: 1
});

let selectedR = null;

elt.addEventListener('click', function (evt) {
    if(selectedR == null){
        show_user_message(message_type.CHOOSE_R);
        return;
    }
    let calculatorRect = elt.getBoundingClientRect();
    let {x, y} = calculator.pixelsToMath({
        x: evt.clientX - calculatorRect.left,
        y: evt.clientY - calculatorRect.top
    });
    checkPoint(x, y, selectedR, false).then(response =>{
        if(response != null){
            calculator.setExpression({
                id: 'point',
                latex: `(${x}, ${y})`, // Задание координат точки
                color: Desmos.Colors.RED // Цвет точки
            });
        }
    });
});

function drawBatman(r) {
    let k = 49 / r
    calculator.setExpression({
        id: 'k',
        latex: 'k=' + k.toString()
    });
    calculator.setExpression({
        id: 's',
        latex: '\\s(x)=\\sqrt{(\\abs(x*k/7))/(x*k/7)}',
        hidden: true
    });
    calculator.setExpression({
        id: 'graph2',
        latex: '(x*k/49)^2*s(\\abs(x*k/7)-3)+(y*k/21)^2*s(y*k/7+3*\\sqrt{33}/7)-1=0',
        color: 'black'
    });
    calculator.setExpression({
        id: 'graph3',
        latex: '\\abs(x*k/14)-((3*\\sqrt{33}-7)/112)*(x*k/7)^2-3+\\sqrt{1-(\\abs(\\abs(x*k/7)-2)-1)^2}-y*k/7=0',
        color: 'black'
    });
    calculator.setExpression({
        id: 'graph4',
        latex: '9*s((1-\\abs(x*k/7))*(\\abs(x*k/7)-.75))-8*\\abs(x*k/7)-y*k/7=0',
        color: 'black'
    });
    calculator.setExpression({
        id: 'graph5',
        latex: '3*\\abs(x*k/7)+.75*s((.75-\\abs(x*k/7))*(\\abs(x*k/7)-.5))-y*k/7=0',
        color: 'black'
    });
    calculator.setExpression({
        id: 'graph6',
        latex: '2.25*s((.5-x*k/7)*(x*k/7+.5))-y*k/7=0',
        color: 'black'
    });
    calculator.setExpression({
        id: 'graph7',
        latex: '6*\\sqrt{10}/7+(1.5-.5*\\abs(x*k/7))*s(\\abs(x*k/7)-1)-6*\\sqrt{10}/14*\\sqrt{4-(\\abs(x*k/7)-1)^2}-y*k/7=0',
        color: 'black'
    });

    calculator.setMathBounds({
        left: -r - 1,
        right: r + 1,
        bottom: -r - 1,
        top: r + 1
    });
}

const r_radiobuttons = document.getElementsByName("r_radio_input");
r_radiobuttons.forEach(radiobutton => {
    radiobutton.addEventListener("change", () => {
        selectedR = radiobutton.value;
        drawBatman(Number(selectedR));
    });
});

let active_x_button = null;
// Бинарный ввод X ;)
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

//Функция отправки запроса на сервер и получения ответа
function submitForm(event) {
    event.preventDefault();
    //Извлекаем данные формы
    const formData = new FormData(event.target);
    const x = active_x_button == null ? null : active_x_button.value;
    const y = formData.get("y_text_input");
    const r = formData.get("r_radio_input");
    checkPoint(x, y, r, true);
}

async function checkPoint(x, y, r, redirect){
    //Проводим валидацию
    let result = validate_data(x, y, r);
    show_user_message(result);
    if (result !== message_type.OK) return null;

    //Выполняем запрос
    const queryParams = new URLSearchParams();
    queryParams.append("X", x);
    queryParams.append("Y", y);
    queryParams.append("R", r);
    queryParams.append("redirect", redirect);
    try {
        let response = await fetch(`MyMVC?${queryParams.toString()}`);
        if (!response.ok) {
            show_user_message(message_type.SOME_SERVER_ERROR);
            return null;
        }
        if (response.redirected) {
            window.location.href = response.url;
        }
        let responseData = await response.json();
        return responseData.hit;
    } catch (error){
        show_user_message(message_type.SOME_SERVER_ERROR);
        return null;
    }
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