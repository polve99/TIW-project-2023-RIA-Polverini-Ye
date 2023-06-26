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

@WebServlet("/Registration")
@MultipartConfig
public class Registration extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection connection = null;
	
    public Registration() {
        super();
    }
    
    @Override
    public void init() throws ServletException {
    	connection = ConnectionHandler.getConnection(getServletContext());
    }

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String surname = StringEscapeUtils.escapeJava(request.getParameter("surname"));
		String name = StringEscapeUtils.escapeJava(request.getParameter("name"));
		String userMail = StringEscapeUtils.escapeJava(request.getParameter("email"));
		String password = StringEscapeUtils.escapeJava(request.getParameter("password"));
		String repeatedPassword = StringEscapeUtils.escapeJava(request.getParameter("repeatedPassword"));
		String telephone = StringEscapeUtils.escapeJava(request.getParameter("telephone"));
		String address = StringEscapeUtils.escapeJava(request.getParameter("address"));
		Pattern emailPattern = Pattern.compile("^(.+)@(.+)$");
		Pattern telehonePattern = Pattern.compile("\\d+");
		boolean telValid = false;;
		if (telephone != null) {
			telValid = telehonePattern.matcher(telephone).matches();
		}
		boolean emailValid = emailPattern.matcher(userMail).matches();
		boolean isBadRequest = true;
		String badRequestMessage = "";
		if (name == null || password == null || repeatedPassword == null || userMail == null || surname == null || address == null ||
				name.isBlank() || password.isBlank() || repeatedPassword.isBlank() || userMail.isBlank() || surname.isBlank() || address.isBlank()) {
			badRequestMessage = "Missing parameters";
		} else if (!emailValid) {
			badRequestMessage = "Email not valid";
		} else if (!password.equals(repeatedPassword)) {
			badRequestMessage = "Password and repeated password are different";
		} else if (password.length() < 8) {
			badRequestMessage = "Password must be at least of 8 characters";
		} else if(telephone != null && !telValid) {
			badRequestMessage = "Telephone number not valid";
		} else {
			isBadRequest = false;
		}
		if (isBadRequest) {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			response.getWriter().println(badRequestMessage);
			return;
		}
		UserDAO userDAO = new UserDAO(connection);
		User user = null;
		try {
			user = userDAO.createUser(userMail, password, name, surname, telephone, address);
		} catch (SQLException e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.getWriter().println("Internal server error, please retry later");
			return;
		}
		if (user == null) {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			response.getWriter().println("Username or password are not correct");
			return;
		}
		HttpSession session = request.getSession(true);
		session.setAttribute("user", user);
		response.setStatus(HttpServletResponse.SC_OK);
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().println(userMail);
	}
	
	@Override
	public void destroy() {
		ConnectionHandler.closeConnection(connection);
	}

}