package controller;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;

import java.io.IOException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@WebServlet("/MyMVC")
public class ControllerServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Pattern pattern = Pattern.compile("^X=.*&Y=.*&R=.*$");
        Matcher matcher = pattern.matcher(req.getQueryString() == null ? "" : req.getQueryString());
        if(matcher.matches()) {
            req.getRequestDispatcher("AreaCheck").forward(req, resp);
        }
        else {
            req.getRequestDispatcher("index.jsp").forward(req, resp);
        }
    }
}