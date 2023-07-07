package controllers;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@WebServlet("/Logout")
public class Logout extends HttpServlet{
    private static final long serialVersionUID = 1L;

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{

        //Take the session if it exists
        HttpSession session = request.getSession(false);

        //Invalidate session
        if (session != null) {
            session.invalidate();
            response.setStatus(HttpServletResponse.SC_OK);
            //return;
        }

        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
    }
}