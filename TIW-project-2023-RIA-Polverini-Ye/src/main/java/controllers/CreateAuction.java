package controllers;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.annotation.WebServlet;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.Part;

import org.apache.commons.lang.StringEscapeUtils;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.WebContext;

import com.google.gson.Gson;

import dao.ArticleDAO;
import dao.AuctionDAO;
import beans.User;
import beans.Article;
import utilis.ConnectionHandler;
import utilis.ThymeleafTemplateEngineCreator;


@WebServlet("/CreateAuction")
@MultipartConfig

public class CreateAuction extends HttpServlet{
	private static final long serialVersionUID = 1L;
    private Connection connection = null;
    //private TemplateEngine templateEngine = null;

    public CreateAuction() {
        super();
    }

    @Override
    public void init() throws ServletException {
        ServletContext servletContext = getServletContext();
        connection = ConnectionHandler.getConnection(servletContext);
        //templateEngine = ThymeleafTemplateEngineCreator.getTemplateEngine(servletContext);
        
    }
    
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	
    	ArrayList<Article> articleList = new ArrayList<Article>();
    	User user = (User) request.getSession().getAttribute("user");
    	
    	int i = 0;
    	float initialPrice = 0;
    	
    	LocalDateTime dateTime = LocalDateTime.now();
    	System.out.println("funziona fino a qui?"); //SI
        int daysToAdd = Integer.parseInt(StringEscapeUtils.escapeJava(request.getParameter("duration"))); 

        LocalDateTime newDateTime = dateTime.plusDays(daysToAdd); 
        Timestamp time = Timestamp.valueOf(newDateTime);

        //System.out.println(time +" "+ dateTime);
    	
        //System.out.println(daysToAdd);
    	
        String minRise =StringEscapeUtils.escapeJava(request.getParameter("minRise"));
        String[] selectedImages = request.getParameterValues("articleToUpload");
        String[] escapedImages = new String[selectedImages.length];
        for (int j = 0; j < selectedImages.length; j++) {
          escapedImages[j] = StringEscapeUtils.escapeJava(selectedImages[j]);
        }
        
        for(String image1 : escapedImages) {
        	System.out.println(image1);
        }

    	//System.out.println(Arrays.toString(escapedImages));
        
        AuctionDAO auctionDAO = new AuctionDAO(connection);
        ArticleDAO articleDAO = new ArticleDAO(connection);
        
        int aucId = 0;
        
        for(String image : escapedImages) { //cambiato vedere se funziona
        	try {
        		Article article = new Article();
        		article = articleDAO.findArticleByImage(image);
        		articleList.add(article);
        		
        	} catch (SQLException e) {
    			e.printStackTrace();
    			response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Internal server error, retry later");
    			return;
    		}
        	initialPrice += articleList.get(i).getArticlePrice();
        	i++;
        	System.out.println(initialPrice);
        }
        
        float rise = 0;
        try {
        	rise = Float.parseFloat(minRise);
        } catch (Exception e) {
        	response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        	response.getWriter().println("minimum rise provided with the wrong format");  //ESEMPIO DI ERRORE DA FARE OVUNQUE
        }
        
        //TODO: fare controlli su rise
        
        
        try {
			aucId = auctionDAO.createAuction(initialPrice, rise, time, user.getUserMail());
		} catch (NumberFormatException | SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
        
        try {
			auctionDAO.addArticlesInAuction(aucId, articleList);
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
        
        
        
        
        Map<String,Object> AuctionMapToAddLater = new HashMap<String, Object>();
        AuctionMapToAddLater.put("idAuction", aucId);
        AuctionMapToAddLater.put("Article", articleList);
        AuctionMapToAddLater.put("MinRise", rise);
        AuctionMapToAddLater.put("MaxBidValue", initialPrice);
        AuctionMapToAddLater.put("TimeLeft", formatTimeLeft(time));
        
        Gson gson = new Gson();
        String AuctionMapToAddLaterString = gson.toJson(AuctionMapToAddLater);
        
        response.setStatus(HttpServletResponse.SC_OK);
  	    response.setContentType("application/json");
  	    response.setCharacterEncoding("UTF-8");
  	    response.getWriter().println(AuctionMapToAddLaterString); // message da prendere una volta che ho fatto la makecall nel case 200 per creare l'asta
        
    }
    
    private String formatTimeLeft(Timestamp expirationDateTime) {
        long timeLeftMillis = expirationDateTime.getTime() - System.currentTimeMillis();

        long seconds = timeLeftMillis / 1000;
        long days = seconds / (24 * 60 * 60);
        seconds %= (24 * 60 * 60);
        long hours = seconds / (60 * 60);
        seconds %= (60 * 60);
        long minutes = seconds / 60;
        seconds %= 60;

        return String.format("%d days, %02d:%02d:%02d", days, hours, minutes, seconds);
    }

}


