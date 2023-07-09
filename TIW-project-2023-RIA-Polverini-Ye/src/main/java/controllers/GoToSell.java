package controllers;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import beans.Article;
import beans.Auction;
import beans.Bid;
import beans.User;
import dao.ArticleDAO;
import dao.AuctionDAO;
import dao.BidDAO;

import com.google.gson.Gson;

import utilis.ConnectionHandler;

@WebServlet("/GoToSell")
public class GoToSell extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private Connection connection = null;
    
    private AuctionDAO auctionDAO;
    private ArticleDAO articleDAO;
    private BidDAO bidDAO;

    public GoToSell() {
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

        List<Auction> auctionListOpen = new ArrayList<>();
        try {
         auctionListOpen = auctionDAO.getAllOpenAuctionsByUser(user.getUserMail());
        } catch (SQLException e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Internal db error in finding auctions");
            return;
        }
        
        List<Map<String, Object>> auctionInfoList = new ArrayList<>();
        for (Auction auction : auctionListOpen) {
            List<Article> articles = null;
            Bid maxBid = null;
            float maxBidValue;
            try {
                articles = articleDAO.findArticlesListByIdAuction(auction.getIdAuction());
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

        ArrayList<Map<String, Object>> ownClosedAuctionInfoList = new ArrayList<>();
        List<Article> imageList1 = new ArrayList<>();
        
        try {
            ArrayList<Auction> ownClosedAuctions = auctionDAO.getAllClosedAuctionsByUser(user.getUserMail());
            
            for (Auction auction : ownClosedAuctions) {
                ArrayList<Object> auctionClosedInfos = auctionDAO.getAuctionClosedInfosForTable(auction);

                Map<String, Object> auctionInfo = new HashMap<>();
                
                auctionInfo.put("idAuction", auction.getIdAuction());
               
                
                if(auctionClosedInfos.get(0)==null) {
                	auctionInfo.put("maxBidValue", "No bidders.");
                } else {
                	auctionInfo.put("maxBidValue", ((Bid)auctionClosedInfos.get(0)).getBidValue());
                }
                
                auctionInfo.put("articles", auctionClosedInfos.get(1));

                ownClosedAuctionInfoList.add(auctionInfo);
            }
            
        	ArticleDAO articleDAO = new ArticleDAO(connection);
        	try {
    			imageList1 = articleDAO.findImagesByUser(user.getUserMail());
    		} catch (SQLException e) {
    			// TODO Auto-generated catch block
    			e.printStackTrace();
    		}
        	/*List<String> imageList = new ArrayList<>();
        	for (String image : imageList1) {
        		String userHome = System.getProperty("user.home");
                String pathString = userHome + "/git/TIW-project-2023-pure-HTML-Polverini-Ye/TIW-project-2023-pure-HTML-Polverini-Ye/src/main/webapp";
                Path imagePath = Paths.get(pathString);
        		//System.out.println("Webapp path: " + webappPath);

        		String imageDirectory = imagePath+image;
        		imageList.add(imageDirectory);
        	}*/
            
        } catch (SQLException e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Error retrieving won auctions");
        }
        
        Gson gson = new Gson();
        String auctionInfoListString = gson.toJson(auctionInfoList);
        String ownClosedAuctionInfoListString = gson.toJson(ownClosedAuctionInfoList);
        String imageList1String = gson.toJson(imageList1);
        String finalObject1 = "{\"auctionInfoList\": " + auctionInfoListString + ",\n" + "\"ownClosedAuctionInfoList\": " + ownClosedAuctionInfoListString + ",\n" + "\"imageList\": " + imageList1String + "\n}";
    	
        response.setStatus(HttpServletResponse.SC_OK);
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().println(finalObject1);
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

    @Override
    public void destroy() {
        ConnectionHandler.closeConnection(connection);
    }
}
