package controllers;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.regex.Pattern;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang.StringEscapeUtils;


import beans.User;
import dao.UserDAO;
import utilis.ConnectionHandler;

@WebServlet("/Login")
@MultipartConfig
public class Login extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private Connection connection = null;
 

    public Login() {
        super();
    }

    @Override
    public void init() throws ServletException {
        connection = ConnectionHandler.getConnection(getServletContext());
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
     
        String userMail = StringEscapeUtils.escapeJava(request.getParameter("userMail"));
        Pattern emailPattern = Pattern.compile("^(.+)@(.+)$");
        boolean emailValid = emailPattern.matcher(userMail).matches();

        if (userMail==null || userMail.isBlank() || userMail.length() < 5 || userMail.length() > 50 || !emailValid) {
        	response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			response.getWriter().println("Missing parameters or not valid");
			return;
        }

        String passw = StringEscapeUtils.escapeJava(request.getParameter("password"));
        if (passw==null || passw.isBlank() || passw.length() < 8 || passw.length() > 50) {
        	response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			response.getWriter().println("Missing parameters or not valid");
			return;
        }

        UserDAO userDAO = new UserDAO(connection);
        User user = null;

       
        try {
            user = userDAO.getUserAfterAuthentication(userMail, passw);

        } catch (SQLException e) {
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Internal error in retreiving user from db, please retry later");
            return;
        }
        if(user == null) {
        	response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			response.getWriter().println("User not found: username or password are not correct");
			return;
        }
        

        HttpSession session = request.getSession(true);
		session.setAttribute("user", user);
		response.setStatus(HttpServletResponse.SC_OK);
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().println(user.getName());
    }

    @Override
    public void destroy() {
        ConnectionHandler.closeConnection(connection);
    }
}