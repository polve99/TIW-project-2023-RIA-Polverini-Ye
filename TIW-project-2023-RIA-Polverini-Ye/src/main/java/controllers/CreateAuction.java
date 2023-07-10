package controllers;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.annotation.WebServlet;
import javax.servlet.annotation.MultipartConfig;

import org.apache.commons.lang.StringEscapeUtils;

import com.google.gson.Gson;

import dao.ArticleDAO;
import dao.AuctionDAO;
import beans.User;
import beans.Article;
import utilis.ConnectionHandler;

@WebServlet("/CreateAuction")
@MultipartConfig

public class CreateAuction extends HttpServlet{
	private static final long serialVersionUID = 1L;
    private Connection connection = null;

    public CreateAuction() {
        super();
    }

    @Override
    public void init() throws ServletException {
        ServletContext servletContext = getServletContext();
        connection = ConnectionHandler.getConnection(servletContext);
    }
    
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        ArrayList<Article> articleList = new ArrayList<Article>();
        User user = (User) request.getSession().getAttribute("user");

        try {
            connection.setAutoCommit(false);
        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Internal server error, retry later");
            return;
        }

        int i = 0;
        float initialPrice = 0;

        if (!isNumber(StringEscapeUtils.escapeJava(request.getParameter("duration")))) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().println("missing duration or wrong format");
            return;
        }

        int daysToAdd = Integer.parseInt(StringEscapeUtils.escapeJava(request.getParameter("duration")));
        if (daysToAdd < 1 || daysToAdd > 20) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().println("the number inserted doesn't respect the range of possibilities proposed");
            return;
        }

        LocalDateTime dateTime = LocalDateTime.now();
        LocalDateTime newDateTime = dateTime.plusDays(daysToAdd);
        Timestamp time = Timestamp.valueOf(newDateTime);

        if (!isNumber(StringEscapeUtils.escapeJava(request.getParameter("minRise")))) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().println("missing minRise or wrong format");
            return;
        }

        String minRise = StringEscapeUtils.escapeJava(request.getParameter("minRise"));
        String[] selectedImages = request.getParameterValues("articleToUpload");
        String[] escapedImages = new String[selectedImages.length];

        if (selectedImages.length <= 0) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().println("missing article");
            return;
        }

        for (int j = 0; j < selectedImages.length; j++) {
            escapedImages[j] = StringEscapeUtils.escapeJava(selectedImages[j]);
        }

        AuctionDAO auctionDAO = new AuctionDAO(connection);
        ArticleDAO articleDAO = new ArticleDAO(connection);

        int aucId = 0;

        for (String image : escapedImages) {
            try {
                Article article = new Article();
                article = articleDAO.findArticleByImage(image);
                articleList.add(article);

            } catch (SQLException e) {
                e.printStackTrace();
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Internal server error, retry later");
                return;
            }
            initialPrice += articleList.get(i).getArticlePrice();
            i++;
        }

        float rise = 0;
        try {
            rise = Float.parseFloat(minRise);
            if (rise <= 0) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().println("the rise must be greater than zero");
                return;
            }
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().println("the rise inserted doesn't have the right format");
            return;
        }

        try {
            aucId = auctionDAO.createAuction(initialPrice, rise, time, user.getUserMail());
            auctionDAO.addArticlesInAuction(aucId, articleList);

            // Commit the transaction if all operations are successful
            connection.commit();
        } catch (SQLException e) {
            e.printStackTrace();

            try {
                // Rollback the transaction in case of an exception
                connection.rollback();
            } catch (SQLException ex) {
                ex.printStackTrace();
            }

            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Internal server error, retry later");
            return;
        } finally {
            try {
                // Set auto-commit back to true in the finally block
                connection.setAutoCommit(true);
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }

        Map<String, Object> auctionMapToAddLater = new HashMap<String, Object>();
        auctionMapToAddLater.put("idAuction", aucId);
        auctionMapToAddLater.put("Article", articleList);
        auctionMapToAddLater.put("MinRise", rise);
        auctionMapToAddLater.put("MaxBidValue", initialPrice);
        auctionMapToAddLater.put("TimeLeft", formatTimeLeft(time));

        Gson gson = new Gson();
        String auctionMapToAddLaterString = gson.toJson(auctionMapToAddLater);

        response.setStatus(HttpServletResponse.SC_OK);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().print(auctionMapToAddLaterString);
    }
    
    private String formatTimeLeft(Timestamp expirationDateTime) {
        long timeLeftMillis = expirationDateTime.getTime() - System.currentTimeMillis();
        
        if(timeLeftMillis<0) {
        	String msg = "expired";
        	return msg;
        }

        long seconds = timeLeftMillis / 1000;
        long days = seconds / (24 * 60 * 60);
        seconds %= (24 * 60 * 60);
        long hours = seconds / (60 * 60);
        seconds %= (60 * 60);
        long minutes = seconds / 60;
        seconds %= 60;

        return String.format("%d days, %02d:%02d:%02d", days, hours, minutes, seconds);
    }
    
    private boolean isNumber(String num) {
    	Pattern numberPattern = Pattern.compile("\\d+");
		if (num.length()>0) {
			return numberPattern.matcher(num).matches();
		} else {
			return false;
		}
    }

    @Override
    public void destroy() {
        ConnectionHandler.closeConnection(connection);
    }

}
