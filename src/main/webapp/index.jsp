<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Lab1</title>
    <link rel="stylesheet" href="style.css">
    <script src="https://www.desmos.com/api/v1.9/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6"></script>
</head>
<body>
<table class="body_table">
    <thead class="header">
    <tr>
        <th colspan="2"><p>Ступин Тимур P3208 Вариант: 229</p></th>
    </tr>
    </thead>
    <tbody class="main">
    <tr>
        <td class="form_cell">
            <p id="error_field"></p>
            <form class="form" onsubmit="submitForm(event)">
                <table class="form_table">
                    <tr>
                        <td class="form_label">X</td>
                        <td>
                            <input type="button" name="x_button_input" id="x_m5" value="-5">
                            <input type="button" name="x_button_input" id="x_m4" value="-4">
                            <input type="button" name="x_button_input" id="x_m3" value="-3">
                            <input type="button" name="x_button_input" id="x_m2" value="-2">
                            <input type="button" name="x_button_input" id="x_m1" value="-1">
                            <input type="button" name="x_button_input" id="x_0" value="0">
                            <input type="button" name="x_button_input" id="x_1" value="1">
                            <input type="button" name="x_button_input" id="x_2" value="2">
                            <input type="button" name="x_button_input" id="x_3" value="3">
                        </td>
                    </tr>
                    <tr>
                        <td class="form_label">Y</td>
                        <td>
                            <input type="number" min="-5" max="5" step="0.01" name="y_text_input" id="y_text"
                                   placeholder="Введите Y"
                                   onpaste="validatePaste(this, event)">
                        </td>
                    </tr>
                    <tr>
                        <td class="form_label">R</td>
                        <td>
                            <input type="radio" name="r_radio_input" id="r_1" value="1">
                            <label for="r_1">1</label><br>
                            <input type="radio" name="r_radio_input" id="r_2" value="2">
                            <label for="r_2">2</label><br>
                            <input type="radio" name="r_radio_input" id="r_3" value="3">
                            <label for="r_3">3</label><br>
                            <input type="radio" name="r_radio_input" id="r_4" value="4">
                            <label for="r_4">4</label><br>
                            <input type="radio" name="r_radio_input" id="r_5" value="5">
                            <label for="r_5">5</label><br>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="3">
                            <input type="submit" id="submit_button" value="Отправить">
                        </td>
                    </tr>
                </table>
            </form>
        </td>
        <td class="graph_cell">
            <div id="calculator" style="width: 600px; height: 600px;"></div>
        </td>
    </tr>
    <tfoot class="footer">
    <tr>
        <td colspan="2"><p>ИТМО 2024</p></td>
    </tr>
    </tfoot>
</table>
<script type="text/javascript" src="main.js"></script>
</body>
</html>