<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Lab1</title>
    <link rel="stylesheet" href="../css/common.css">
    <link rel="stylesheet" href="../css/result.css">
</head>
<body>
<jsp:include page="header.jsp"/>
<section class="main_content">
    <div class="back">
        <a href=<%=request.getContextPath()%>>
            <button>Назад к форме</button>
        </a>
    </div>
    <jsp:include page="historyTable.jsp"/>
</section>
<jsp:include page="footer.jsp"/>
<script type="text/javascript" src="../js/main.js"></script>
</body>
</html>