<%@ page import="model.DataBean" %>
<%@ page import="java.text.DecimalFormat" %>
<%@ page import="model.RPoint" %>
<%@ page import="java.util.List" %>
<%@ page import="java.time.format.DateTimeFormatter" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
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
            System.out.println(data);
            if (data == null) {
                data = new DataBean();
            }
            DecimalFormat df = new DecimalFormat("0.00");
            List<RPoint> arr = data.getData();
            for (int i = arr.size() - 1; i >= 0; i--) {
        %>
        <tr>
            <td><%=df.format(arr.get(i).getX())%>
            </td>
            <td><%=df.format(arr.get(i).getY())%>
            </td>
            <td><%=df.format(arr.get(i).getR())%>
            </td>
            <td><%=arr.get(i).isHit() ? "Попал" : "Промазал"%>
            </td>
            <td><%=arr.get(i).getTime().format(DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss"))%>
            </td>
            <td><%=arr.get(i).getCalculationTime()%>мкс
            </td>
        </tr>
        <%}%>
        </tbody>
    </table>
</div>