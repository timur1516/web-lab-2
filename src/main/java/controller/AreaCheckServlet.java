package controller;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;
import model.DataBean;
import model.RPoint;

import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDateTime;

@WebServlet("/AreaCheck")
public class AreaCheckServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        RPoint rPoint = new RPoint();
        rPoint.setTime(LocalDateTime.now());
        boolean redirect = true;
        try {
            rPoint.setX(Double.parseDouble(req.getParameter("X")));
            rPoint.setY(Double.parseDouble(req.getParameter("Y")));
            rPoint.setR(Double.parseDouble(req.getParameter("R")));
            redirect = Boolean.parseBoolean(req.getParameter("redirect"));
        } catch (NumberFormatException e) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST);
        }

        long startTime = System.nanoTime() / 1000;
        rPoint.setHit(isHit(rPoint));
        long endTime = System.nanoTime() / 1000;
        rPoint.setCalculationTime(endTime - startTime);

        DataBean data = (DataBean) req.getSession().getAttribute("data");
        if (data == null) {
            data = new DataBean();
            req.getSession().setAttribute("data", data);
        }
        data.addRPoint(rPoint);
        req.getSession().setAttribute("data", data);
        if (redirect) {
            resp.sendRedirect(req.getContextPath() + "/result.jsp");
        } else {
            PrintWriter out = resp.getWriter();
            resp.setContentType("application/json");
            resp.setCharacterEncoding("UTF-8");
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.findAndRegisterModules();
            String jsonResponse = objectMapper.writeValueAsString(rPoint);
            out.print(jsonResponse);
            out.flush();
        }
    }

    private boolean isHit(RPoint rPoint) {
        double x = rPoint.getX();
        double y = rPoint.getY();
        double r = rPoint.getR();
        double firstAreaA = Math.abs(x) / (r / 7) - 3;
        double firstSecondAreaA = Math.abs(y / (r / 7) + (double) 3 / 7 * Math.sqrt(33));
        double firstSecondAreaB = Math.pow((y / (r / 7)) / 3, 2);
        double firstSecondAreaC = Math.sqrt(Math.abs(firstSecondAreaA) / firstSecondAreaA);
        boolean firstArea = (y / (r / 7)) >= 0 && Math.pow(x / r, 2)
                * Math.sqrt(Math.abs(firstAreaA) / (firstAreaA))
                + firstSecondAreaB
                * firstSecondAreaC
                - 1 <= 0;

        double secondAreaA = Math.abs(x) / (r / 7) - 4;
        boolean secondArea = (y / (r / 7)) < 0 && Math.pow(x / r, 2)
                * Math.sqrt(Math.abs(secondAreaA) / (secondAreaA))
                + firstSecondAreaB
                * firstSecondAreaC
                - 1 <= 0;

        boolean thirdArea = (y / (r / 7)) < 0 && Math.abs((x / (r / 7)) / 2)
                - (3 * Math.sqrt(33) - 7) * Math.pow((x / (r / 7)), 2) / 112
                - 3 + Math.sqrt(1 - Math.pow(Math.abs(Math.abs(x) / (r / 7) - 2) - 1, 2))
                - y / (r / 7) <= 0;

        boolean fourthArea = Math.abs(x) / (r / 7) <= 1 && Math.abs(x) / (r / 7) >= 0.75
                && y / (r / 7) <= 3 && y / (r / 7) >= 0
                && 9 - 8 * Math.abs(x) / (r / 7) >= y / (r / 7);

        boolean fifthArea = y / (r / 7) >= 0
                && Math.abs(x) / (r / 7) <= 0.75 && Math.abs(x) / (r / 7) >= 0.5
                && 3 * Math.abs(x) / (r / 7) + 0.75 >= y / (r / 7);

        boolean sixthArea = x / (r / 7) <= 0.5 && x / (r / 7) >= -0.5
                && y / (r / 7) >= 0
                && y / (r / 7) <= 2.25;

        double seventhAreaA = Math.abs(x) / (r / 7) - 1;
        boolean seventhArea = y / (r / 7) >= 0 && 6 * Math.sqrt(10) / 7
                + (1.5 - 0.5 * Math.abs(x) / (r / 7))
                * Math.sqrt(Math.abs(seventhAreaA) / seventhAreaA)
                - 6 * Math.sqrt(10) / 14
                * Math.sqrt(4 - Math.pow(seventhAreaA, 2)) >= y / (r / 7);

        return firstArea || secondArea || thirdArea
                || fourthArea || fifthArea || sixthArea || seventhArea;
    }
}
