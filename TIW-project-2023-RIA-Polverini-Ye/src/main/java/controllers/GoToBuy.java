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


@WebServlet("/GoToBuy")
public class GoToBuy extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private Connection connection = null;
    private AuctionDAO auctionDAO;
    private ArticleDAO articleDAO;
    private BidDAO bidDAO;

    public GoToBuy() {
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
        String keyword = request.getParameter("keyword");

        //here starts the retreiving infos for open auctions table

        List<Auction> auctionListOpen = new ArrayList<>();
        try {
            if (keyword != null && !keyword.isBlank()) {
                auctionListOpen = auctionDAO.findAuctionsListByWordSearch(keyword);
            } else {
                auctionListOpen = auctionDAO.getAllOpenAuctions();
            }
        } catch (SQLException e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Internal db error in finding auctions");
            return;
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
                response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Internal db error in finding auctions' informations");
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

        //here starts the retreiving infos for closed won auctions table

        ArrayList<Map<String, Object>> wonAuctionInfoList = new ArrayList<>();
        try {
            ArrayList<Auction> wonAuctions = auctionDAO.getWonClosedAuctionsByUser(user.getUserMail());

            for (Auction auction : wonAuctions) {
                ArrayList<Object> auctionClosedInfos = auctionDAO.getAuctionClosedInfosForTable(auction);

                Map<String, Object> auctionInfo = new HashMap<>();

                auctionInfo.put("idAuction", auction.getIdAuction());
                auctionInfo.put("maxBidValue", ((Bid)auctionClosedInfos.get(0)).getBidValue());
                auctionInfo.put("articles", auctionClosedInfos.get(1));

                wonAuctionInfoList.add(auctionInfo);
            }
        } catch (SQLException e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Internal db errori in retrieving won auctions");
            return;
        }
        
        if (auctionInfoList.isEmpty()) {
            if (keyword != null && !keyword.isBlank()) {
            	response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().println("There are no open auctions for the keyword: "+keyword+".");
                return;
             }
        }
        
        /*
        HashMap<String,String> errMsg = new HashMap<>();
        
        if (auctionInfoList.isEmpty()) {
            if (keyword != null && !keyword.isBlank()) {
            	errMsg.put("NoOpenAuctionsMsg", "There are no open auctions for the keyword: "+keyword+".");
                //ctx.setVariable("NoOpenAuctionsMsg", "There are no open auctions for the keyword: "+keyword+".");
            } else {
            	errMsg.put("NoOpenAuctionsMsg", "There are no open auctions at this time.");
                //ctx.setVariable("NoOpenAuctionsMsg", "There are no open auctions at this time.");
            }
        }

        if (wonAuctionInfoList.isEmpty()) {
        	errMsg.put("NoWonAuctionsMsg", "You haven't won any auctions yet.");
            //ctx.setVariable("NoWonAuctionsMsg", "You haven't won any auctions yet.");
        }

        String errorString = (String) request.getAttribute("errorString"); //from GoToAuction servlet
        if (errorString != null) {
        	errMsg.put("errorString", errorString);
            //ctx.setVariable("errorString", errorString);
        }
        
        session.setAttribute("from", "BuyPage"); //used in GoToAuction for handling errors
        
        */
        
        String wonAuctionInfoListString = gson.toJson(wonAuctionInfoList);
        String finalObject = "{\"auctionInfoList\": " + auctionInfoListString + ",\n" + "\"wonAuctionInfoList\": " + wonAuctionInfoListString + "\n}";
        
        response.setStatus(HttpServletResponse.SC_OK);
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().println(finalObject);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Chiamiamo il metodo doGet per gestire la logica comune alle richieste GET e POST
        doGet(request, response);
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
