package controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;
import model.Data;
import model.PointBean;

import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDateTime;

@WebServlet("/AreaCheck")
public class AreaCheckServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        PointBean pointBean = new PointBean();
        pointBean.setTime(LocalDateTime.now());
        boolean redirect;
        try {
            pointBean.setX(Double.parseDouble(req.getParameter("X")));
            pointBean.setY(Double.parseDouble(req.getParameter("Y")));
            pointBean.setR(Double.parseDouble(req.getParameter("R")));
            redirect = Boolean.parseBoolean(req.getParameter("redirect"));
        } catch (Exception e) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        long startTime = System.nanoTime() / 1000;
        pointBean.setHit(isHit(pointBean));
        long endTime = System.nanoTime() / 1000;
        pointBean.setCalculationTime(endTime - startTime);

        Data data = (Data) req.getSession().getAttribute("data");
        if (data == null) {
            data = new Data();
            req.getSession().setAttribute("data", data);
        }
        data.addRPoint(pointBean);
        req.getSession().setAttribute("data", data);
        if (redirect) {
            resp.sendRedirect(req.getContextPath() + "/jsp/result.jsp");
        } else {
            PrintWriter out = resp.getWriter();
            resp.setContentType("application/json");
            resp.setCharacterEncoding("UTF-8");
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.findAndRegisterModules();
            String jsonResponse = objectMapper.writeValueAsString(pointBean);
            out.print(jsonResponse);
            out.flush();
        }
    }

    private boolean isHit(PointBean pointBean) {
        double x = pointBean.getX();
        double y = pointBean.getY();
        double r = pointBean.getR();
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
