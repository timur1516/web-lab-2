<%@ page import="model.RPoint" %>
<%@ page import="model.DataBean" %>
<%@ page import="java.time.format.DateTimeFormatter" %>
<%@ page import="java.text.DecimalFormat" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Lab1</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
<header>
    <span>Ступин Тимур</span>
    <span>P3208</span>
    <span>Вариант: 229</span>
</header>
<section class="main_content">
    <div class="back">
        <a href=<%=request.getContextPath()%>/index.jsp>
            <button>Назад к форме</button>
        </a>
    </div>
    <div class="history">
        <table id="history_table">
            <thead>
            <tr>
                <th>X</th>
                <th>Y</th>
                <th>R</th>
                <th>Попадание</th>
                <th>Время запроса</th>
                <th>Время выполнения</th>
            </tr>
            </thead>
            <tbody>
            <%
                DataBean data = (DataBean) request.getSession().getAttribute("data");
                if (data == null) {
                    data = new DataBean();
                }
                DecimalFormat df = new DecimalFormat("0.00");
                for (RPoint rPoint : data.getData()) {
            %>
            <tr>
                <td><%=df.format(rPoint.getX())%>
                </td>
                <td><%=df.format(rPoint.getY())%>
                </td>
                <td><%=df.format(rPoint.getR())%>
                </td>
                <td><%=rPoint.isHit() ? "Попал" : "Промазал"%>
                </td>
                <td><%=rPoint.getTime().format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss"))%>
                </td>
                <td><%=rPoint.getCalculationTime()%>мкс
                </td>
            </tr>
            <%}%>
            </tbody>
        </table>
    </div>
</section>
<footer>
    ИТМО 2024
</footer>
<script type="text/javascript" src="main.js"></script>
</body>
</html>