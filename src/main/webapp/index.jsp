<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Lab1</title>
    <link rel="stylesheet" href="css/common.css">
    <link rel="stylesheet" href="css/form.css">
    <script src="https://www.desmos.com/api/v1.9/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6"></script>
    <script type="module" src="js/main.js"></script>
</head>
<body>
<jsp:include page="jsp/header.jsp"/>
<section class="main_content">
    <p id="error_field"></p>
    <div class="main_form">
        <form class="form" id="form">
            <div class="form_input">
                <p class="form_input x_label">X</p>
                <div class="form_input x_button">
                    <input type="button" name="x_button_input" id="x_-5" value="-5">
                    <input type="button" name="x_button_input" id="x_-4" value="-4">
                    <input type="button" name="x_button_input" id="x_-3" value="-3">
                    <input type="button" name="x_button_input" id="x_-2" value="-2">
                    <input type="button" name="x_button_input" id="x_-1" value="-1">
                    <input type="button" name="x_button_input" id="x_0" value="0">
                    <input type="button" name="x_button_input" id="x_1" value="1">
                    <input type="button" name="x_button_input" id="x_2" value="2">
                    <input type="button" name="x_button_input" id="x_3" value="3">
                </div>
            </div>
            <div class="form_input">
                <p class="form_input y_label">Y</p>
                <div class="form_input y_text">
                    <input type="number" min="-5" max="5" step="0.01" name="y_text_input" placeholder="Введите Y">
                </div>
            </div>
            <div class="form_input">
                <p class="form_input r_label">R</p>
                <div class="form_input r_radio">
                    <input type="radio" name="r_radio_input" id="r_1" value="1">
                    <label for="r_1">1</label>
                    <input type="radio" name="r_radio_input" id="r_2" value="2">
                    <label for="r_2">2</label>
                    <input type="radio" name="r_radio_input" id="r_3" value="3">
                    <label for="r_3">3</label>
                    <input type="radio" name="r_radio_input" id="r_4" value="4">
                    <label for="r_4">4</label>
                    <input type="radio" name="r_radio_input" id="r_5" value="5">
                    <label for="r_5">5</label>
                </div>
            </div>
            <div class="form_input">
                <input type="submit" id="submit_button" value="Отправить">
            </div>
        </form>
        <div id="calculator"></div>
    </div>
    <jsp:include page="jsp/historyTable.jsp"/>
</section>
<jsp:include page="jsp/footer.jsp"/>
</body>
</html>