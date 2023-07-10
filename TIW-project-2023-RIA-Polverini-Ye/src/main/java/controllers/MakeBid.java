package controllers;

import beans.Auction;
import beans.Bid;
import beans.User;
import dao.AuctionDAO;
import dao.BidDAO;

import utilis.ConnectionHandler;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.regex.Pattern;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.google.gson.Gson;

@WebServlet("/MakeBid")
public class MakeBid extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private Connection connection = null;

    public MakeBid() {
        super();
        // TODO Auto-generated constructor stub
    }

    @Override
    public void init() throws ServletException {
        connection = ConnectionHandler.getConnection(getServletContext());
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession(false);

        User user = (User) session.getAttribute("user");
        String userMail = user.getUserMail();

        BidDAO bidDAO = new BidDAO(connection);
        AuctionDAO auctionDAO = new AuctionDAO(connection);

        int idAuction = (int) session.getAttribute("idAuction");
        
        if(request.getParameter("bidValue") == null || request.getParameter("bidValue").isEmpty() ){
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().println("Bid value null or empty");
            return;
        }

        if(!isNumber(request.getParameter("bidValue"))) {
        	response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().println("Bid value must be a number");
            return;
        }
        
        float bidValue = Float.parseFloat(request.getParameter("bidValue"));
        Bid responseBid = null;
        
        if(bidValue <= 0){
        	response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().println("Bid value must be greater than 0");
            return;
        } else {
            try {
                Auction auction = auctionDAO.findAuctionByIdAuction(idAuction);

                if(userMail.equals(auction.getUserMail())) {
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    response.getWriter().println("You created this auction! You cannot place a bid!");
                    return;
                } else if(!auction.isOpen()){
                	response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    response.getWriter().println("Auction is closed");
                    return;
                } else if(!auctionDAO.isAuctionNotExpired(idAuction)) {
                	response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    response.getWriter().println("Auction is expired");
                    return;
                }

                float minRise = auction.getMinRise();
                Bid maxBid = bidDAO.findMaxBidInAuction(idAuction);

                String maxBidderMail= null;
                if(maxBid != null){
                    maxBidderMail = maxBid.getUserMail();
                }
                if(maxBidderMail != null && maxBidderMail.equals(userMail)){
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    response.getWriter().println("You are the current max bidder! You cannot place a bid!");
                    return;
                }

                if(maxBid == null){
                    if(bidValue <= auction.getInitialPrice()) {
                        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                        response.getWriter().println("Bid value too low (must be greater than/equal the initial price (" + auction.getInitialPrice() + "))");
                        return;
                    }
                } else {
                    float maxBidValue = maxBid.getBidValue();
                    if(bidValue < maxBidValue + minRise) {
                        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                        response.getWriter().println("Bid value too low (must be greater than the current bid value (" + maxBidValue + ") + min rise (" + minRise + "))");
                        return;
                    }
                }
            } catch (SQLException e) {
                e.printStackTrace();
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Internal server error in db. Please, retry later.");
                return;
            }
            int idToReturn=0;
            try {
	            Timestamp bidDateTime = new Timestamp(System.currentTimeMillis());
	            idToReturn=bidDAO.createBid(bidValue, userMail, idAuction, bidDateTime);
	            responseBid = new Bid(idToReturn, user.getUserMail(), bidValue, bidDateTime, idAuction);
	            Gson gson = new Gson();
	            String object = gson.toJson(responseBid);
	            System.out.println(object);
	            response.setStatus(HttpServletResponse.SC_OK);
	            response.getWriter().println(object);
           } catch (SQLException e) {
               	e.printStackTrace();
               	response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
               	response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Internal server error in db, bid not created. Please, retry later.");
               	return;
           }
        }
    }
    private boolean isNumber(String num) {
    	Pattern numberPattern = Pattern.compile("\\d+");
		if (num.length()>0) {
			return numberPattern.matcher(num).matches();
		} else {
			return false;
		}
    }
}
