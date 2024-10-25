package controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class ControllerServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        if (req.getQueryString() == null) {
            resp.sendRedirect(req.getContextPath() + "/index.jsp");
            return;
        }
        if (req.getQueryString().equals("data")) {
            PrintWriter out = resp.getWriter();
            resp.setContentType("application/json");
            resp.setCharacterEncoding("UTF-8");
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.findAndRegisterModules();
            String jsonResponse = objectMapper.writeValueAsString(req.getSession().getAttribute("data"));
            out.print(jsonResponse);
            out.flush();
            return;
        }
        Pattern pattern = Pattern.compile("^X=.*&Y=.*&R=.*&redirect=.[^&]*$");
        Matcher matcher = pattern.matcher(req.getQueryString());
        if (matcher.matches()) {
            req.getRequestDispatcher("/areaCheck").forward(req, resp);
        } else {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST);
        }
    }
}