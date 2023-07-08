package controllers;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.google.gson.Gson;

import beans.Article;
import beans.Auction;
import beans.Bid;
import beans.User;
import dao.ArticleDAO;
import dao.AuctionDAO;
import dao.BidDAO;
import utilis.ConnectionHandler;

@WebServlet("/CookieController")
public class CookieController extends HttpServlet{
	    private static final long serialVersionUID = 1L;
	    private Connection connection = null;
	    private AuctionDAO auctionDAO;
	    private ArticleDAO articleDAO;
	    private BidDAO bidDAO;

	    public CookieController() {
	        super();
	    }

	    @Override
	    public void init() throws ServletException {
	        connection = ConnectionHandler.getConnection(getServletContext());
	        auctionDAO = new AuctionDAO(connection);
	        articleDAO = new ArticleDAO(connection);
	        bidDAO = new BidDAO(connection);
	    }

	    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	        HttpSession session = request.getSession(false);
	        if (session == null || session.getAttribute("user") == null) {
	            response.sendRedirect(request.getContextPath() + "/Login");
	            return;
	        }

	        User user = (User) session.getAttribute("user");
	        String listAsteId = request.getParameter("listAsteId");
	        
	        

	        //here starts the retreiving infos for open auctions table

	        List<Auction> auctionListOpen = new ArrayList<>();
	        try {
	        	auctionListOpen = auctionDAO.findAuctionsListByCookie(listAsteId);
	        } catch (Exception e) {
	        	e.printStackTrace();
	        }

	        List<Map<String, Object>> auctionInfoList = new ArrayList<>();
	        for (Auction auction : auctionListOpen) {
	            List<Article> articles = null;
	            Bid maxBid = null;
	            float maxBidValue;
	            try {
	                articles = articleDAO.findArticlesListByIdAuction(auction.getIdAuction());  //fare join tra article e auctions per prendere questo
	                maxBid = bidDAO.findMaxBidInAuction(auction.getIdAuction());
	                if(maxBid==null) {
	                	maxBidValue = auction.getInitialPrice();
	                }else {
	                	maxBidValue = maxBid.getBidValue();
	                }
	            } catch (SQLException e) {
	                e.printStackTrace();
	                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Internal db error in finding auctions' informations");
	                return;
	            }
	            Timestamp expirationDateTime = auction.getExpirationDateTime();

	            Map<String, Object> auctionInfo = new HashMap<>();
	            auctionInfo.put("idAuction", auction.getIdAuction());
	            auctionInfo.put("articles", articles);
	            auctionInfo.put("maxBidValue", maxBidValue);
	            auctionInfo.put("minRise", auction.getMinRise());
	            auctionInfo.put("timeLeftFormatted", formatTimeLeft(expirationDateTime));

	            auctionInfoList.add(auctionInfo);
	        }
	        Gson gson = new Gson();
	        String auctionInfoListString = gson.toJson(auctionInfoList);

	        

	        response.setStatus(HttpServletResponse.SC_OK);
			response.setContentType("application/json");
			response.setCharacterEncoding("UTF-8");
			response.getWriter().println(auctionInfoListString);
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

	    @Override
	    public void destroy() {
	        ConnectionHandler.closeConnection(connection);
	    }
}
