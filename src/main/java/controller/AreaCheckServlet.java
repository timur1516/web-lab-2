package controller;

import com.google.gson.Gson;
import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;
import model.DataBean;
import model.RPoint;

import java.io.IOException;
import java.time.LocalDateTime;

@WebServlet("/AreaCheck")
public class AreaCheckServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        RPoint rPoint = new RPoint();

        rPoint.setTime(LocalDateTime.now());

        try {
            rPoint.setX(Double.parseDouble(req.getParameter("X")));
            rPoint.setY(Double.parseDouble(req.getParameter("Y")));
            rPoint.setR(Double.parseDouble(req.getParameter("R")));
        } catch (NumberFormatException e) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST);
        }

        long startTime = System.nanoTime() / 1000;
        rPoint.setHit(isHit(rPoint));
        long endTime = System.nanoTime() / 1000;
        rPoint.setCalculationTime(endTime - startTime);

        DataBean data = (DataBean) req.getSession().getAttribute("data");
        if(data == null) {
            data = new DataBean();
            req.getSession().setAttribute("data", data);
        }
        data.addRPoint(rPoint);
        req.getSession().setAttribute("data", data);

        resp.sendRedirect(req.getContextPath() + "/result.jsp");
    }

    private boolean isHit(RPoint rPoint) {
        double x = rPoint.getX();
        double y = rPoint.getY();
        double r = rPoint.getR();
        return ((x * x + y * y) <= r * r && x <= 0 && y >= 0) ||
                (x >= 0 && x <= r && y >= 0 && y <= r) ||
                (y <= 0 && y >= -r && x * 2 <= r && y >= 2 * x - r);
    }
}
